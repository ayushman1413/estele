import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LogOut, Menu, Search, ShoppingBag, User as UserIcon, X, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const linkBase = 'text-sm font-medium tracking-wide transition hover:text-ink-900';
const linkActive = 'text-ink-900 font-semibold';
const linkIdle = 'text-ink-500';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`);
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-ink-100 shadow-sm' : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4 py-4">
        {/* Brand Logo */}
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink-900">
          Estele<span className="text-gold-500">.</span>
        </Link>

        {/* Public Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {['Home', 'Shop', 'About', 'Contact'].map((label) => {
            const to = label === 'Home' ? '/' : label === 'Shop' ? '/products' : `/${label.toLowerCase()}`;
            return (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <form onSubmit={submitSearch} className="hidden items-center lg:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jewelry..."
                className="w-52 rounded-full border border-ink-200 bg-white py-1.5 pl-9 pr-3 text-xs focus:border-ink-900 focus:outline-none"
              />
            </div>
          </form>

          {/* Admin Role Button */}
          {user?.is_admin ? (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-900 hover:bg-ink-800 text-white text-xs font-semibold rounded-full shadow-sm transition"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-gold-400" /> Admin Console
            </Link>
          ) : (
            user && (
              <Link
                to="/orders"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-ink-50 hover:bg-ink-100 text-ink-700 text-xs font-semibold rounded-full transition"
              >
                <Clock className="h-3.5 w-3.5 text-gold-600" /> My Orders
              </Link>
            )
          )}

          {/* Account Icon / Login Link */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.is_admin ? '/admin' : '/orders'}
                className="flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-900 border border-ink-200 hover:bg-ink-100 transition"
                title={`Logged in as ${user.name} (${user.is_admin ? 'Admin' : 'Customer'})`}
              >
                <UserIcon className="h-3.5 w-3.5 text-gold-600" />
                <span className="max-w-[90px] truncate">{user.name}</span>
                <span className="text-[10px] uppercase font-bold text-ink-400">
                  ({user.is_admin ? 'Admin' : 'Customer'})
                </span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Logout"
                title="Sign out"
                className="rounded-full p-2 text-ink-600 hover:bg-ink-100 hover:text-rose-600 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-secondary py-1.5 px-4 text-xs font-semibold"
            >
              Sign In
            </Link>
          )}

          {/* Cart Icon (For Customer Shopping) */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative rounded-full p-2 text-ink-800 hover:bg-ink-50 transition"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold-600 px-1 text-[10px] font-semibold text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle Menu"
            className="rounded-full p-2 text-ink-700 hover:bg-ink-50 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-x flex flex-col gap-3 py-4">
            <form onSubmit={submitSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="input pl-9"
                />
              </div>
            </form>

            {['Home', 'Shop', 'About', 'Contact'].map((label) => {
              const to = label === 'Home' ? '/' : label === 'Shop' ? '/products' : `/${label.toLowerCase()}`;
              return (
                <Link key={label} to={to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-ink-700">
                  {label}
                </Link>
              );
            })}

            {user?.is_admin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold text-gold-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Admin Console
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className="py-2 text-left text-sm font-medium text-rose-700">
                Logout ({user.email})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
