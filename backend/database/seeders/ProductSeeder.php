<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'Rings' => [
                ['Solitaire Glow Ring', 'A delicate solitaire ring crafted in 18k gold, hand-set with a brilliant-cut center stone.', 1299, 1599, 24, true, 4.8, 184, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
                ['Twisted Band', 'A modern twisted band with subtle texture, perfect for stacking or everyday wear.', 249, null, 60, false, 4.5, 92, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'],
                ['Vintage Halo Ring', 'Inspired by Art Deco, this halo ring features a round center stone framed by micro-pavé accents.', 1899, 2199, 12, true, 4.9, 64, 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80'],
                ['Signet Crest', 'An heirloom-quality signet with a polished crest, engraved by hand.', 549, null, 18, false, 4.6, 41, 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80'],
                ['Emerald Eternity', 'A full-circle emerald eternity band in platinum.', 2899, 3299, 8, true, 4.9, 28, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'],
            ],
            'Necklaces' => [
                ['Cascading Pendant', 'A cascade of three pear-cut stones on a fine cable chain.', 749, null, 32, true, 4.7, 156, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
                ['Box Chain 18"', 'Solid 18k box chain, hand-finished for a smooth drape.', 1099, null, 40, false, 4.5, 73, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
                ['Lariat Y-Drop', 'A fluid lariat necklace with a sculptural Y-drop centerpiece.', 459, 599, 22, true, 4.6, 51, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
                ['Layered Trio', 'Three layers of varying lengths, designed to be worn together.', 329, null, 28, false, 4.3, 88, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80'],
                ['Pavé Collar', 'A statement collar covered in brilliant pavé stones.', 2499, 2899, 6, true, 5.0, 19, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
            ],
            'Earrings' => [
                ['Pavé Hoops 14mm', 'Mid-size hoops pavé-set for all-day sparkle.', 549, null, 36, true, 4.7, 142, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80'],
                ['Pearl Drop Studs', 'Lustrous freshwater pearls on 14k gold posts.', 319, null, 50, false, 4.6, 73, 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80'],
                ['Diamond Climbers', 'Hand-set diamond climbers that follow the ear.', 1299, 1499, 14, true, 4.8, 47, 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80'],
                ['Tassel Drop', 'Playful tassel drops in polished 18k gold.', 459, null, 26, false, 4.4, 39, 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80'],
                ['Signature Studs', 'House signature studs in bezel-set solitaires.', 999, 1199, 18, true, 4.9, 64, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80'],
            ],
            'Bracelets' => [
                ['Tennis Bracelet', 'A continuous line of brilliant stones, secured with a double-safety clasp.', 2899, 3299, 9, true, 4.9, 38, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
                ['Cuff Bangle', 'A clean architectural cuff hand-hammered for a soft finish.', 549, null, 30, false, 4.6, 71, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'],
                ['Charm Chain', 'A fine chain bracelet with three signature charms.', 459, 599, 24, true, 4.7, 56, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
                ['Bolo Lariat', 'A modern bolo lariat with adjustable ends.', 379, null, 22, false, 4.4, 29, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80'],
                ['Open Hinged Cuff', 'A minimalist hinged cuff that opens easily and sits comfortably.', 689, null, 18, false, 4.5, 33, 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80'],
            ],
            'Watches' => [
                ['Aurora 34mm', 'A 34mm automatic with a mother-of-pearl dial and steel case.', 1899, 2199, 14, true, 4.8, 91, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'],
                ['Heritage Field', 'A vintage-inspired field watch with cream dial and leather strap.', 1499, null, 22, true, 4.7, 64, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'],
                ['Modern Mesh 28', 'A slim 28mm quartz on a steel mesh strap.', 749, null, 28, false, 4.5, 80, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
                ['Chronograph Sport', 'A precise chronograph with tachymeter and ceramic bezel.', 2499, 2899, 11, true, 4.9, 47, 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80'],
                ['Classic Tank', 'A rectangular tank-style watch with sapphire crystal.', 1799, null, 16, false, 4.6, 58, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::where('slug', Str::slug($categoryName))->first();
            if (! $category) continue;

            foreach ($products as [$name, $desc, $price, $original, $stock, $featured, $rating, $count, $img]) {
                Product::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'category_id' => $category->id,
                        'name' => $name,
                        'description' => $desc,
                        'price' => $price,
                        'original_price' => $original,
                        'stock' => $stock,
                        'image' => $img,
                        'gallery' => [$img],
                        'rating' => $rating,
                        'rating_count' => $count,
                        'is_featured' => $featured,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
