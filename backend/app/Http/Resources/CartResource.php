<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subtotal = 0;
        $items = $this->items->map(function ($item) use (&$subtotal) {
            $product = $item->product;
            $unit = (float) $product->price;
            $lineSubtotal = $unit * $item->quantity;
            $subtotal += $lineSubtotal;

            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $product->image,
                'price' => $unit,
                'quantity' => $item->quantity,
                'stock' => (int) $product->stock,
                'subtotal' => round($lineSubtotal, 2),
            ];
        });

        $shipping = $subtotal > 0 ? ($subtotal >= 150 ? 0 : 12) : 0;
        $tax = round($subtotal * 0.08, 2);
        $total = round($subtotal + $shipping + $tax, 2);

        return [
            'id' => $this->id,
            'items' => $items->values(),
            'item_count' => (int) $this->items->sum('quantity'),
            'subtotal' => round($subtotal, 2),
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ];
    }
}
