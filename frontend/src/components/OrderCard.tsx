import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import type { Order } from '../types';
import { formatDate, formatPrice } from '../utils/format';
import OrderStatus from './OrderStatus';

export default function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition hover:shadow-soft"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700">
        <Package className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-display text-lg font-medium">{order.order_number}</p>
            <p className="text-xs text-ink-500">{formatDate(order.placed_at ?? order.created_at)}</p>
          </div>
          <OrderStatus status={order.status} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-ink-500">
          <span>{order.items_count ?? order.items?.length ?? 0} item(s)</span>
          <span className="font-display text-base font-medium text-ink-900">{formatPrice(order.total)}</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-ink-300" />
    </Link>
  );
}
