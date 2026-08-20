import ProductCard from './ProductCard';
import type { Product } from '../types';

export default function ProductGrid({ products, onAdd }: { products: Product[]; onAdd?: (p: Product) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}
