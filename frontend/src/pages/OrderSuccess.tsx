import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Order } from '../types';
import { formatPrice } from '../utils/format';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.data)).catch(() => {});
  }, [id]);

  return (
    <div className="container-x py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl">Order placed</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thank you. We've received your order and notified the team.
        </p>
        {order && (
          <div className="mt-6 rounded-xl bg-ink-50 px-5 py-4 text-sm">
            <p><span className="text-ink-500">Order</span> <span className="font-medium">{order.order_number}</span></p>
            <p><span className="text-ink-500">Total</span> <span className="font-medium">{formatPrice(order.total)}</span></p>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="btn-primary">View orders</Link>
          <Link to="/products" className="btn-secondary">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
