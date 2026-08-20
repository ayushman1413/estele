import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  onAdd?: (p: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onAdd, compact = false }: Props) {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.discount_percent ?? 0;
  const inStock = product.in_stock ?? product.stock > 0;

  // Check if item is already in user's cart
  const cartItem = cart?.items?.find((item) => item.product_id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAdd || loading) return;

    setLoading(true);
    try {
      await onAdd(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch {
      // Handled by context/toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:shadow-soft">
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-ink-50">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-900">
            Sold out
          </span>
        )}
        {quantityInCart > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
            <Check className="h-3 w-3" /> In Cart ({quantityInCart})
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80'; }}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {product.category && (
          <p className="text-[11px] uppercase tracking-widest text-ink-500">{product.category.name}</p>
        )}
        <Link to={`/products/${product.id}`} className="font-display text-lg leading-tight hover:underline text-ink-900">
          {product.name}
        </Link>

        {!compact && (
          <div className="flex items-center gap-1 text-xs text-ink-500">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            <span className="font-medium text-ink-900">{(product.rating ?? 5.0).toFixed(1)}</span>
            <span>({product.rating_count ?? 0})</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-display text-xl font-semibold text-ink-900">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-xs text-ink-400 line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>

          {onAdd && inStock && (
            <button
              type="button"
              onClick={handleClick}
              disabled={loading}
              aria-label={`Add ${product.name} to cart`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 shrink-0 ${
                loading
                  ? 'bg-ink-100 text-ink-400 cursor-wait'
                  : justAdded || quantityInCart > 0
                  ? 'bg-emerald-600 border border-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-ink-900 border border-ink-900 text-white hover:bg-gold-600 hover:border-gold-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : justAdded || quantityInCart > 0 ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added {quantityInCart > 0 ? `(${quantityInCart})` : ''}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
