<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = \Illuminate\Support\Facades\Cache::remember('categories:list', 3600, function () {
            return Category::query()->where('is_active', true)->withCount('products')->orderBy('name')->get();
        });

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($items)->resolve(),
        ]);
    }

    public function show(Category $category): JsonResponse
    {
        $category->loadCount('products');

        return response()->json([
            'success' => true,
            'data' => (new CategoryResource($category))->resolve(),
        ]);
    }
}
