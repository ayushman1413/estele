import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, describeError } from '../services/api';
import type { Order } from '../types';
import { formatDateTime, formatPrice } from '../utils/format';
import OrderStatus, { OrderTimeline } from '../components/OrderStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data.data))
      .catch((err) => toast.error(describeError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  return (
    <div className="container-x py-10">
      <Link to="/orders" className="mb-4 inline-flex text-sm text-ink-500 hover:text-ink-900">← Back to orders</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">Order</p>
          <h1 className="font-display text-3xl">{order.order_number}</h1>
          <p className="mt-1 text-sm text-ink-500">Placed {formatDateTime(order.placed_at ?? order.created_at)}</p>
        </div>
        <OrderStatus status={order.status} />
      </div>

      <div className="mt-6"><OrderTimeline status={order.status} /></div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-2xl">Items</h2>
            <ul className="mt-4 divide-y divide-ink-100">
              {(order.items ?? []).map((it) => (
                <li key={it.id} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-ink-50">
                    {it.image && <img src={it.image} alt={it.product_name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{it.product_name}</p>
                    <p className="text-xs text-ink-500">Qty {it.quantity} · {formatPrice(it.unit_price)} each</p>
                  </div>
                  <span className="font-medium">{formatPrice(it.subtotal)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-2xl">Shipping to</h2>
            <div className="mt-3 text-sm text-ink-700">
              <p className="font-medium">{order.customer?.name || order.customer_name}</p>
              <p>{order.customer?.address || order.shipping_address}</p>
              <p>
                {order.customer?.city || order.shipping_city}, {order.customer?.state || order.shipping_state}{' '}
                {order.customer?.postal_code || order.shipping_postal_code}
              </p>
              <p>{order.customer?.country || order.shipping_country}</p>
              <p className="mt-2 text-ink-500">
                {order.customer?.email || order.customer_email} · {order.customer?.phone || order.customer_phone}
              </p>
            </div>
          </section>
        </div>

        <aside className="card sticky top-24 h-fit p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label="Shipping" value={order.shipping === 0 ? 'Free' : formatPrice(order.shipping)} />
            <Row label="Tax" value={formatPrice(order.tax)} />
            <div className="my-3 border-t border-ink-100" />
            <Row label={<span className="text-base font-medium text-ink-900">Total</span>} value={
              <span className="font-display text-2xl font-semibold">{formatPrice(order.total)}</span>
            } />
          </dl>
        </aside>
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <dt className="text-ink-500">{label}</dt>
    <dd className="text-ink-900">{value}</dd>
  </div>
);
