import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-2xl font-semibold">Estele<span className="text-gold-500">.</span></Link>
          <p className="mt-3 text-sm text-ink-500">
            Modern jewelry, crafted for everyday rituals and forever occasions.
          </p>
          <div className="mt-5 flex gap-3 text-ink-500">
            <a aria-label="Instagram" href="#" className="hover:text-ink-900"><Instagram className="h-5 w-5" /></a>
            <a aria-label="Twitter" href="#" className="hover:text-ink-900"><Twitter className="h-5 w-5" /></a>
            <a aria-label="Facebook" href="#" className="hover:text-ink-900"><Facebook className="h-5 w-5" /></a>
            <a aria-label="Youtube" href="#" className="hover:text-ink-900"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-900">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            <li><Link to="/products" className="hover:text-ink-900">All</Link></li>
            <li><Link to="/products?category=1" className="hover:text-ink-900">Rings</Link></li>
            <li><Link to="/products?category=2" className="hover:text-ink-900">Necklaces</Link></li>
            <li><Link to="/products?category=3" className="hover:text-ink-900">Earrings</Link></li>
            <li><Link to="/products?category=4" className="hover:text-ink-900">Bracelets</Link></li>
            <li><Link to="/products?category=5" className="hover:text-ink-900">Watches</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-900">Customer Care</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            <li><a href="#" className="hover:text-ink-900">Shipping & returns</a></li>
            <li><a href="#" className="hover:text-ink-900">Care guide</a></li>
            <li><a href="#" className="hover:text-ink-900">Warranty</a></li>
            <li><a href="#" className="hover:text-ink-900">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-900">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-500">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@estele.example</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 010-9988</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 24 Greene St, New York</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Estele. All rights reserved. · Demo project — no real transactions.
      </div>
    </footer>
  );
}
