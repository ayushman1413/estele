import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink-50 py-20 lg:py-28">
        <div className="container-x text-center max-w-3xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-bold">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-ink-900 leading-tight">
            Crafting elegance with intent.
          </h1>
          <p className="text-sm sm:text-base text-ink-600 leading-relaxed max-w-xl mx-auto">
            Founded with a vision to redefine everyday luxury, Estele creates timeless, hand-finished jewelry pieces designed for the modern lifestyle.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container-x py-16 lg:py-24 grid gap-12 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-700 text-xs font-semibold rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Handcrafted Quality
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-ink-900 leading-tight">
            Designed by Ayush, made to be lived in.
          </h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            Every piece in our collection is conceived in our modern studio by founder and lead designer **Ayush**. We combine traditional artisanal methods with state-of-the-art 3D modeling to ensure every curve, setting, and polish meets our premium standards.
          </p>
          <p className="text-sm text-ink-600 leading-relaxed">
            We believe that fine jewelry shouldn't be reserved only for special occasions. Our designs are signatures of self-expression—understated, elegant, and resilient enough for everyday wear.
          </p>
          <div className="pt-4">
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-6 -bottom-6 h-64 w-64 rounded-full bg-gold-100/50 blur-3xl" />
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80"
            alt="Jewelry design studio"
            className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
          />
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-ink-900 text-white py-16 lg:py-24">
        <div className="container-x space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl">Our Commitments</h2>
            <p className="text-xs text-ink-300 uppercase tracking-widest">How we create and deliver premium luxury</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 text-center sm:text-left">
              <div className="p-3 bg-white/10 rounded-xl w-fit mx-auto sm:mx-0">
                <Sparkles className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display text-xl">Conflict-Free Stones</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                All diamonds and gemstones used in Estele collections are ethically sourced from suppliers who adhere to strict international environmental and labor guidelines.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 text-center sm:text-left">
              <div className="p-3 bg-white/10 rounded-xl w-fit mx-auto sm:mx-0">
                <ShieldCheck className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display text-xl">Recycled Gold & Silver</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                We are committed to reducing our footprint by using 100% recycled 18k gold and sterling silver across all necklace bases and band settings.
              </p>
            </div>

            <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10 text-center sm:text-left">
              <div className="p-3 bg-white/10 rounded-xl w-fit mx-auto sm:mx-0">
                <Heart className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display text-xl">Artisan Support</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                A percentage of all revenue from the Estele brand goes directly back to supporting training programs for local apprentice goldsmiths and polishers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
