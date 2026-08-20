<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->with('items')
            ->withCount('items')
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->paginate((int) request('per_page', 10));

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

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $order = DB::transaction(function () use ($user, $data) {
            $cart = Cart::with(['items.product'])->firstOrCreate(['user_id' => $user->id]);

            if ($cart->items->isEmpty()) {
                abort(response()->json([
                    'success' => false,
                    'message' => 'Your cart is empty.',
                ], 422));
            }

            $subtotal = 0;
            $lineItems = [];

            foreach ($cart->items as $item) {
                $product = Product::query()->lockForUpdate()->find($item->product_id);

                if (! $product || ! $product->is_active) {
                    abort(response()->json([
                        'success' => false,
                        'message' => "Product is no longer available.",
                    ], 422));
                }

                if ($item->quantity > $product->stock) {
                    abort(response()->json([
                        'success' => false,
                        'message' => "Only {$product->stock} in stock for {$product->name}.",
                    ], 422));
                }

                $unit = (float) $product->price;
                $lineSubtotal = round($unit * $item->quantity, 2);
                $subtotal += $lineSubtotal;

                $lineItems[] = [
                    'product' => $product,
                    'product_name' => $product->name,
                    'unit_price' => $unit,
                    'quantity' => (int) $item->quantity,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $shipping = $subtotal >= 150 ? 0 : 12;
            $tax = round($subtotal * 0.08, 2);
            $total = round($subtotal + $shipping + $tax, 2);

            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => round($subtotal, 2),
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'],
                'shipping_state' => $data['shipping_state'],
                'shipping_postal_code' => $data['shipping_postal_code'],
                'shipping_country' => $data['shipping_country'] ?? 'US',
                'notes' => $data['notes'] ?? null,
                'placed_at' => now(),
            ]);

            foreach ($lineItems as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product_name'],
                    'unit_price' => $line['unit_price'],
                    'quantity' => $line['quantity'],
                    'subtotal' => $line['subtotal'],
                ]);

                $line['product']->decrement('stock', $line['quantity']);
                Cache::forget("product:{$line['product']->id}");
            }

            Cache::forget('products:list');
            Cache::forget('products:featured');

            $cart->items()->delete();

            return $order->load('items');
        });

        return response()->json([
            'success' => true,
            'message' => 'Order placed.',
            'data' => (new OrderResource($order))->resolve(),
        ], 201);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Not found.'], 404);
        }

        $order->load('items.product', 'user');

        return response()->json([
            'success' => true,
            'data' => (new OrderResource($order))->resolve(),
        ]);
    }
}
