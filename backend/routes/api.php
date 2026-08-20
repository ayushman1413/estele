<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{product}', [ProductController::class, 'show'])->whereNumber('product');
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show'])->whereNumber('category');

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Authenticated endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Cart
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'add']);
    Route::patch('/cart/items/{item}', [CartController::class, 'update'])->whereNumber('item');
    Route::delete('/cart/items/{item}', [CartController::class, 'remove'])->whereNumber('item');
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show'])->whereNumber('order');

    // Admin
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->whereNumber('order');
        Route::put('/orders/{order}/accept', [AdminOrderController::class, 'accept'])->whereNumber('order');
        Route::put('/orders/{order}/deny', [AdminOrderController::class, 'deny'])->whereNumber('order');
        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->whereNumber('order');

        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->whereNumber('product');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->whereNumber('product');
    });
});
