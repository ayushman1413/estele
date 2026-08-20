import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
} from 'lucide-react';
import api, { describeError } from '../services/api';
import type { Category, Product } from '../types';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    is_featured: false,
    is_active: true,
  });

  const fetchData = async (targetPage = page) => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/admin/products?page=${targetPage}&per_page=12`),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.data.items);
      setPage(prodRes.data.data.meta.current_page);
      setLastPage(prodRes.data.data.meta.last_page);
      setCategories(catRes.data.data);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      category_id: categories[0]?.id?.toString() || '1',
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '10',
      image: '',
      is_featured: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category_id: (product.category_id ?? product.category?.id ?? '1').toString(),
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || '',
      is_featured: Boolean(product.is_featured),
      is_active: Boolean(product.is_active),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        category_id: parseInt(formData.category_id),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-0]+/g, '-'),
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image || undefined,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created!');
      }
      setIsModalOpen(false);
      fetchData(page);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted.');
      fetchData(page);
    } catch (err) {
      toast.error(describeError(err).message);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink-900">
            Product Inventory
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage store catalog, prices, stock levels, and featured highlights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(page)}
            disabled={loading}
            className="btn-secondary flex items-center gap-2 text-xs py-2 px-4"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-ink-200 pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-ink-200 bg-white py-2 pl-9 pr-4 text-xs focus:border-ink-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="card bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-600" />
            <p className="mt-3 text-xs text-ink-400">Loading catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 font-display text-lg text-ink-800">No products found</h3>
            <p className="text-xs text-ink-500 mt-1">Click "Add Product" to add a new piece to the catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-700">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500 border-b border-ink-100">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-ink-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=200&q=80'}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover border border-ink-100 bg-ink-50"
                        />
                        <div>
                          <p className="font-semibold text-ink-900">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.is_featured && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                                <Sparkles className="h-3 w-3" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-600 font-medium">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-ink-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 10
                            ? 'bg-emerald-50 text-emerald-700'
                            : product.stock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.is_active
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition"
                        title="Edit product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="p-4 border-t border-ink-100 flex items-center justify-between">
            <span className="text-xs text-ink-500">Page {page} of {lastPage}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1 || loading}
                className="p-1.5 border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => fetchData(page + 1)}
                disabled={page >= lastPage || loading}
                className="p-1.5 border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
              Product Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
              placeholder="e.g. Solitaire Diamond Ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
                placeholder="299.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-ink-200 p-2.5 text-xs focus:border-ink-900 focus:outline-none"
              placeholder="Handcrafted piece..."
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded border-ink-300 text-gold-600 focus:ring-gold-500"
              />
              Featured Product
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-ink-300 text-gold-600 focus:ring-gold-500"
              />
              Active in Store
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2 px-5"
            >
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
