import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Check,
  X,
  Filter,
  Eye,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import api, { describeError } from '../services/api';
import type { Order, OrderStatusType } from '../types';
import OrderStatus from '../components/OrderStatus';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All Orders', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Denied', value: 'denied' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async (targetPage = page, status = currentStatus) => {
    setLoading(true);
    try {
      let url = `/admin/orders?page=${targetPage}&per_page=15`;
      if (status) url += `&status=${status}`;
      const res = await api.get(url);
      setOrders(res.data.data.items);
      setPage(res.data.data.meta.current_page);
      setLastPage(res.data.data.meta.last_page);
      setTotalOrders(res.data.data.meta.total);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, currentStatus);
  }, [currentStatus]);

  const handleTabChange = (status: string) => {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleAccept = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      const res = await api.put(`/admin/orders/${orderId}/accept`);
      toast.success('Order accepted successfully!');
      // Update locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' as OrderStatusType } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      const res = await api.put(`/admin/orders/${orderId}/deny`);
      toast.error('Order denied.');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'denied' as OrderStatusType } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderStatusType } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const cName = (o.customer_name || o.customer?.name || '').toLowerCase();
    const cEmail = (o.customer_email || o.customer?.email || '').toLowerCase();
    const cCity = (o.shipping_city || o.customer?.city || '').toLowerCase();
    return (
      o.id.toString().includes(q) ||
      cName.includes(q) ||
      cEmail.includes(q) ||
      cCity.includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink-900">
            Order Management
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Accept or deny incoming orders and manage delivery fulfillment.
          </p>
        </div>
        <button
          onClick={() => fetchOrders(page, currentStatus)}
          disabled={loading}
          className="btn-secondary self-start sm:self-auto flex items-center gap-2 text-xs py-2 px-4"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = currentStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                  isActive
                    ? 'bg-ink-900 text-white shadow-sm'
                    : 'bg-white text-ink-600 hover:bg-ink-100 border border-ink-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
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
            <p className="mt-3 text-xs text-ink-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-ink-300" />
            <h3 className="mt-4 font-display text-lg text-ink-800">No orders found</h3>
            <p className="text-xs text-ink-500 mt-1">Try selecting a different status filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-700">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500 border-b border-ink-100">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Admin Actions</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/50 transition">
                    <td className="py-4 px-6 font-mono font-semibold text-ink-900">
                      #{order.id.toString().padStart(5, '0')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-ink-900">{order.customer_name}</div>
                      <div className="text-xs text-ink-400">{order.customer_email}</div>
                      <div className="text-xs text-ink-400">{order.shipping_city}, {order.shipping_state}</div>
                    </td>
                    <td className="py-4 px-6">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="py-4 px-6 font-semibold text-ink-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-500">
                      {order.placed_at || order.created_at
                        ? new Date(order.placed_at || order.created_at || '').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {order.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAccept(order.id)}
                            disabled={actionLoading === order.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleDeny(order.id)}
                            disabled={actionLoading === order.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" /> Deny
                          </button>
                        </div>
                      ) : (
                        <select
                          value={order.status}
                          disabled={actionLoading === order.id || ['delivered', 'denied', 'cancelled'].includes(order.status)}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs rounded-lg border border-ink-200 bg-white py-1.5 px-3 focus:border-ink-900 focus:outline-none disabled:bg-ink-100 disabled:cursor-not-allowed"
                        >
                          <option value="pending" disabled>Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="denied">Denied</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition"
                        title="View order details"
                      >
                        <Eye className="h-4 w-4" />
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
            <span className="text-xs text-ink-500">
              Showing page {page} of {lastPage} ({totalOrders} total orders)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrders(page - 1)}
                disabled={page <= 1 || loading}
                className="p-1.5 border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => fetchOrders(page + 1)}
                disabled={page >= lastPage || loading}
                className="p-1.5 border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-100 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?.id.toString().padStart(5, '0')}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-ink-100 pb-4">
              <div>
                <span className="text-xs text-ink-400">Status</span>
                <div className="mt-1">
                  <OrderStatus status={selectedOrder.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-ink-400">Order Total</span>
                <p className="font-display text-2xl font-semibold text-ink-900">
                  ${Number(selectedOrder.total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quick Accept/Deny in modal if pending */}
            {selectedOrder.status === 'pending' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase">Pending Approval</h4>
                  <p className="text-xs text-amber-700 mt-0.5">Decision required before processing this order.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(selectedOrder.id)}
                    disabled={actionLoading === selectedOrder.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleDeny(selectedOrder.id)}
                    disabled={actionLoading === selectedOrder.id}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                  >
                    Deny Order
                  </button>
                </div>
              </div>
            )}

            {/* Customer & Address info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-ink-50 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-ink-900 mb-2">
                  <User className="h-4 w-4 text-gold-600" /> Customer Information
                </div>
                <p><span className="text-ink-400">Name:</span> {selectedOrder.customer_name}</p>
                <p><span className="text-ink-400">Email:</span> {selectedOrder.customer_email}</p>
                <p><span className="text-ink-400">Phone:</span> {selectedOrder.customer_phone}</p>
              </div>

              <div className="p-4 bg-ink-50 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-ink-900 mb-2">
                  <MapPin className="h-4 w-4 text-gold-600" /> Shipping Address
                </div>
                <p>{selectedOrder.shipping_address}</p>
                <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_postal_code}</p>
                <p>{selectedOrder.shipping_country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">Order Items</h4>
              <div className="divide-y divide-ink-100 border border-ink-100 rounded-xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div>
                      <p className="font-semibold text-ink-900">{item.product_name}</p>
                      <p className="text-ink-400 mt-0.5">
                        ${Number(item.unit_price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-ink-900">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="space-y-1.5 text-xs text-right border-t border-ink-100 pt-4">
              <p><span className="text-ink-400">Subtotal:</span> ${Number(selectedOrder.subtotal).toFixed(2)}</p>
              <p><span className="text-ink-400">Shipping:</span> ${Number(selectedOrder.shipping).toFixed(2)}</p>
              <p><span className="text-ink-400">Tax (8%):</span> ${Number(selectedOrder.tax).toFixed(2)}</p>
              <p className="text-sm font-semibold text-ink-900 pt-2 border-t border-ink-100">
                Total: ${Number(selectedOrder.total).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
