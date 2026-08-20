<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    private function getCart(Request $request): Cart
    {
        $user = $request->user();
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->getCart($request)->load('items.product');

        return response()->json([
            'success' => true,
            'data' => (new CartResource($cart))->resolve(),
        ]);
    }

    public function add(AddCartItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        $cart = $this->getCart($request);

        $product = Product::active()->findOrFail($data['product_id']);
        $quantity = (int) ($data['quantity'] ?? 1);

        DB::transaction(function () use ($cart, $product, $quantity) {
            $item = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();

            $existing = $item?->quantity ?? 0;
            $newQty = $existing + $quantity;

            if ($newQty > $product->stock) {
                abort(response()->json([
                    'success' => false,
                    'message' => "Only {$product->stock} in stock for {$product->name}.",
                ], 422));
            }

            if ($item) {
                $item->update(['quantity' => $newQty]);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ]);
            }
        });

        $cart->load('items.product');

        return response()->json([
            'success' => true,
            'message' => 'Added to cart.',
            'data' => (new CartResource($cart))->resolve(),
        ]);
    }

    public function update(UpdateCartItemRequest $request, CartItem $item): JsonResponse
    {
        $cart = $this->getCart($request);
        if ($item->cart_id !== $cart->id) {
            return response()->json(['success' => false, 'message' => 'Not found.'], 404);
        }

        $product = $item->product()->first();
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Product missing.'], 404);
        }

        $quantity = (int) $request->validated()['quantity'];
        if ($quantity > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => "Only {$product->stock} in stock.",
            ], 422);
        }

        $item->update(['quantity' => $quantity]);
        $cart->load('items.product');

        return response()->json([
            'success' => true,
            'message' => 'Cart updated.',
            'data' => (new CartResource($cart))->resolve(),
        ]);
    }

    public function remove(Request $request, CartItem $item): JsonResponse
    {
        $cart = $this->getCart($request);
        if ($item->cart_id !== $cart->id) {
            return response()->json(['success' => false, 'message' => 'Not found.'], 404);
        }

        $item->delete();
        $cart->load('items.product');

        return response()->json([
            'success' => true,
            'message' => 'Item removed.',
            'data' => (new CartResource($cart))->resolve(),
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
            'data' => (new CartResource($cart->refresh()->load('items.product')))->resolve(),
        ]);
    }
}
