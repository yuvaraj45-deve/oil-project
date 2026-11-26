import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  X,
  Heart,
  Star,
  Check,
  Tag,
  Gift,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Boxes,
  Eye,
  Flame,
  Award,
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';
import {
  useLanguage,
  getLocalizedProductName,
  getLocalizedProductTagline,
  CATEGORY_DEFAULT_TAMIL_NAMES,
} from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useCMS } from '../context/CMSContext';
import { useOffers } from '../context/OfferContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';

interface ShopPageProps {
  initialCategory?: string;
  onAddToCart: (product: Product, packSize: string, quantity?: number) => void;
  onBuyNow?: (product: Product, packSize: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onViewLabReport: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  onAddToCart,
  onBuyNow,
  onQuickView,
  onViewLabReport,
}) => {
  const { language, t } = useLanguage();
  const { activeOffer, removeOffer } = useOffers();
  const { products, categories: storeCategories } = useStore();

  const [selectedCat, setSelectedCat] = useState<string>(
    initialCategory && initialCategory !== 'combo-offers' ? initialCategory : 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);
  const [selectedPacks, setSelectedPacks] = useState<Record<string, string>>({});
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);

  useEffect(() => {
    const handleFavChange = (e: any) => {
      setFavoritesList(e.detail || getFavorites());
    };
    window.addEventListener('ssoil_favorites_updated', handleFavChange);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavChange);
  }, []);

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

  const getPackPrice = (product: Product, pack: string) => {
    if (
      pack.includes('500 ml') ||
      pack.includes('500g') ||
      pack.includes('500 ml Bottle') ||
      pack.includes('500ml Glass Jar') ||
      pack.includes('500 ml Jar')
    ) {
      return Math.round(product.price * 0.55);
    }
    if (pack.includes('250 ml') || pack.includes('250g') || pack.includes('250 ml Jar')) {
      return Math.round(product.price * 0.32);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can')) {
      return Math.round(product.price * 1.95);
    }
    if (
      pack.includes('5 Litre') ||
      pack.includes('5L') ||
      pack.includes('5 Litre Can') ||
      pack.includes('5 Litre Tin')
    ) {
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

  const getBadgeName = (badge: string, lang: string) => {
    if (lang !== 'ta') return badge;
    if (badge === 'Wood-Pressed' || badge === 'Mara Chekku') return 'மரச்செக்கு';
    if (badge === 'Bestseller') return 'அதிக விற்பனை';
    if (badge === '100% Pure' || badge === 'Pure') return '100% தூயது';
    if (badge === 'Light & Pure') return 'லேசானது & தூயது';
    if (badge === 'Heart Care') return 'இதய நலம்';
    if (badge === 'Temple Pooja') return 'பூஜை சிறப்பு';
    if (badge === 'Bilona Pure') return 'பிலோனா நெய்';
    if (badge === 'Native Pure') return 'இயற்கை தூய்மை';
    if (badge === 'Combo Offer' || badge === 'SPECIAL COMBO DEAL') return 'சிறப்பு காம்போ சலுகை';
    if (badge === 'Buy 2 Get 1 Free') return '2 வாங்கினால் 1 இலவசம்';
    if (badge === 'Festive Special') return 'பண்டிகை சிறப்பு';
    return badge;
  };

  const resolveProductImage = (product: Product): string => {
    const img = product.image || '';
    if (img.startsWith('/products/')) return img;
    const name = (product.name || '').toLowerCase();
    const slug = (product.category || '').toLowerCase();
    if (name.includes('groundnut') || slug.includes('groundnut')) return '/products/groundnut_oil.jpg?v=ssoil';
    if (name.includes('sesame') || name.includes('gingelly') || slug.includes('sesame'))
      return '/products/sesame_oil.jpg?v=ssoil';
    if (name.includes('coconut') || slug.includes('coconut')) return '/products/coconut_oil.jpg?v=ssoil';
    if (name.includes('sunflower') || slug.includes('sunflower')) return '/products/sunflower_oil.jpg?v=ssoil';
    if (name.includes('rice bran') || slug.includes('ricebran')) return '/products/rice_bran_oil.jpg?v=ssoil';
    if (name.includes('mustard') || slug.includes('mustard')) return '/products/mustard_oil.jpg?v=ssoil';
    if (name.includes('pooja') || name.includes('lamp') || name.includes('deepam') || slug.includes('pooja'))
      return '/products/lamp_oil.jpg?v=ssoil';
    if (name.includes('cooking') || slug.includes('cooking')) return '/products/sunflower_oil.jpg?v=ssoil';
    return img || '/products/sesame_oil.jpg?v=ssoil';
  };

  const handleSelectLiterAndBuy = (product: Product, pack: string, qty = 1) => {
    onAddToCart(product, pack, qty);
    setBuyingProductId(null);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1500);
  };

  const categoriesList = useMemo(() => {
    const baseList = storeCategories && storeCategories.length > 0 ? storeCategories : CATEGORIES_DATA;
    // Keep individual categories in Section 3 filters (exclude combo-offers since Section 2 owns combos)
    return baseList.filter((c) => c.slug !== 'combo-offers' && c.slug !== 'combo');
  }, [storeCategories]);

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Helper to detect Combo Offer products
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

  // Regular individual oils for products grid (excluding any legacy combo badges)
  const regularSourceProducts = useMemo(() => {
    return sourceProducts.filter((p) => !isComboProduct(p));
  }, [sourceProducts]);

  // Filter regular products by category pill and search query
  const filteredRegularProducts = useMemo(() => {
    return regularSourceProducts.filter((product) => {
      const matchesCat = selectedCat === 'all' || product.category === selectedCat;
      if (!matchesCat) return false;

      const search = searchQuery.toLowerCase().trim();
      if (!search) return true;
      const prodName = (product.name || '').toLowerCase();
      const prodTamil = (product.tamilName || '').toLowerCase();
      const prodTagline = (product.tagline || '').toLowerCase();
      const prodDesc = (product.description || '').toLowerCase();
      return (
        prodName.includes(search) ||
        prodTamil.includes(search) ||
        prodTagline.includes(search) ||
        prodDesc.includes(search)
      );
    });
  }, [regularSourceProducts, selectedCat, searchQuery]);

  // Sort regular products
  const sortedRegularProducts = useMemo(() => {
    return [...filteredRegularProducts].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filteredRegularProducts, sortBy]);

  // 3. Best Selling Products for Section 5
  const bestSellingProducts = useMemo(() => {
    return regularSourceProducts
      .filter((p) => (p.rating && p.rating >= 4.9) || p.badge === 'Bestseller' || p.featured)
      .slice(0, 4);
  }, [regularSourceProducts]);

  const { siteContent } = useCMS();
  const productCms = siteContent?.product?.status === 'PUBLISHED' ? siteContent.product : null;
  const pageTitle =
    language === 'ta'
      ? productCms?.tamilSectionTitle || t('shop.title')
      : productCms?.sectionTitle || t('shop.title');
  const pageSubtitle =
    language === 'ta'
      ? productCms?.tamilDescription || t('shop.subtitle')
      : productCms?.description || t('shop.subtitle');

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14 text-stone-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* ============================================================ */}
        {/* 1. SHOP PAGE HEADING & PROMOTIONAL BANNER                    */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-forest-950 text-gold-300 text-[11px] font-black uppercase tracking-wider shadow-xs">
              <span>SS OIL Traditional Mill Store</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {pageSubtitle}
            </p>
          </div>

          {/* Premium Promotional Banner Immediately Below Shop Page Heading */}
          <div className="max-w-7xl mx-auto">
            {activeOffer ? (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-forest-950 to-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border-2 border-emerald-500/40">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gold-400 text-forest-950 flex items-center justify-center font-black shrink-0 shadow-md">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-md text-gold-300 border border-white/20">
                        {activeOffer.code}
                      </span>
                      <strong className="text-sm sm:text-base font-bold text-white">
                        {language === 'ta' ? activeOffer.tamilTitle : activeOffer.title}
                      </strong>
                    </div>
                    <p className="text-xs text-cream-200/90 mt-0.5">
                      {language === 'ta'
                        ? 'இந்த சலுகை மூலம் கார்ட்டில் நேரடி தள்ளுபடி கழிக்கப்படும்.'
                        : 'Discount coupon will be applied automatically at checkout!'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={removeOffer}
                    className="px-3.5 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 text-xs font-bold transition-all cursor-pointer border border-rose-300/30"
                  >
                    {language === 'ta' ? 'நீக்கு' : 'Remove'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-950 border border-emerald-800 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-forest-950 flex items-center justify-center font-black shrink-0 shadow-md">
                    <Award className="w-6 h-6 text-forest-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-forest-950 font-mono text-[10px] font-black uppercase tracking-wider">
                        100% PURE & NATURAL
                      </span>
                      <strong className="text-base sm:text-lg font-serif font-bold text-cream-100">
                        {language === 'ta'
                          ? '🌿 100% தூய வாகை மரச்செக்கு எண்ணெய்கள் • நேரடி ஆலை உத்திரவாதம்'
                          : '🌿 100% Traditional Cold-Pressed Wood Chekku Oils • Mill Direct Guarantee'}
                      </strong>
                    </div>
                    <p className="text-xs sm:text-sm text-cream-200/80 font-medium mt-0.5">
                      {language === 'ta'
                        ? 'எந்தவித கலப்படமும் இன்றி, பாரம்பரிய வாகை மரச்செக்கில் பிழியப்படும் ஆரோக்கியமான சமையல் எண்ணெய்கள்.'
                        : 'Pure, chemical-free cold-pressed oils crushed in authentic Vaagai wood mortars.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. PRODUCT CATEGORIES / FILTERS & SEARCH TOOLBAR             */}
        {/* ============================================================ */}
        <section className="space-y-5 pt-4">
          <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-black text-xl text-forest-950">
                {language === 'ta' ? 'தயாரிப்பு வகைகள் & வடிகட்டி' : 'Explore by Category'}
              </h3>
              <p className="text-xs text-stone-500">
                Filter pure cold-pressed oils by seed type & culinary usage
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">
                {t('shop.sortBy')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 cursor-pointer shadow-2xs"
              >
                <option value="featured">{t('shop.sort.featured')}</option>
                <option value="price-low">{t('shop.sort.priceLow')}</option>
                <option value="price-high">{t('shop.sort.priceHigh')}</option>
                <option value="rating">{t('shop.sort.rating')}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${selectedCat === 'all'
                ? 'bg-forest-950 text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
            >
              {language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'All Products'}
            </button>
            {categoriesList.map((cat) => {
              const isSelected = selectedCat === cat.slug;
              const displayName =
                language === 'ta'
                  ? cat.tamilTitle || CATEGORY_DEFAULT_TAMIL_NAMES[cat.slug] || cat.title
                  : cat.title;

              return (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => setSelectedCat(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${isSelected
                    ? 'bg-forest-950 text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Search Box & Product Counter */}
          <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('shop.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 font-medium">
              <span>{t('shop.showing')} </span>
              <strong className="text-forest-950 font-bold">{sortedRegularProducts.length}</strong>
              <span> {t('shop.productsCount')}</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. ALL PRODUCTS                                              */}
        {/* ============================================================ */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center justify-between border-b border-stone-200/90 pb-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950">
              {language === 'ta' ? 'அனைத்து மரச்செக்கு எண்ணெய்கள்' : 'All Products'}
            </h2>
            <span className="text-xs text-stone-500 font-bold">
              {sortedRegularProducts.length} {language === 'ta' ? 'தயாரிப்புகள்' : 'Pure Oils'}
            </span>
          </div>

          {sortedRegularProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-950">
                {t('shop.noProducts')}
              </h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCat('all');
                }}
                className="px-5 py-2 rounded-xl bg-forest-900 text-cream-100 text-xs font-bold cursor-pointer hover:bg-forest-800 transition-colors"
              >
                {language === 'ta' ? 'அனைத்தையும் காட்டுக' : 'Reset Filters & Search'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
              {sortedRegularProducts.map((product) => {
                const packOptions =
                  product.packSizes && product.packSizes.length > 0
                    ? product.packSizes
                    : ['1 Litre Bottle', '500 ml Bottle', '2 Litre Bottle', '5 Litre Can'];
                const currentPack =
                  selectedPacks[product.id] ||
                  product.defaultPack ||
                  packOptions[0] ||
                  '1 Litre Bottle';
                const currentPackPrice = getPackPrice(product, currentPack);
                const currentOfferPrice =
                  activeOffer && activeOffer.discountType === 'percentage'
                    ? Math.round(currentPackPrice * (1 - activeOffer.discountValue / 100))
                    : currentPackPrice;
                const currentSavings = currentPackPrice - currentOfferPrice;
                const isJustAdded = addedItemEffect === product.id;
                const isBuying = buyingProductId === product.id;
                const resolvedImage = resolveProductImage(product);

                const productName = getLocalizedProductName(product, language);
                const productTagline = getLocalizedProductTagline(product, language);

                return (
                  <div
                    key={product.id}
                    className="relative group rounded-3xl bg-white border border-stone-200/90 hover:border-gold-400 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
                                <span className="font-serif font-bold group-hover/opt:text-gold-300">
                                  ₹{packPrice}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-[10px] text-center text-stone-400">
                          {language === 'ta' ? '₹499 மேல் இலவச டெலிவரி' : 'Free Express Delivery above ₹499'}
                        </p>
                      </div>
                    )}

                    {/* Product Image Showcase */}
                    <div
                      onClick={() => onQuickView(product)}
                      className="relative h-60 sm:h-64 overflow-hidden bg-[#FAF8F5] p-4 flex items-center justify-center cursor-pointer"
                    >
                      {/* User SS OIL Logo & Brand Badge */}
                      <div className="absolute top-3.5 right-12 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs border border-amber-300/80 shadow-2xs pointer-events-none select-none">
                        <img src="/admin_assets/ss_gold_drop_logo.png" alt="SS Oil" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] font-bold font-serif text-forest-950 tracking-wider">SS OIL</span>
                      </div>

                      <img
                        src={resolvedImage}
                        alt={productName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                      />

                      {/* Highlight Badge */}
                      {product.badge && (
                        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-forest-950 text-white shadow-xs">
                          {getBadgeName(product.badge, language)}
                        </div>
                      )}

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full transition-all cursor-pointer shadow-sm z-10 ${favoritesList.includes(product.id)
                          ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                          : 'bg-white/90 text-stone-400 hover:text-red-500 hover:bg-white'
                          }`}
                        title={favoritesList.includes(product.id) ? 'In Favorites' : 'Add to Favorites'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${favoritesList.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                        />
                      </button>
                    </div>

                    {/* Card Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div onClick={() => onQuickView(product)} className="cursor-pointer space-y-2">
                        {/* Rating */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-[10px] text-stone-500 font-medium">
                            {formatPack(currentPack, language)}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span className="text-stone-800 text-xs">{product.rating || 4.9}</span>
                          </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950 group-hover:text-amber-800 transition-colors line-clamp-1">
                          {productName}
                        </h3>

                        {/* Short Tagline */}
                        <p className="text-xs text-stone-500 line-clamp-1">
                          {productTagline}
                        </p>
                      </div>

                      {/* Footer Pricing & Add to Cart Button */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          {activeOffer && activeOffer.discountType === 'percentage' ? (
                            <>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-serif font-black text-forest-950">
                                  ₹{currentOfferPrice}
                                </span>
                                <span className="text-xs line-through text-stone-400">
                                  ₹{currentPackPrice}
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-700 font-bold block">
                                {language === 'ta'
                                  ? `₹${currentSavings} குறைவு`
                                  : `Save ₹${currentSavings}`}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg font-serif font-black text-forest-950">
                                ₹{currentPackPrice}
                              </span>
                              <span className="text-[10px] text-stone-400 block -mt-0.5">
                                {formatPack(currentPack, language)}
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBuyingProductId(product.id);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-forest-950 hover:bg-forest-900 text-white active:scale-95'
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
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 5. BEST SELLING PRODUCTS SECTION                             */}
        {/* ============================================================ */}
        {bestSellingProducts.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-forest-950 flex items-center justify-center font-black shadow-xs">
                  <Award className="w-5 h-5 text-forest-950" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950">
                    ⭐ Best Selling Products
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Customer favorites & most-loved traditional Mara Chekku cold-pressed oils.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black self-start sm:self-auto border border-amber-200">
                Top Rated by 1,000+ Families
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
              {bestSellingProducts.map((product) => {
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

                return (
                  <div
                    key={`bestseller-${product.id}`}
                    className="relative group rounded-3xl bg-white border border-stone-200/90 hover:border-gold-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
                      </div>
                    )}

                    <div
                      onClick={() => onQuickView(product)}
                      className="relative h-52 overflow-hidden bg-[#FAF8F5] p-4 flex items-center justify-center cursor-pointer"
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
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div onClick={() => onQuickView(product)} className="cursor-pointer space-y-1">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="text-stone-800">{product.rating || 4.9}</span>
                          <span className="text-stone-400 text-[10px]">({product.reviewsCount || 150}+)</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-forest-950 group-hover:text-amber-800 transition-colors line-clamp-1">
                          {productName}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-medium block">
                          {formatPack(currentPack, language)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-lg font-serif font-black text-forest-950">
                          ₹{currentPackPrice}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBuyingProductId(`bestseller-${product.id}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer ${isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-forest-950 hover:bg-forest-900 text-white active:scale-95'
                            }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>{t('prod.added')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 text-gold-400" />
                              <span>{language === 'ta' ? 'கார்ட்டில் சேர்' : 'Add'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
