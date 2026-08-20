<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Rings',     'description' => 'Statement rings for every occasion.', 'image' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
            ['name' => 'Necklaces', 'description' => 'Layered, pendant, and choker styles.', 'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
            ['name' => 'Earrings',  'description' => 'Studs, hoops, and drop earrings.',     'image' => 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80'],
            ['name' => 'Bracelets', 'description' => 'Cuffs, chains, and charm bracelets.',  'image' => 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
            ['name' => 'Watches',   'description' => 'Modern and classic timepieces.',      'image' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                $cat + ['is_active' => true]
            );
        }
    }
}
