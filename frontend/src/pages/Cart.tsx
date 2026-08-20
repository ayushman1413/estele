import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  if (!cart) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={ShoppingBag} title="Sign in to view your cart"
          description="Your cart is saved to your account so you can pick up where you left off."
          cta={{ label: 'Sign in', to: '/login' }} />
      </div>
    );
  }

  if (loading && cart.items.length === 0) {
    return <div className="container-x py-16 text-center text-ink-500">Loading…</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty"
          description="Browse the collection and add a piece you'll love."
          cta={{ label: 'Shop now', to: '/products' }} />
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-ink-500">{cart.item_count} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQty={(q) => updateItem(item.id, q)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <aside className="card sticky top-24 h-fit p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <dl className="mt-5 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(cart.subtotal)} />
            <Row label="Shipping" value={cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping)} />
            <Row label="Tax (8%)" value={formatPrice(cart.tax)} />
            <div className="my-3 border-t border-ink-100" />
            <Row label={<span className="text-base text-ink-900 font-medium">Total</span>} value={
              <span className="font-display text-2xl font-semibold">{formatPrice(cart.total)}</span>
            } />
          </dl>
          <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full">
            Proceed to checkout
          </button>
          <Link to="/products" className="mt-3 block text-center text-sm text-ink-500 hover:text-ink-900">
            Continue shopping
          </Link>
          <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
            Demo project · prices + stock recalculated server-side at checkout.
          </p>
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
