import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Manage Orders' },
  { to: '/admin/products', icon: Package, label: 'Product Catalog' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navContent = (onLinkClick?: () => void) => (
    <>
      <nav className="flex-1 space-y-1 p-4">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <div className="pt-4 border-t border-ink-100 mt-4">
          <Link
            to="/"
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gold-700 hover:bg-gold-50 transition border border-gold-200"
          >
            <ExternalLink className="h-4 w-4" />
            View Customer Store
          </Link>
        </div>
      </nav>

      <div className="border-t border-ink-100 p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-ink-900">{user?.name}</p>
            <p className="truncate text-[10px] text-ink-500">{user?.email}</p>
            <span className="inline-block text-[9px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded mt-0.5">
              Administrator
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Header (Visible on screens < md) */}
      <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 md:hidden sticky top-0 z-30 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-ink-600 hover:bg-ink-100"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="font-display text-xl font-semibold text-ink-900">
            Estele<span className="text-gold-500">.</span>
          </Link>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* Mobile Slide-over Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-ink-200 shadow-xl transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div>
            <Link to="/" className="font-display text-xl font-semibold text-ink-900">
              Estele<span className="text-gold-500">.</span>
            </Link>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-widest text-gold-700 font-bold">
              <ShieldCheck className="h-3 w-3 text-gold-600" /> Admin Console
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-ink-600 hover:bg-ink-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navContent(() => setMobileOpen(false))}
      </div>

      {/* Desktop Sidebar (Visible on screens >= md) */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-ink-200 bg-white md:flex md:flex-col min-h-screen">
        <div className="border-b border-ink-100 px-6 py-6">
          <Link to="/" className="font-display text-2xl font-semibold text-ink-900">
            Estele<span className="text-gold-500">.</span>
          </Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-700 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-600" /> Admin Console
          </div>
        </div>
        {navContent()}
      </aside>
    </>
  );
}
