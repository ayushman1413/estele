import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for contact message submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-ink-50 py-16 text-center">
        <div className="container-x max-w-2xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-bold">Contact Us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-ink-900">
            Let's connect.
          </h1>
          <p className="text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
            Have questions about our collections, customized pieces, or orders? Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container-x py-16 lg:py-24 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Contact Form */}
        <div className="card p-6 sm:p-10 border border-ink-150 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="font-display text-2xl text-ink-900 font-medium">Send a Message</h2>
            <p className="text-xs text-ink-500 mt-1">We typically reply within 24 business hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-ink-200 p-3 text-xs focus:border-ink-900 focus:outline-none"
                  placeholder="Ayush"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-ink-200 p-3 text-xs focus:border-ink-900 focus:outline-none"
                  placeholder="ayush@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-xl border border-ink-200 p-3 text-xs focus:border-ink-900 focus:outline-none"
                placeholder="Product inquiry, sizing question..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink-500 mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-ink-200 p-3 text-xs focus:border-ink-900 focus:outline-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending message...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-ink-900 text-white rounded-2xl space-y-6">
            <div>
              <h3 className="font-display text-xl">Ayush</h3>
              <p className="text-[10px] uppercase font-bold text-gold-400 tracking-wider mt-0.5">
                Founder & Lead Designer
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email Us</p>
                  <a href="mailto:hello@estele.co" className="text-white/70 hover:underline">
                    hello@estele.co
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Call Us</p>
                  <a href="tel:+15550109988" className="text-white/70 hover:underline">
                    +1 (555) 010-9988
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Studio Address</p>
                  <p className="text-white/70">
                    24 Greene St, SoHo<br />
                    New York, NY 10013
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border border-ink-150 rounded-2xl bg-ink-50 space-y-2">
            <h4 className="text-xs font-bold text-ink-900 uppercase">Support Hours</h4>
            <p className="text-xs text-ink-600">Monday — Friday: 9 AM to 6 PM EST</p>
            <p className="text-xs text-ink-600">Saturday: 10 AM to 4 PM EST</p>
            <p className="text-[10px] text-ink-400 mt-2">
              Note: Studio visits are currently by appointment only.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
