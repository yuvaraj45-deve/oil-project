import React from 'react';
import { ShoppingBag, ShieldCheck, ChefHat, MessageCircle, ArrowUp } from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuickDockProps {
  items: CartItem[];
  onOpenCart: () => void;
  onOpenLabReport: () => void;
  onNavigate?: (path: string) => void;
}

export const QuickDock: React.FC<QuickDockProps> = ({
  items,
  onOpenCart,
  onOpenLabReport,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 pointer-events-none">
      <div className="glass-card shadow-2xl rounded-2xl p-2.5 sm:p-3 border border-forest-900/15 pointer-events-auto flex items-center justify-between gap-2 backdrop-blur-xl bg-white/90">
        
        {/* Cart Quick Preview Button */}
        <button
          onClick={onOpenCart}
          className="flex-1 py-2 px-3 rounded-xl bg-forest-900 text-cream-100 hover:bg-forest-800 transition-colors flex items-center justify-between text-xs font-semibold shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-500 text-forest-950 font-black text-[9px] flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {language === 'ta' ? 'கார்ட்:' : 'View Cart:'}
            </span>
            <span>
              {totalCount} {language === 'ta' ? 'பொருள்' : totalCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <span className="font-serif font-black text-gold-300">
            ₹{totalAmount}
          </span>
        </button>

        {/* Lab Certificate Icon */}
        <button
          onClick={onOpenLabReport}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-950 text-xs font-bold transition-colors border border-cream-300 flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Inspect Lab Purity Certificate"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">
            {language === 'ta' ? 'ஆய்வகம்' : 'Lab Report'}
          </span>
        </button>

        {/* Sommelier Page Button */}
        <button
          onClick={() => (onNavigate ? onNavigate('/sommelier') : (window.location.pathname = '/sommelier'))}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-950 text-xs font-bold transition-colors border border-cream-300 flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Oil to Dish Sommelier"
        >
          <ChefHat className="w-4 h-4 text-gold-600" />
          <span className="hidden sm:inline">
            {language === 'ta' ? 'வழிகாட்டி' : 'Sommelier'}
          </span>
        </button>

        {/* WhatsApp Assist */}
        <a
          href="https://wa.me/919876543210?text=Hi%20SS%20OIL,%20I%20would%20like%20to%20order%20cold-pressed%20edible%20oil"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Scroll Top Button */}
        <button
          onClick={scrollToTop}
          className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors shrink-0 cursor-pointer hidden md:flex items-center justify-center"
          title="Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
