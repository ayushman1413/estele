import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message ?? 'Registration failed');
    }
  };

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-4xl">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">Save addresses, track orders, and check out faster.</p>

        <form onSubmit={submit} className="card mt-8 space-y-4 p-7">
          <div>
            <label className="label">Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Confirm</label>
              <input type="password" required minLength={8} value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className="input" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-ink-500">
            Already have one? <Link to="/login" className="text-ink-900 underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
