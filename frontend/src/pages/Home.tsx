import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, RotateCcw, Star } from 'lucide-react';
import { api, describeError } from '../services/api';
import type { Category, Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const features = [
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Encrypted payments, your details stay private.' },
  { icon: Truck, title: 'Fast delivery', desc: 'Free shipping on orders over $150.' },
  { icon: Sparkles, title: 'Premium quality', desc: 'Hand-finished pieces made to last.' },
  { icon: RotateCcw, title: 'Easy returns', desc: '30-day returns, no questions asked.' },
];

const testimonials = [
  { name: 'Alex R.', quote: 'The solitaire ring is breathtaking — even better in person.', rating: 5 },
  { name: 'Mira K.', quote: 'Quality is unmatched. My new everyday earrings.', rating: 5 },
  { name: 'Jordan P.', quote: 'Fast shipping, beautiful packaging. A real treat.', rating: 5 },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [f, c] = await Promise.all([api.get('/products/featured'), api.get('/categories')]);
        if (!alive) return;
        setFeatured(f.data.data);
        setCategories(c.data.data);
      } catch (err) {
        describeError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    try {
      await addItem(product.id);
    } catch {
      // Toast already handled by context
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gold-700">New season · 2026</p>
            <h1 className="font-display text-5xl font-medium leading-tight md:text-6xl lg:text-7xl">
              Crafted for every <em className="not-italic text-gold-500">occasion</em>.
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-500">
              Modern jewelry designed with intent. Made by hand, finished with care, delivered ready to wear.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products" className="btn-primary">Shop Collection <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/products?category=2" className="btn-secondary">Explore Necklaces</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-72 w-72 rounded-full bg-gold-100/70 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900&q=80"
              alt="Hero"
              className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-soft animate-fade-up"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container-x pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-700">Featured</p>
            <h2 className="font-display text-3xl md:text-4xl">House favorites</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-ink-500 hover:text-ink-900 flex items-center gap-1">
            View all collection <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <ProductSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-gold-700">Categories</p>
            <h2 className="font-display text-3xl md:text-4xl">Shop by collection</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-50 aspect-[3/4]"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-display text-2xl">{c.name}</p>
                  <p className="text-xs uppercase tracking-widest opacity-80">{c.products_count ?? 0} pieces</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <f.icon className="h-6 w-6 text-gold-500" />
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-white">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80"
            alt="Showcase"
            className="aspect-[4/5] w-full rounded-3xl object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-300">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl">Crafted for every occasion.</h2>
            <p className="mt-5 max-w-md text-white/70">
              From everyday signatures to once-in-a-lifetime gifts, our pieces are built to be lived in.
            </p>
            <Link to="/products" className="btn-gold mt-7">Discover the collection</Link>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700">Loved by</p>
          <h2 className="font-display text-3xl md:text-4xl">What our clients say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-7">
              <div className="mb-3 flex gap-1 text-gold-500">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="font-display text-xl leading-snug">"{t.quote}"</p>
              <p className="mt-4 text-sm uppercase tracking-widest text-ink-500">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-ink-900 to-ink-700 p-10 text-center text-white">
          <h3 className="font-display text-3xl">Stay in the loop.</h3>
          <p className="max-w-md text-white/70">Subscribe for early access to new collections, behind-the-studio stories, and members-only events.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mt-2 flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/60 focus:border-white focus:outline-none"
            />
            <button className="btn-gold">Subscribe</button>
          </form>
          <p className="text-xs text-white/50">Demo UI — no real email service connected.</p>
        </div>
      </section>
    </>
  );
}
