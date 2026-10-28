import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Lock } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, packSize: string) => void;
  onOpenAdmin: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  onOpenAdmin,
}) => {
  const { language, t } = useLanguage();
  const { products } = useStore();
  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickTerms =
    language === 'ta'
      ? ['நல்லெண்ணெய்', 'தேங்காய் எண்ணெய்', 'கடலை எண்ணெய்', 'மரச்செக்கு', 'பூஜை எண்ணெய்']
      : ['Sesame', 'Coconut', 'Groundnut', 'Cold-Pressed', 'Mara Chekku'];

  const filtered = query.trim()
    ? sourceProducts.filter((p) => {
        const pTamilName = t(`prod.${p.id}.name`) || '';
        const pTamilTagline = t(`prod.${p.id}.tagline`) || '';
        const text = `${p.name} ${p.tagline} ${p.categoryName} ${p.description} ${p.extractionMethod} ${pTamilName} ${pTamilTagline}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-cream-300 text-left">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim().toLowerCase() === 'admin') {
                  onOpenAdmin();
                  onClose();
                }
              }}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 cursor-pointer"
              >
                {t('search.clear')}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-cream-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="px-5 py-3 bg-cream-100/70 border-b border-cream-200 flex items-center gap-2 flex-wrap text-xs text-stone-500">
            <span className="font-semibold text-stone-600">{t('search.quick')}</span>
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-cream-200 text-forest-900 border border-cream-300 font-medium transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-5 max-h-96 overflow-y-auto space-y-3">
            {/* 🔐 SECRET ADMIN PORTAL CARD - Only shows when query is 'admin' */}
            {query.trim().toLowerCase() === 'admin' && (
              <div
                onClick={() => {
                  onOpenAdmin();
                  onClose();
                }}
                className="p-4 rounded-2xl bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-cream-100 border-2 border-gold-400 shadow-xl cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between group animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-gold-300 tracking-wide">
                        SS OIL Mill Admin Portal
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400 text-forest-950 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Secret Access
                      </span>
                    </div>
                    <p className="text-xs text-cream-200/70 mt-0.5">
                      Store KPIs, live orders management, inventory stock, and GC-MS quality reports.
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-gold-500 text-forest-950 font-bold text-xs flex items-center gap-1.5 group-hover:bg-gold-400 transition-colors shadow-md shrink-0">
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {query.trim() === '' ? (
              <div className="text-center py-8 text-stone-400 text-xs sm:text-sm">
                <Sparkles className="w-6 h-6 text-gold-500 mx-auto mb-2 opacity-80" />
                <span>
                  {language === 'ta'
                    ? 'எங்கள் தூய மரச்செக்கு சமையல் எண்ணெய்களைத் தேடத் தொடங்கவும்.'
                    : 'Type to search from our range of 100% authentic edible oils.'}
                </span>
              </div>
            ) : filtered.length === 0 && query.trim().toLowerCase() !== 'admin' ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                {language === 'ta'
                  ? `"${query}" தொடர்பாக எந்த எண்ணெயும் கிடைக்கவில்லை. நல்லெண்ணெய் அல்லது தேங்காய் எண்ணெய் எனத் தேடிப் பார்க்கவும்.`
                  : `No matching edible oils found for "${query}". Try searching for Sesame, Coconut, or Cooking Oil.`}
              </div>
            ) : (
              filtered.map((product) => {
                const productName =
                  language === 'ta' && t(`prod.${product.id}.name`)
                    ? t(`prod.${product.id}.name`)
                    : product.name;

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-cream-100/80 border border-cream-200 transition-colors gap-3"
                  >
                    <div
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <img
                        src={product.image}
                        alt={productName}
                        className="w-14 h-14 rounded-xl object-cover border border-cream-300 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-serif font-bold text-forest-950 hover:text-forest-700">
                          {productName}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1">
                          {language === 'ta' ? 'பாரம்பரிய மரச்செக்கு முறை' : product.extractionMethod}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-forest-900 font-serif">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onAddToCart(product, product.defaultPack);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-forest-900 text-gold-400 hover:bg-forest-800 transition-colors shadow-xs cursor-pointer"
                        title={t('prod.addToCart')}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="p-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-cream-200 transition-colors cursor-pointer"
                        title={t('prod.details')}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
