<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:latest,price_asc,price_desc,rating'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:60'],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 12);

        $page = request()->integer('page', 1);
        $cacheKey = 'products:list:'.md5(json_encode($validated).'|p='.$page.'|pp='.$perPage);

        $data = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($validated, $perPage) {
            $query = Product::query()->with('category')->active();

            if (! empty($validated['q'])) {
                $term = '%'.$validated['q'].'%';
                $query->where(function ($q) use ($term) {
                    $q->where('name', 'like', $term)
                      ->orWhere('description', 'like', $term);
                });
            }

            if (! empty($validated['category_id'])) {
                $query->where('category_id', $validated['category_id']);
            }

            if (isset($validated['min_price'])) {
                $query->where('price', '>=', $validated['min_price']);
            }
            if (isset($validated['max_price'])) {
                $query->where('price', '<=', $validated['max_price']);
            }

            $sort = $validated['sort'] ?? 'latest';
            match ($sort) {
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                'rating' => $query->orderByDesc('rating')->orderByDesc('rating_count'),
                default => $query->latest('id'),
            };

            return $query->paginate($perPage);
        });

        return response()->json([
            'success' => true,
            'data' => [
                'items' => ProductResource::collection($data->items())->resolve(),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'last_page' => $data->lastPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total(),
                ],
            ],
        ]);
    }

    public function featured(): JsonResponse
    {
        $items = \Illuminate\Support\Facades\Cache::remember('products:featured', 3600, function () {
            return Product::query()->with('category')->active()->featured()->latest('id')->limit(8)->get();
        });

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($items)->resolve(),
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load('category');
        $product->increment('rating_count', 0); // touch relation to ensure consistent response

        return response()->json([
            'success' => true,
            'data' => (new ProductResource($product))->resolve(),
        ]);
    }
}
