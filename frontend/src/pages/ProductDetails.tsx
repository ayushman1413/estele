import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { api, describeError } from '../services/api';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantitySelector from '../components/QuantitySelector';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get(`/products/${id}`)
      .then((r) => alive && setProduct(r.data.data))
      .catch((err) => describeError(err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  if (loading || !product) return <LoadingSpinner />;

  const images = [product.image, ...(product.gallery ?? [])].filter(Boolean);
  const inStock = product.in_stock ?? product.stock > 0;

  const onAdd = async () => {
    if (!user) { navigate('/login'); return; }
    setBusy(true);
    try { await addItem(product.id, qty); } finally { setBusy(false); }
  };

  const onBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    setBusy(true);
    try {
      await addItem(product.id, qty);
      navigate('/checkout');
    } finally { setBusy(false); }
  };

  return (
    <div className="container-x py-10">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid gap-3 md:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-2 md:order-1 md:flex-col">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${imgIdx === i ? 'border-ink-900' : 'border-ink-100'}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 aspect-square overflow-hidden rounded-2xl bg-ink-50 md:order-2">
            <img src={images[imgIdx]} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div>
          {product.category && (
            <p className="mb-2 text-xs uppercase tracking-widest text-ink-500">{product.category.name}</p>
          )}
          <h1 className="font-display text-4xl font-medium leading-tight">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
            <span className="font-medium text-ink-900">{(product.rating ?? 5.0).toFixed(1)}</span>
            <span>({product.rating_count ?? 0} reviews)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-lg text-ink-300 line-through">{formatPrice(product.original_price)}</span>
            )}
            {(product.discount_percent ?? 0) > 0 && (
              <span className="rounded-full bg-ink-900 px-2 py-0.5 text-xs font-medium text-white">-{product.discount_percent}%</span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <QuantitySelector value={qty} max={product.stock} onChange={setQty} />
            <span className={`text-sm ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
              {inStock ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>


          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={!inStock || busy} onClick={onAdd} className="btn-primary">
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button disabled={!inStock || busy} onClick={onBuyNow} className="btn-gold">
              Buy now <ArrowRight className="h-4 w-4" />
            </button>
          </div>


          <div className="mt-10 grid gap-3 border-t border-ink-100 pt-8 text-sm text-ink-500 sm:grid-cols-3">
            <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free shipping over $150</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure checkout</p>
            <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> 30-day returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
