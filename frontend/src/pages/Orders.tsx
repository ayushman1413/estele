import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { api } from '../services/api';
import type { Order, Paginated } from '../types';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((r) => setOrders(r.data.data.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl">Your orders</h1>
      <p className="mt-1 text-sm text-ink-500">Track every order from placement to delivery.</p>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Package} title="No orders yet"
            description="When you place an order, it'll appear here."
            cta={{ label: 'Start shopping', to: '/products' }} />
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
