import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { api, describeError } from '../services/api';
import type { Category, Paginated, Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';
import EmptyState from './../components/EmptyState';
import { useCart } from '../context/CartContext';

const sorts = [
  { value: 'latest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to high' },
  { value: 'price_desc', label: 'Price: High to low' },
  { value: 'rating', label: 'Top rated' },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const { addItem } = useCart();

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const minPrice = params.get('min_price') ?? '';
  const maxPrice = params.get('max_price') ?? '';
  const sort = params.get('sort') ?? 'latest';
  const page = Number(params.get('page') ?? 1);

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Paginated<Product>['meta'] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ q, min_price: minPrice, max_price: maxPrice });

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const url = new URLSearchParams();
    if (q) url.set('q', q);
    if (category) url.set('category_id', category);
    if (minPrice) url.set('min_price', minPrice);
    if (maxPrice) url.set('max_price', maxPrice);
    if (sort) url.set('sort', sort);
    if (page > 1) url.set('page', String(page));

    api.get(`/products?${url.toString()}`)
      .then((r) => {
        if (!alive) return;
        setProducts(r.data.data.items);
        setMeta(r.data.data.meta);
      })
      .catch((err) => describeError(err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [q, category, minPrice, maxPrice, sort, page]);

  const setParam = (key: string, val: string) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const onSubmitFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setParam('q', draft.q);
    setParam('min_price', draft.min_price);
    setParam('max_price', draft.max_price);
  };

  const activeChips = useMemo(() => ([
    q && { label: `“${q}”`, onClear: () => setParam('q', '') },
    category && { label: categories.find((c) => String(c.id) === category)?.name ?? 'Category', onClear: () => setParam('category', '') },
    minPrice && { label: `≥ $${minPrice}`, onClear: () => setParam('min_price', '') },
    maxPrice && { label: `≤ $${maxPrice}`, onClear: () => setParam('max_price', '') },
  ].filter(Boolean) as { label: string; onClear: () => void }[]), [q, category, minPrice, maxPrice, categories]);

  return (
    <div className="container-x py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700">Collection</p>
          <h1 className="font-display text-4xl">Shop</h1>
          <p className="mt-1 text-sm text-ink-500">{meta ? `${meta.total} pieces` : 'Loading…'}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="label">Sort</label>
          <select
            className="input w-auto py-2"
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
          >
            {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={onSubmitFilters} className="card p-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-900">
              <Filter className="h-4 w-4" /> Filters
            </p>
            <div className="space-y-4">
              <div>
                <label className="label">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                  <input
                    value={draft.q}
                    onChange={(e) => setDraft({ ...draft, q: e.target.value })}
                    className="input pl-9"
                    placeholder="Search products"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Min</label>
                  <input type="number" min={0} value={draft.min_price} onChange={(e) => setDraft({ ...draft, min_price: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Max</label>
                  <input type="number" min={0} value={draft.max_price} onChange={(e) => setDraft({ ...draft, max_price: e.target.value })} className="input" />
                </div>
              </div>
              <button type="submit" className="btn-secondary w-full">Apply</button>
            </div>
          </form>

          <div className="card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-900">Categories</p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  onClick={() => setParam('category', '')}
                  className={`flex w-full justify-between rounded-md px-2 py-1.5 ${!category ? 'bg-ink-50 text-ink-900 font-medium' : 'text-ink-500 hover:bg-ink-50'}`}
                >
                  All <span className="text-xs text-ink-300">{meta?.total ?? '–'}</span>
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setParam('category', String(c.id))}
                    className={`flex w-full justify-between rounded-md px-2 py-1.5 ${category === String(c.id) ? 'bg-ink-50 text-ink-900 font-medium' : 'text-ink-500 hover:bg-ink-50'}`}
                  >
                    {c.name} <span className="text-xs text-ink-300">{c.products_count ?? 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {activeChips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeChips.map((c, i) => (
                <button key={i} onClick={c.onClear} className="chip border-ink-200 bg-white text-ink-700 hover:border-rose-200 hover:text-rose-600">
                  {c.label} ×
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <ProductSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products match"
              description="Try adjusting your filters or search term."
              cta={{ label: 'Clear filters', to: '/products' }}
            />
          ) : (
            <>
              <ProductGrid products={products} onAdd={(p) => addItem(p.id)} />
              {meta && meta.last_page > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: meta.last_page }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam('page', String(i + 1))}
                      className={`h-9 min-w-9 rounded-full px-3 text-sm ${page === i + 1 ? 'bg-ink-900 text-white' : 'border border-ink-200 text-ink-700 hover:bg-ink-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
