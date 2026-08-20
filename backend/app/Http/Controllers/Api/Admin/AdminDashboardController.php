<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $stats = Cache::remember('admin:dashboard:stats', 60, function () {
            $revenue = (float) Order::query()
                ->whereIn('status', ['accepted', 'processing', 'shipped', 'delivered'])
                ->sum('total');

            return [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'accepted_orders' => Order::whereIn('status', ['accepted', 'processing', 'shipped'])->count(),
                'denied_orders' => Order::where('status', 'denied')->count(),
                'delivered_orders' => Order::where('status', 'delivered')->count(),
                'total_revenue' => round($revenue, 2),
                'total_products' => Product::count(),
                'total_customers' => User::where('is_admin', false)->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
