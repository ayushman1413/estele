<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $images = [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
            'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80',
            'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
            'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
        ];

        $name = $this->faker->unique()->words(3, true);
        $price = $this->faker->randomFloat(2, 25, 950);
        $hasDiscount = $this->faker->boolean(35);
        $img = $this->faker->randomElement($images);

        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'name' => ucwords($name),
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(5)),
            'description' => $this->faker->paragraph(3),
            'price' => $hasDiscount ? round($price * 0.75, 2) : $price,
            'original_price' => $hasDiscount ? $price : null,
            'stock' => $this->faker->numberBetween(0, 60),
            'image' => $img,
            'gallery' => [$img],
            'rating' => round($this->faker->randomFloat(2, 3.5, 5), 2),
            'rating_count' => $this->faker->numberBetween(5, 250),
            'is_featured' => $this->faker->boolean(40),
            'is_active' => true,
        ];
    }

    public function outOfStock(): self
    {
        return $this->state(fn () => ['stock' => 0]);
    }
}
