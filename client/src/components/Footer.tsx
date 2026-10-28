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
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate }) => {
  const { language, t } = useLanguage();
  const { settings, categories } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <footer id="contact" className="bg-forest-950 text-cream-100 pt-16 pb-8 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-900/80">
          
          {/* Brand Info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeName || "ss oil"}
                    className="w-full h-full object-contain p-1 rounded-full"
                  />
                ) : (
                  <Droplet className="w-5 h-5 fill-gold-400 text-gold-400" />
                )}
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  {settings.storeName || "ss oil"}
                </span>
                <span className="text-[10px] block text-gold-400 font-semibold tracking-widest uppercase">
                  {settings.tagline || 'Pure & Healthy Mara Chekku Heritage'}
                </span>
              </div>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
              {settings.description || t('hero.subtitle')}
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-cream-200 uppercase tracking-wider mb-2.5">
                {language === 'ta' ? 'எங்களைப் பின்தொடரவும்' : 'Follow Our Journey'}
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
              {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <button onClick={() => handleLinkClick('/')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/shop')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {t('nav.products')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/mill-journey')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {language === 'ta' ? 'மரச்செக்கு பயணம்' : 'Mill Journey'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/sommelier')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {language === 'ta' ? 'சமையல் வழிகாட்டி' : 'Oil Sommelier'}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/why-us')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {t('nav.health')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/about')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/contact')} className="hover:text-gold-400 transition-colors cursor-pointer text-left">
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Product Categories (Col 7-8) - Dynamically loaded from Admin state */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide border-b border-forest-900 pb-2">
              {language === 'ta' ? 'எண்ணெய் வகைகள்' : 'Product Categories'}
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-gold-400 transition-colors text-left truncate max-w-full"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Placeholders (Col 9-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide border-b border-forest-900 pb-2">
              {language === 'ta' ? 'தொடர்பு & மில் அலுவலகம்' : 'Contact & Mill Desk'}
            </h4>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
                <span className="leading-snug">
                  {settings.millAddress || (language === 'ta'
                    ? 'SS OIL மில் & பேக்கிங் பிரிவு, எண் 42 செக்கு தெரு, தொழிற்பேட்டை, சேலம், தமிழ்நாடு – 636004'
                    : 'SS OIL Mills & Packing Unit, No. 42 Chekku Street, Industrial Estate, Salem, Tamil Nadu – 636004')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${settings.phone || '+919876543210'}`} className="hover:text-gold-400 transition-colors">
                  {settings.phone || '+91 98765 43210 / 1800-425-SSOIL'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${settings.email || 'care@ssoil.in'}`} className="hover:text-gold-400 transition-colors">
                  {settings.email || 'care@ssoil.in'}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {settings.millHours || (language === 'ta'
                    ? 'திங்கள் – சனி: காலை 9:00 – இரவு 7:30 IST'
                    : 'Mon – Sat: 9:00 AM – 7:30 PM IST')}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Certifications and Compliance Banner */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400 border-b border-forest-900/60">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-cream-200">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>{language === 'ta' ? 'ISO 22000:2018 தரச்சான்றிதழ்' : 'ISO 22000:2018 Certified Facility'}</span>
            </span>
            <span>•</span>
            <span>{language === 'ta' ? 'Agmark முதல் தரம்' : 'Agmark Grade I Standard'}</span>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-xs">
            <span>{language === 'ta' ? 'ஏற்றுக்கொள்ளப்படும் பேமெண்ட்:' : 'Accepted Payments:'}</span>
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
            © 2025 PureVa. {t('footer.copyright')}
          </div>

          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-gold-400 transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#terms" className="hover:text-gold-400 transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#shipping" className="hover:text-gold-400 transition-colors">
              {language === 'ta' ? 'டெலிவரி & திருப்புதல்' : 'Shipping & Returns'}
            </a>
            <button
              onClick={() => handleLinkClick('/admin')}
              className="text-stone-400 hover:text-gold-400 transition-colors cursor-pointer text-xs font-medium"
            >
              {language === 'ta' ? 'அட்மின் போர்டல்' : 'Admin Portal'}
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-forest-900 text-gold-400 hover:bg-gold-500 hover:text-forest-950 transition-colors ml-2 cursor-pointer"
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
