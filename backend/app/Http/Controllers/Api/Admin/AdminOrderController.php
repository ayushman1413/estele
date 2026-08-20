<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->with('items', 'user')->withCount('items');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $orders = $query->latest('id')->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => [
                'items' => OrderResource::collection($orders->items())->resolve(),
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load('items.product', 'user');

        return response()->json([
            'success' => true,
            'data' => (new OrderResource($order))->resolve(),
        ]);
    }

    public function accept(Order $order): JsonResponse
    {
        if (! in_array($order->status, ['pending'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be accepted from current status.',
            ], 422);
        }

        $order->update(['status' => 'accepted']);
        Cache::forget('admin:dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Order accepted.',
            'data' => (new OrderResource($order->fresh('items')))->resolve(),
        ]);
    }

    public function deny(Order $order): JsonResponse
    {
        if (! in_array($order->status, ['pending'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be denied from current status.',
            ], 422);
        }

        $order->update(['status' => 'denied']);
        Cache::forget('admin:dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Order denied.',
            'data' => (new OrderResource($order->fresh('items')))->resolve(),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $status = $request->validated()['status'];

        $allowed = $this->allowedTransitions($order->status);
        if (! in_array($status, $allowed, true) && $status !== $order->status) {
            return response()->json([
                'success' => false,
                'message' => "Invalid transition from {$order->status} to {$status}.",
            ], 422);
        }

        $order->update(['status' => $status]);
        Cache::forget('admin:dashboard:stats');

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'data' => (new OrderResource($order->fresh('items')))->resolve(),
        ]);
    }

    private function allowedTransitions(string $current): array
    {
        return match ($current) {
            'pending' => ['accepted', 'denied'],
            'accepted' => ['processing', 'denied'],
            'processing' => ['shipped', 'denied'],
            'shipped' => ['delivered'],
            'delivered' => [],
            'denied' => [],
            'cancelled' => [],
            default => [],
        };
    }
}
