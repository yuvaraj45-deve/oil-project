import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Eye, Check, ShieldCheck, Droplets, ArrowRight, X, Heart, Award, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';
import { useLanguage, getLocalizedProductName, getLocalizedProductTagline } from '../context/LanguageContext';
import { useStore, getProductKey } from '../context/StoreContext';
import { useOffers } from '../context/OfferContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { resolveProductImage } from '../utils/productUtils';

interface FeaturedProductsProps {
  onAddToCart: (product: Product, packSize: string, quantity?: number) => void;
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
  const { products, categories: storeCategories, settings } = useStore();
  const { activeOffer } = useOffers();
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);
  const [selectedPacks, setSelectedPacks] = useState<Record<string, string>>({});
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);

  const handleSelectLiterAndBuy = (product: Product, pack: string) => {
    onAddToCart(product, pack, 1);
    setBuyingProductId(null);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1500);
  };

  useEffect(() => {
    const handleFavChange = (e: any) => {
      setFavoritesList(e.detail || getFavorites());
    };
    window.addEventListener('ssoil_favorites_updated', handleFavChange);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavChange);
  }, []);

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Detect Combo Offer products so they don't mix into single oils
  const isComboProduct = (product: Product): boolean => {
    const cat = (product.category || '').toLowerCase();
    const badge = (product.badge || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    return (
      cat === 'combo-offers' ||
      cat === 'combo' ||
      badge.includes('combo') ||
      badge.includes('buy 2 get 1') ||
      badge.includes('b2g1') ||
      name.includes('combo') ||
      name.includes('buy 2 get 1') ||
      name.includes('trio')
    );
  };

  const regularSourceProducts = useMemo(() => {
    const nonCombos = sourceProducts.filter((p) => !isComboProduct(p));
    const seen = new Set<string>();
    return nonCombos.filter((p) => {
      const name = (p.name || '').toLowerCase();
      let key = '';
      if (name.includes('groundnut') || name.includes('peanut')) key = 'groundnut-oil';
      else if (name.includes('sesame') || name.includes('gingelly')) key = 'sesame-oil';
      else if (name.includes('coconut')) key = 'coconut-oil';
      else if (name.includes('sunflower')) key = 'sunflower-oil';
      else if (name.includes('rice bran') || name.includes('ricebran')) key = 'ricebran-oil';
      else if (name.includes('mustard')) key = 'mustard-oil';
      else if (name.includes('pooja') || name.includes('lamp') || name.includes('deepam')) key = 'pooja-special';
      else if (name.includes('ghee')) key = 'a2-desi-ghee';
      else if (name.includes('jaggery') || name.includes('karupatti')) key = 'palm-jaggery-special';
      else if (name.includes('cooking') || name.includes('everyday')) key = 'everyday-cooking-oil';
      else key = p.id;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sourceProducts]);

  // Exact 4 best-selling products matching ShopPage.tsx Section 5
  const bestSellingProducts = useMemo(() => {
    return regularSourceProducts
      .filter((p) => (p.rating && p.rating >= 4.9) || p.badge === 'Bestseller' || p.featured)
      .slice(0, 4);
  }, [regularSourceProducts]);

  const displayedProducts = useMemo(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const filtered = sourceProducts.filter((p) => p.category === selectedCategory);
      return maxProducts ? filtered.slice(0, maxProducts) : filtered;
    }
    return bestSellingProducts;
  }, [selectedCategory, sourceProducts, maxProducts, bestSellingProducts]);

  const formatPack = (pack?: string, lang?: string) => {
    if (!pack) return lang === 'ta' ? '1 லிட்டர் பாட்டில்' : '1 Litre Bottle';
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

  const getPackPrice = (product: Product, pack?: string) => {
    if (!product) return 0;
    if (!pack) return product.price || 0;
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

  return (
    <section id="products" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Matching ShopPage.tsx Best Selling Products Section 5 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-forest-950 flex items-center justify-center font-black shadow-xs shrink-0">
              <Award className="w-5 h-5 text-forest-950" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-forest-950">
                {language === 'ta' ? '⭐ அதிகம் விற்பனையாகும் மரச்செக்கு எண்ணெய்கள்' : '⭐ Best Selling Products'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {language === 'ta'
                  ? 'வாடிக்கையாளர்களின் விருப்பமான பாரம்பரிய மரச்செக்கு இயற்கை எண்ணெய்கள்.'
                  : 'Customer favorites & most-loved traditional Mara Chekku cold-pressed oils.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-200 shadow-2xs">
              {language === 'ta' ? '1,000+ குடும்பங்களின் தேர்வு' : 'Top Rated by 1,000+ Families'}
            </span>
            {onViewAllProducts && (
              <button
                type="button"
                onClick={onViewAllProducts}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                <span>{language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'Shop All Oils'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Best Selling Products 4-Column Grid - 1:1 Matching ShopPage.tsx Section 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayedProducts.map((product) => {
            const packOptions =
              product.packSizes && product.packSizes.length > 0
                ? product.packSizes
                : ['1 Litre Bottle', '500 ml Bottle', '2 Litre Bottle', '5 Litre Can'];
            const currentPack =
              selectedPacks[`bestseller-${product.id}`] ||
              product.defaultPack ||
              packOptions[0] ||
              '1 Litre Bottle';
            const currentPackPrice = getPackPrice(product, currentPack);
            const isJustAdded = addedItemEffect === product.id;
            const isBuying = buyingProductId === `bestseller-${product.id}` || buyingProductId === product.id;
            const resolvedImage = resolveProductImage(product);
            const productName = getLocalizedProductName(product, language);
            const productTagline = getLocalizedProductTagline(product, language);

            return (
              <div
                key={`bestseller-${product.id}`}
                className="relative group rounded-3xl bg-white border border-stone-200/90 hover:border-gold-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Liter Selection Overlay */}
                {isBuying && (
                  <div className="absolute inset-0 bg-white/98 z-30 p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md rounded-3xl border-2 border-forest-900 shadow-2xl animate-fadeIn">
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
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBuyingProductId(null);
                        }}
                        className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 my-auto py-2 overflow-y-auto max-h-[190px]">
                      {packOptions.map((pack) => {
                        const packPrice = getPackPrice(product, pack);
                        const packFormatted = formatPack(pack, language);
                        return (
                          <button
                            key={pack}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectLiterAndBuy(product, pack);
                            }}
                            className="w-full p-2.5 rounded-xl border border-stone-200 hover:border-forest-900 hover:bg-forest-950 hover:text-white transition-all flex items-center justify-between text-xs font-semibold group/opt cursor-pointer bg-[#faf8f5]"
                          >
                            <span className="font-bold">{packFormatted}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-serif text-sm">₹{packPrice}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 group-hover/opt:bg-gold-400 group-hover/opt:text-forest-950 font-bold transition-colors">
                                {language === 'ta' ? 'தேர்ந்தெடு' : 'Select'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-center text-stone-400">
                      {language === 'ta' ? '₹499 மேல் இலவச டெலிவரி' : 'Free Express Delivery above ₹499'}
                    </p>
                  </div>
                )}

                {/* Product Image Container */}
                <div
                  onClick={() => onQuickView(product)}
                  className="relative h-56 sm:h-60 overflow-hidden bg-[#FAF8F5] p-4 flex items-center justify-center cursor-pointer"
                >
                  {/* User SS OIL Logo & Brand Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-amber-300/80 shadow-2xs pointer-events-none select-none">
                    <img src="/admin_assets/ss_gold_drop_logo.png" alt="SS Oil" className="w-3.5 h-3.5 object-contain" />
                    <span className="text-[10px] font-bold font-serif text-forest-950 tracking-wider">SS OIL</span>
                  </div>

                  <img
                    src={resolvedImage}
                    alt={productName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-400 text-forest-950 shadow-2xs">
                    ⭐ BESTSELLER
                  </span>

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
                  <div onClick={() => onQuickView(product)} className="cursor-pointer space-y-1.5">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-stone-800">{product.rating || 4.9}</span>
                      <span className="text-stone-400 text-[10px]">({product.reviewsCount || 150}+)</span>
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-forest-950 group-hover:text-amber-800 transition-colors line-clamp-1">
                      {productName}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {productTagline}
                    </p>
                    <span className="text-[10px] text-stone-400 font-medium block">
                      {formatPack(currentPack, language)}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-serif font-black text-forest-950">
                        ₹{currentPackPrice}
                      </span>
                      <span className="text-[10px] text-stone-400 block -mt-0.5">
                        {language === 'ta' ? 'அனைத்து வரிகளும் உள்பட' : 'Inclusive of all taxes'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBuyingProductId(`bestseller-${product.id}`);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-forest-950 hover:bg-forest-900 text-white active:scale-95'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('prod.added')}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                          <span>{language === 'ta' ? 'கார்ட்டில் சேர்' : 'Add to Cart'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Mara Chekku Oils Footer Banner */}
        {onViewAllProducts && (
          <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-cream-100 to-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200/60">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl">🌿</span>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-forest-950">
                  {language === 'ta'
                    ? 'மேலும் 12+ தூய மரச்செக்கு எண்ணெய் வகைகளை ஆராயுங்கள்'
                    : 'Explore all 12+ Traditional Mara Chekku Oil Varieties'}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'ta'
                    ? 'சேலம் ஆலை நேரடித் தயாரிப்பு • 100% தூய்மை உத்தரவாதம் • இலவச ஹோம் டெலிவரி'
                    : 'Salem Mill Direct • Zero Chemicals • Lab Batch Certified • Free Express Delivery'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onViewAllProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>{language === 'ta' ? 'அனைத்து எண்ணெய்களையும் பார்க்க' : 'View Full Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
