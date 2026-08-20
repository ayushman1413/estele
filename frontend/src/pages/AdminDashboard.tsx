import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Package,
  Users,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import api, { describeError } from '../services/api';
import type { AdminStats, Order } from '../types';
import OrderStatus from '../components/OrderStatus';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/orders?per_page=5'),
      ]);
      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data.items);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Overview of store activity, pending orders, and sales performance.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="btn-secondary self-start sm:self-auto flex items-center gap-2 text-xs py-2 px-4"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 bg-white border border-ink-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-gold-50 text-gold-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-semibold text-ink-900">
              ${stats ? stats.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            </span>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> Live sales revenue
            </div>
          </div>
        </div>

        <div className="card p-6 bg-white border border-ink-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Pending Orders</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-display text-3xl font-semibold text-ink-900">
              {stats?.pending_orders ?? 0}
            </span>
            <Link
              to="/admin/orders?status=pending"
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline flex items-center gap-0.5"
            >
              Action required <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="card p-6 bg-white border border-ink-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Accepted Orders</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-semibold text-ink-900">
              {stats?.accepted_orders ?? 0}
            </span>
            <p className="mt-1 text-xs text-ink-400">Accepted & processing</p>
          </div>
        </div>

        <div className="card p-6 bg-white border border-ink-100 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-semibold text-ink-900">
              {stats?.total_orders ?? 0}
            </span>
            <p className="mt-1 text-xs text-ink-400">{stats?.denied_orders ?? 0} denied</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card p-6 bg-gradient-to-r from-ink-900 to-ink-800 text-white rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Package className="h-6 w-6 text-gold-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-300">Catalog Products</p>
              <h3 className="font-display text-2xl font-semibold">{stats?.total_products ?? 0} Products</h3>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Link to="/admin/products" className="text-xs font-medium text-gold-400 hover:text-gold-300 flex items-center gap-1">
              Manage inventory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-gold-900 to-gold-800 text-white rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="h-6 w-6 text-gold-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-200">Registered Customers</p>
              <h3 className="font-display text-2xl font-semibold">{stats?.total_customers ?? 0} Customers</h3>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Link to="/admin/orders" className="text-xs font-medium text-white hover:underline flex items-center gap-1">
              View customer orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card bg-white border border-ink-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-ink-100">
          <div>
            <h2 className="font-display text-xl font-medium text-ink-900">Recent Orders</h2>
            <p className="text-xs text-ink-500">Latest customer transactions</p>
          </div>
          <Link to="/admin/orders" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1">
            View All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-600" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-ink-500">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-700">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500 border-b border-ink-100">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/50 transition">
                    <td className="py-4 px-6 font-mono font-medium text-ink-900">
                      #{order.id.toString().padStart(5, '0')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-ink-900">{order.customer_name}</div>
                      <div className="text-xs text-ink-400">{order.customer_email}</div>
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
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-medium text-gold-700 hover:text-gold-900 underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
