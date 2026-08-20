import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { api, describeError } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    customer_name: user?.name ?? '',
    customer_email: user?.email ?? '',
    customer_phone: user?.phone ?? '',
    shipping_address: user?.address ?? '',
    shipping_city: user?.city ?? '',
    shipping_state: user?.state ?? '',
    shipping_postal_code: user?.postal_code ?? '',
    shipping_country: user?.country ?? 'US',
    notes: '',
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <p className="text-ink-500">Your cart is empty.</p>
        <Link to="/products" className="btn-primary mt-4">Shop now</Link>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post('/orders', form);
      await refresh();
      navigate(`/order-success/${res.data.data.id}`);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setBusy(false);
    }
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink-500">All transactions are simulated for the demo.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-2xl">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required value={form.customer_name} onChange={update('customer_name')} />
              <Field label="Email" type="email" required value={form.customer_email} onChange={update('customer_email')} />
              <Field label="Phone" required value={form.customer_phone} onChange={update('customer_phone')} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-2xl">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Address" required value={form.shipping_address} onChange={update('shipping_address')} className="sm:col-span-2" />
              <Field label="City" required value={form.shipping_city} onChange={update('shipping_city')} />
              <Field label="State / Region" required value={form.shipping_state} onChange={update('shipping_state')} />
              <Field label="Postal code" required value={form.shipping_postal_code} onChange={update('shipping_postal_code')} />
              <Field label="Country" required value={form.shipping_country} onChange={update('shipping_country')} />
            </div>
            <div className="mt-4">
              <label className="label">Notes (optional)</label>
              <textarea rows={3} className="input" value={form.notes} onChange={update('notes')} placeholder="Delivery instructions, gift wrap…" />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl"><CreditCard className="h-5 w-5" /> Payment</h2>
            <p className="mt-3 rounded-lg border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-500">
              Demo mode — no real payment is processed. Order total is calculated server-side and charged in a real flow.
            </p>
          </section>
        </div>

        <aside className="card sticky top-24 h-fit p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 divide-y divide-ink-100">
            {cart.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <img src={i.image} alt={i.name} className="h-12 w-12 flex-shrink-0 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-ink-500">Qty {i.quantity} · {formatPrice(i.price)}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(cart.subtotal)} />
            <Row label="Shipping" value={cart.shipping === 0 ? 'Free' : formatPrice(cart.shipping)} />
            <Row label="Tax" value={formatPrice(cart.tax)} />
            <div className="my-3 border-t border-ink-100" />
            <Row label={<span className="text-base font-medium text-ink-900">Total</span>} value={
              <span className="font-display text-2xl font-semibold">{formatPrice(cart.total)}</span>
            } />
          </dl>
          <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
            {busy ? 'Placing order…' : 'Place order'}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5" /> Secured by your account
          </p>
        </aside>
      </form>
    </div>
  );
}

const Field = ({
  label, value, onChange, type = 'text', required, className = '',
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; className?: string;
}) => (
  <div className={className}>
    <label className="label">{label}{required && <span className="text-rose-600"> *</span>}</label>
    <input type={type} required={required} value={value} onChange={onChange} className="input" />
  </div>
);

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <dt className="text-ink-500">{label}</dt>
    <dd className="text-ink-900">{value}</dd>
  </div>
);
