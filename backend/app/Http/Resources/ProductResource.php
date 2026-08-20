<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'original_price' => $this->original_price !== null ? (float) $this->original_price : null,
            'discount_percent' => $this->discount_percent,
            'stock' => (int) $this->stock,
            'in_stock' => $this->in_stock,
            'image' => $this->image,
            'gallery' => $this->gallery ?? [],
            'rating' => (float) $this->rating,
            'rating_count' => (int) $this->rating_count,
            'is_featured' => (bool) $this->is_featured,
            'is_active' => (bool) $this->is_active,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
        ];
    }
}
