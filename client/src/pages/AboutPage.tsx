import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PromiseOfPurity } from '../components/PromiseOfPurity';
import { HistoryAndQuality } from '../components/HistoryAndQuality';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onAddToCart?: (product: Product, packSize: string) => void;
  onQuickView?: (product: Product) => void;
  onViewLabReport?: (product: Product) => void;
  onViewAllProducts?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onViewAllProducts,
}) => {
  const { language, t } = useLanguage();

  const handleScrollToHistory = () => {
    const el = document.getElementById('history-and-quality');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-screen pb-20 space-y-16">
      {/* 1. Our Promise of Purity Section (ABOUT PUREVA) */}
      <PromiseOfPurity onKnowMore={handleScrollToHistory} />

      {/* 2. User Requested: Our History & Product Quality Section */}
      <HistoryAndQuality />

      {/* 3. Clean Brand Call-to-Action to Shop (Zero product cards cluttering the page) */}
      {onViewAllProducts && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <div className="rounded-3xl bg-white border border-cream-200 p-8 sm:p-12 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-forest-800" />
                <span>PureVa 100% Pure & Natural</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
                {language === 'ta'
                  ? 'உங்கள் குடும்ப ஆரோக்கியத்திற்கான தூய சமையல் எண்ணெய்கள்'
                  : 'Pure Cooking Oils for Your Family’s Wholesome Health'}
              </h3>
              
              <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
                {language === 'ta'
                  ? 'மரச்செக்கு நல்லெண்ணெய், தேங்காய் எண்ணெய், கடலை எண்ணெய் மற்றும் தூய நெய் வகைகளைக் காணுங்கள்.'
                  : 'Discover wood-pressed sesame, virgin coconut, groundnut oils and pure essentials.'}
              </p>
              
              <div className="pt-2">
                <button
                  onClick={onViewAllProducts}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
                >
                  <span>{t('about.exploreOils')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
