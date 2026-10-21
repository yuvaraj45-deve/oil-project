import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Heart,
  Droplet
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-forest-950 text-cream-100 pt-16 pb-8 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-900/80">
          
          {/* Brand Info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Droplet className="w-5 h-5 fill-gold-400" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  SS OIL
                </span>
                <span className="text-[10px] block text-gold-400 font-semibold tracking-widest uppercase">
                  Pure Quality. Every Drop.
                </span>
              </div>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
              SS OIL is dedicated to reviving generational Indian edible oil craftsmanship. From raw village seeds to authentic wood-pressed Vaagai Mara Chekku churns, we bring unadulterated purity to your home.
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-cream-200 uppercase tracking-wider mb-2.5">
                Follow Our Journey
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-forest-900 hover:bg-gold-500 hover:text-forest-950 transition-colors flex items-center justify-center text-stone-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-forest-900 hover:bg-gold-500 hover:text-forest-950 transition-colors flex items-center justify-center text-stone-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-forest-900 hover:bg-gold-500 hover:text-forest-950 transition-colors flex items-center justify-center text-stone-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide border-b border-forest-900 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <a href="#home" className="hover:text-gold-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-gold-400 transition-colors">
                  Shop All Oils
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-gold-400 transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-gold-400 transition-colors">
                  Why SS OIL
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-400 transition-colors">
                  About Our Mill
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-gold-400 transition-colors">
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Product Categories (Col 7-8) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide border-b border-forest-900 pb-2">
              Product Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button
                  onClick={() => onSelectCategory('cooking-oil')}
                  className="hover:text-gold-400 transition-colors text-left"
                >
                  Cooking Oil (Daily Pure)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sesame-oil')}
                  className="hover:text-gold-400 transition-colors text-left"
                >
                  Wood-Pressed Sesame (Gingelly)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('groundnut-oil')}
                  className="hover:text-gold-400 transition-colors text-left"
                >
                  Cold-Pressed Groundnut Oil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('coconut-oil')}
                  className="hover:text-gold-400 transition-colors text-left"
                >
                  Virgin Cold-Pressed Coconut Oil
                </button>
              </li>
              <li>
                <span className="text-stone-500 text-xs">
                  • 5L & 15L Bulk Catering Tins
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information Placeholders (Col 9-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide border-b border-forest-900 pb-2">
              Contact & Mill Desk
            </h4>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
                <span>
                  SS OIL Mills & Packing Unit, No. 42 Chekku Street, Industrial Estate, Salem, Tamil Nadu – 636004 (Placeholder)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors">
                  +91 98765 43210 / 1800-425-SSOIL
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:care@ssoil.in" className="hover:text-gold-400 transition-colors">
                  care@ssoil.in (Sample Desk)
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:30 PM IST</span>
              </div>
            </div>
          </div>

        </div>

        {/* Certifications and Compliance Banner */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400 border-b border-forest-900/60">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-cream-200">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>FSSAI Lic. No: 1242000000001 (Sample)</span>
            </span>
            <span>•</span>
            <span>ISO 22000:2018 Certified Facility</span>
            <span>•</span>
            <span>Agmark Grade I Standard</span>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-forest-900 text-cream-200 font-mono text-[10px]">
              UPI / GPay / PhonePe
            </span>
            <span className="px-2 py-0.5 rounded bg-forest-900 text-cream-200 font-mono text-[10px]">
              RuPay / Visa
            </span>
            <span className="px-2 py-0.5 rounded bg-forest-900 text-cream-200 font-mono text-[10px]">
              COD
            </span>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} SS OIL E-Commerce. All Rights Reserved. Crafted with pure quality.
          </div>

          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-gold-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-gold-400 transition-colors">
              Terms of Service
            </a>
            <a href="#shipping" className="hover:text-gold-400 transition-colors">
              Shipping & Returns
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-forest-900 text-gold-400 hover:bg-gold-500 hover:text-forest-950 transition-colors ml-2"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
