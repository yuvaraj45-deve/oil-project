import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Check, ShieldCheck, Droplets, ArrowRight, X, Heart } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';

interface FeaturedProductsProps {
  onAddToCart: (product: Product, packSize: string) => void;
  onQuickView: (product: Product) => void;
  onViewLabReport: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewAllProducts?: () => void;
  maxProducts?: number;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onQuickView,
  onViewLabReport,
  selectedCategory,
  onSelectCategory,
  onViewAllProducts,
  maxProducts,
}) => {
  const { language, t } = useLanguage();
  const { products } = useStore();
  // State to track which product currently has the pack selector overlay open (when buying)
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);

  useEffect(() => {
    const handleFavChange = (e: any) => {
      setFavoritesList(e.detail || getFavorites());
    };
    window.addEventListener('ssoil_favorites_updated', handleFavChange);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavChange);
  }, []);

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;
  const filteredProducts =
    selectedCategory === 'all'
      ? sourceProducts
      : sourceProducts.filter((p) => p.category === selectedCategory);

  const displayedProducts = maxProducts ? filteredProducts.slice(0, maxProducts) : filteredProducts;

  const formatPack = (pack: string, lang: string) => {
    if (lang !== 'ta') return pack;
    return pack
      .replace('500 ml Bottle', '500 மி.லி பாட்டில்')
      .replace('1 Litre Bottle', '1 லிட்டர் பாட்டில்')
      .replace('2 Litre Bottle', '2 லிட்டர் பாட்டில்')
      .replace('5 Litre Can', '5 லிட்டர் கேன்')
      .replace('1 Litre Glass Jar', '1 லிட்டர் கண்ணாடி பாட்டில்')
      .replace('2 Litre Can', '2 லிட்டர் கேன்')
      .replace('5 Litre Tin', '5 லிட்டர் டின்')
      .replace('15 Litre Tin', '15 லிட்டர் டின்')
      .replace('1 Litre Pouch', '1 லிட்டர் பாக்கெட்')
      .replace('250 ml Jar', '250 மி.லி ஜாடி')
      .replace('500 ml Jar', '500 மி.லி ஜாடி')
      .replace('1 Litre Jar', '1 லிட்டர் ஜாடி')
      .replace('500g Block', '500 கிராம் கட்டி')
      .replace('1 kg Block', '1 கிலோ கட்டி');
  };

  const getBadgeName = (badge: string, lang: string) => {
    if (lang !== 'ta') return badge;
    const badgeMap: Record<string, string> = {
      'Wood-Pressed': 'மரச்செக்கு',
      '100% Pure': '100% தூய்மை',
      'Popular': 'அதிக விருப்பம்',
      'Light & Pure': 'லேசானது & தூயது',
      'Heart Care': 'இதய நலம்',
      'Temple Pooja': 'பூஜை சிறப்பு',
      'Bilona Pure': 'பிலோனா தூய்மை',
      'Native Pure': 'இயற்கை தூய்மை',
    };
    return badgeMap[badge] || badge;
  };

  const getPackPrice = (product: Product, pack: string) => {
    if (pack.includes('500 ml') || pack.includes('500g') || pack.includes('500 ml Bottle') || pack.includes('500ml Glass Jar') || pack.includes('500 ml Jar')) {
      return Math.round(product.price * 0.55);
    }
    if (pack.includes('250 ml') || pack.includes('250g') || pack.includes('250 ml Jar')) {
      return Math.round(product.price * 0.32);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can')) {
      return Math.round(product.price * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L') || pack.includes('5 Litre Can') || pack.includes('5 Litre Tin')) {
      return Math.round(product.price * 4.8);
    }
    if (pack.includes('15 Litre') || pack.includes('15L') || pack.includes('15 Litre Tin')) {
      return Math.round(product.price * 14);
    }
    if (pack.includes('1 kg') || pack.includes('1kg') || pack.includes('1 kg Block')) {
      return Math.round(product.price * 1.9);
    }
    return product.price;
  };

  const handleSelectLiterAndBuy = (product: Product, pack: string) => {
    onAddToCart(product, pack);
    setBuyingProductId(null);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1500);
  };

  return (
    <section id="products" className="py-14 sm:py-20 bg-[#f7f6f2] border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Droplets className="w-3.5 h-3.5 text-forest-800" />
            <span>{t('prod.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
            {t('prod.title')}
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            {t('prod.subtitle')}
          </p>
        </div>

        {/* Responsive Grid: All Products + View All */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${maxProducts === 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-5 sm:gap-6 items-stretch`}>
          {displayedProducts.map((product) => {
            const defaultPack = formatPack(product.defaultPack, language);
            const basePrice = product.price;
            const baseOriginalPrice = product.originalPrice;
            const isBuying = buyingProductId === product.id;
            const isJustAdded = addedItemEffect === product.id;

            const productName =
              language === 'ta' && t(`prod.${product.id}.name`)
                ? t(`prod.${product.id}.name`)
                : product.name;

            const productTagline =
              language === 'ta' && t(`prod.${product.id}.tagline`)
                ? t(`prod.${product.id}.tagline`)
                : product.tagline;

            return (
              <div
                key={product.id}
                className="relative group rounded-3xl bg-white border border-cream-300/80 hover:border-gold-400 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* 1. Buying Overlay: Shows ONLY when user clicks Add to Cart (வாங்கும் போது மட்டும் எத்தனை லிட்டர் வேணும்னு காட்டும்) */}
                {isBuying && (
                  <div className="absolute inset-0 bg-white/98 z-30 p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md rounded-3xl border-2 border-forest-900 shadow-2xl animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                          {t('prod.selectLiter')}
                        </span>
                        <h4 className="font-serif font-bold text-forest-950 text-sm sm:text-base leading-tight">
                          {t('prod.howManyLiters')}
                        </h4>
                      </div>
                      <button
                        onClick={() => setBuyingProductId(null)}
                        className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Liter Options with Live Calculated Prices */}
                    <div className="space-y-2 my-auto py-2">
                      {product.packSizes.slice(0, 4).map((pack) => {
                        const packPrice = getPackPrice(product, pack);
                        const packFormatted = formatPack(pack, language);
                        return (
                          <button
                            key={pack}
                            onClick={() => handleSelectLiterAndBuy(product, pack)}
                            className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-forest-900 hover:bg-forest-900 hover:text-white transition-all flex items-center justify-between text-xs font-semibold group/opt cursor-pointer bg-[#faf8f5]"
                          >
                            <span className="flex items-center gap-1.5 text-stone-800 group-hover/opt:text-white">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {packFormatted}
                            </span>
                            <span className="font-bold text-forest-950 group-hover/opt:text-gold-300">
                              ₹{packPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-center border-t border-cream-200">
                      <p className="text-[10px] text-stone-500 font-medium">
                        {t('prod.clickPreferred')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Image & Badges */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-[#faf8f5] p-3 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={productName}
                    className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-forest-900 text-gold-300 shadow-sm">
                        {getBadgeName(product.badge, language)}
                      </span>
                    </div>
                  )}

                  {/* Lab Certificate Link Pill */}
                  {product.labReport && (
                    <button
                      onClick={() => onViewLabReport(product)}
                      className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 text-forest-900 backdrop-blur-xs hover:bg-gold-500 hover:text-forest-950 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                      title="View Lab Analysis Certificate"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{t('prod.labTested')}</span>
                    </button>
                  )}

                  {/* Quick View Button Hover Overlay */}
                  <div className="absolute inset-0 bg-forest-950/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => onQuickView(product)}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-forest-900 font-semibold text-xs shadow-md hover:bg-cream-100 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-forest-700" />
                      <span>{t('prod.details')}</span>
                    </button>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-all cursor-pointer shadow-md z-10 ${
                      favoritesList.includes(product.id)
                        ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                        : 'bg-white/95 text-stone-500 hover:text-red-500 hover:bg-white'
                    }`}
                    title={favoritesList.includes(product.id) ? 'In Favorites' : 'Add to Favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favoritesList.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Clean Purity Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-forest-900 bg-forest-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-forest-900/10">
                        <Droplets className="w-2.5 h-2.5 text-gold-600" />
                        {t('prod.pure')}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {t('prod.mill')}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {productName}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {productTagline}
                    </p>

                    {/* Available sizes note */}
                    <p className="text-[11px] text-stone-400 mt-2 flex items-center gap-1">
                      <span>{t('prod.available')}</span>
                      <span className="font-medium text-stone-600">
                        {language === 'ta' ? '500மி.லி, 1லி, 2லி, 5லி' : '500ml, 1L, 2L, 5L'}
                      </span>
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-2.5 border-t border-cream-200">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold font-serif text-forest-950">
                            ₹{basePrice}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{baseOriginalPrice}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                            {product.discountPercent}% Off
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block -mt-0.5">
                          {t('prod.base')} {defaultPack}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart CTA (Clicking opens: "How many liters do you need?" / "எத்தனை லிட்டர் வேணும்?") */}
                    <button
                      onClick={() => setBuyingProductId(product.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-forest-900 hover:bg-forest-800 text-cream-100 shadow-xs hover:shadow-md'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{t('prod.added')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                          <span>{t('prod.addToCart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 5th Card: View All Products (Clean, Minimal & Neat) */}
          {onViewAllProducts && (
            <div
              onClick={onViewAllProducts}
              className="group rounded-3xl bg-white border border-cream-300/80 hover:border-forest-900 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Upper Visual Area (Matching exact image container of product cards with rich photo) */}
              <div className="relative h-56 sm:h-60 overflow-hidden bg-[#faf8f5] p-3 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
                  alt="Explore All Pure Oils"
                  className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-108 transition-transform duration-500"
                />

                {/* Subtle soft dark vignette overlay with centered Gold Arrow Circle */}
                <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-forest-950/75 via-forest-950/30 to-forest-950/15 flex items-center justify-center transition-all duration-300 group-hover:from-forest-950/85">
                  <div className="w-14 h-14 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-gold-400 transition-all duration-300">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Lower Details: Clean, spacious, not crowded */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block mb-1">
                    {language === 'ta' ? 'முழுமையான பட்டியல்' : 'FULL CATALOG'}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-1">
                    {t('viewAll.title')}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {language === 'ta' ? 'அனைத்து மரச்செக்கு எண்ணெய்கள்' : 'Cold-pressed oils & pure ghee'}
                  </p>
                </div>

                {/* Bottom Action Button (matching Add to Cart style) */}
                <div className="pt-2.5 border-t border-cream-200">
                  <div className="w-full py-2.5 px-3 rounded-xl bg-forest-900 group-hover:bg-forest-800 text-gold-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors">
                    <span>{t('viewAll.button')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
