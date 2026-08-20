import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e?: FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    if (!loginEmail || !loginPassword) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      await login(loginEmail, loginPassword);
      toast.success('Signed in successfully!');

      const fromPath = (loc.state as any)?.from?.pathname;
      if (loginEmail === 'admin@example.com' || loginEmail.includes('admin')) {
        navigate('/admin', { replace: true });
      } else {
        navigate(fromPath || '/', { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Login failed. Please check your credentials.');
    }
  };

  const loginAsCustomer = () => {
    setEmail('customer@example.com');
    setPassword('password');
    handleLogin(undefined, 'customer@example.com', 'password');
  };

  const loginAsAdmin = () => {
    setEmail('admin@example.com');
    setPassword('password');
    handleLogin(undefined, 'admin@example.com', 'password');
  };

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="font-display text-4xl font-medium text-ink-900">Account Sign In</h1>
          <p className="mt-2 text-sm text-ink-500">
            Sign in as a Customer to shop or as an Admin to manage orders.
          </p>
        </div>

        {/* Quick Demo Login Switcher Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={loginAsCustomer}
            disabled={loading}
            className="card p-4 text-left border border-ink-200 hover:border-gold-500 hover:bg-gold-50/40 transition group"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-700 group-hover:text-gold-700">
              <ShoppingBag className="h-4 w-4 text-gold-600" /> Customer
            </div>
            <p className="text-xs text-ink-400 mt-1">Shop, view cart & order status</p>
            <span className="mt-3 inline-flex items-center text-[11px] font-semibold text-gold-700 group-hover:underline">
              Sign in Customer <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={loginAsAdmin}
            disabled={loading}
            className="card p-4 text-left border border-ink-200 hover:border-ink-900 hover:bg-ink-50 transition group"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-900">
              <ShieldCheck className="h-4 w-4 text-ink-900" /> Admin
            </div>
            <p className="text-xs text-ink-400 mt-1">Manage orders, stock & stats</p>
            <span className="mt-3 inline-flex items-center text-[11px] font-semibold text-ink-900 group-hover:underline">
              Sign in Admin <ArrowRight className="h-3 w-3 ml-0.5" />
            </span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-200" /></div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-ink-400">Or enter credentials</span>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={(e) => handleLogin(e)} className="card space-y-4 p-7 shadow-sm">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-9"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="pt-2 text-center text-xs text-ink-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-ink-900 underline">
              Create Customer Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
