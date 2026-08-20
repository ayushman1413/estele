<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with('category')->withCount('orderItems');

        if ($q = $request->query('q')) {
            $query->where('name', 'like', "%{$q}%");
        }

        $products = $query->latest('id')->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => [
                'items' => ProductResource::collection($products->items())->resolve(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
            ],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        $product = DB::transaction(function () use ($data) {
            $product = Product::create($data + [
                'rating' => $data['rating'] ?? 0,
                'rating_count' => $data['rating_count'] ?? 0,
                'is_featured' => $data['is_featured'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);
            $this->invalidateCaches($product->id);
            return $product;
        });

        $product->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Product created.',
            'data' => (new ProductResource($product))->resolve(),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($product, $data) {
            $product->update($data);
            $this->invalidateCaches($product->id);
        });

        return response()->json([
            'success' => true,
            'message' => 'Product updated.',
            'data' => (new ProductResource($product->fresh('category')))->resolve(),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        DB::transaction(function () use ($product) {
            $product->delete();
            $this->invalidateCaches($product->id);
        });

        return response()->json([
            'success' => true,
            'message' => 'Product deleted.',
        ]);
    }

    private function invalidateCaches(int $productId): void
    {
        Cache::forget("product:{$productId}");
        Cache::forget('products:list');
        Cache::forget('products:featured');
    }
}
