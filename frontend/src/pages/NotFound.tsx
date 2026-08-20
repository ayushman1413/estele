import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-xs uppercase tracking-widest text-gold-700">404</p>
      <h1 className="mt-3 font-display text-5xl">Page not found</h1>
      <p className="mt-3 text-ink-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
    </div>
  );
}
