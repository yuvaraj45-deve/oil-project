import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, X, Heart, Star, Check, Tag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';
import { useLanguage, getLocalizedProductName, getLocalizedProductTagline, CATEGORY_DEFAULT_TAMIL_NAMES } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useCMS } from '../context/CMSContext';
import { useOffers } from '../context/OfferContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';

interface ShopPageProps {
  initialCategory?: string;
  onAddToCart: (product: Product, packSize: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onViewLabReport: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  onAddToCart,
  onQuickView,
  onViewLabReport,
}) => {
  const { language, t } = useLanguage();
  const { activeOffer, availableOffers, removeOffer } = useOffers();
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || 'all');
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
    return badge;
  };

  // Resolves authentic SS OIL packshots and prevents generic Unsplash photos from ever displaying
  const resolveProductImage = (product: Product): string => {
    const img = product.image || '';
    if (img.startsWith('/products/')) return img;
    const name = (product.name || '').toLowerCase();
    const slug = (product.category || '').toLowerCase();
    if (name.includes('groundnut') || slug.includes('groundnut')) return '/products/groundnut_oil.jpg?v=ssoil';
    if (name.includes('sesame') || name.includes('gingelly') || slug.includes('sesame')) return '/products/sesame_oil.jpg?v=ssoil';
    if (name.includes('coconut') || slug.includes('coconut')) return '/products/coconut_oil.jpg?v=ssoil';
    if (name.includes('sunflower') || slug.includes('sunflower')) return '/products/sunflower_oil.jpg?v=ssoil';
    if (name.includes('rice bran') || slug.includes('ricebran')) return '/products/rice_bran_oil.jpg?v=ssoil';
    if (name.includes('mustard') || slug.includes('mustard')) return '/products/mustard_oil.jpg?v=ssoil';
    if (name.includes('pooja') || name.includes('lamp') || name.includes('deepam') || slug.includes('pooja')) return '/products/lamp_oil.jpg?v=ssoil';
    if (name.includes('cooking') || slug.includes('cooking')) return '/products/sunflower_oil.jpg?v=ssoil';
    return img;
  };

  const handleSelectLiterAndBuy = (product: Product, pack: string) => {
    onAddToCart(product, pack);
    setBuyingProductId(null);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1500);
  };

  const { products, categories: storeCategories } = useStore();
  const categoriesList = storeCategories && storeCategories.length > 0 ? storeCategories : CATEGORIES_DATA;
  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Filtering: Filter by selected category pill and search query
  const filteredProducts = sourceProducts.filter((product) => {
    const matchesCat = selectedCat === 'all' || product.category === selectedCat;
    if (!matchesCat) return false;

    const prodName = (product.name || '').toLowerCase();
    const prodTamil = (product.tamilName || '').toLowerCase();
    const prodTagline = (product.tagline || '').toLowerCase();
    const prodDesc = (product.description || '').toLowerCase();
    const search = searchQuery.toLowerCase().trim();
    return (
      !search ||
      prodName.includes(search) ||
      prodTamil.includes(search) ||
      prodTagline.includes(search) ||
      prodDesc.includes(search)
    );
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

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
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Category Filter Pills at Top of Shop Page */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCat === 'all'
                ? 'bg-forest-950 text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'All Products'}
          </button>
          {categoriesList.map((cat) => {
            const isSelected = selectedCat === cat.slug;
            const displayName = language === 'ta'
              ? (cat.tamilTitle || CATEGORY_DEFAULT_TAMIL_NAMES[cat.slug] || cat.title)
              : cat.title;

            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-forest-950 text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Toolbar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-3 sm:px-5 sm:py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('shop.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:bg-white transition-all"
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

            {/* Showing Count */}
            <div className="text-xs text-stone-500 font-medium hidden md:block">
              <span>{t('shop.showing')} </span>
              <strong className="text-forest-950 font-bold">{sortedProducts.length}</strong>
              <span> {t('shop.productsCount')}</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                {t('shop.sortBy')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 cursor-pointer"
              >
                <option value="featured">{t('shop.sort.featured')}</option>
                <option value="price-low">{t('shop.sort.priceLow')}</option>
                <option value="price-high">{t('shop.sort.priceHigh')}</option>
                <option value="rating">{t('shop.sort.rating')}</option>
              </select>
            </div>

          </div>

        </div>

        {/* Active Offer Banner or Promo Teaser */}
        <div className="max-w-7xl mx-auto mb-6">
          {activeOffer ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-forest-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-emerald-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-400 text-forest-950 flex items-center justify-center font-black shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black uppercase bg-white/20 px-2 py-0.5 rounded text-gold-300">
                      {activeOffer.code}
                    </span>
                    <strong className="text-sm font-bold text-white">
                      {language === 'ta' ? activeOffer.tamilTitle : activeOffer.title}
                    </strong>
                  </div>
                  <p className="text-xs text-cream-200/80 mt-0.5">
                    {language === 'ta'
                      ? 'இந்த சலுகை மூலம் கார்ட் மற்றும் செக்அவுட்டில் நேரடி தள்ளுபடி கழிக்கப்படும்.'
                      : 'Discount will be deducted directly in cart and checkout!'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={removeOffer}
                  className="px-3 py-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 text-xs font-bold transition-all cursor-pointer"
                >
                  {language === 'ta' ? 'நீக்கு' : 'Remove'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-[#FAF8F5] border border-amber-200/80 flex items-center justify-between gap-3 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {language === 'ta'
                    ? '🎉 மரச்செக்கு எண்ணெய்களுக்கு பிரத்யேக காம்போ சலுகைகள் உள்ளன!'
                    : '🎉 Direct Mill Combo Deals: Save up to 33% on Mara Chekku oil bundle packs!'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('combo-offers')}
                className="font-bold text-forest-950 underline hover:text-amber-800 cursor-pointer shrink-0"
              >
                {language === 'ta' ? 'காம்போ சலுகைகள்' : 'View Combo Packs'} →
              </button>
            </div>
          )}
        </div>

        {/* Product Grid: Clean, Modern & Consistent */}
        {sortedProducts.length === 0 ? (
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
              }}
              className="px-5 py-2 rounded-xl bg-forest-900 text-cream-100 text-xs font-bold cursor-pointer hover:bg-forest-800 transition-colors"
            >
              {language === 'ta' ? 'தேடலை மீட்டமைக்க' : 'Clear Search'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {sortedProducts.map((product) => {
              const packOptions = product.packSizes && product.packSizes.length > 0
                ? product.packSizes
                : ['1 Litre Bottle', '500 ml Bottle', '2 Litre Bottle', '5 Litre Can'];
              const currentPack = selectedPacks[product.id] || product.defaultPack || packOptions[0] || '1 Litre Bottle';
              const currentPackPrice = getPackPrice(product, currentPack);
              const currentOfferPrice = activeOffer && activeOffer.discountType === 'percentage'
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
                  {/* 1. Buying Overlay: Shows ONLY when user clicks Add to Cart (எத்தனை லிட்டர் வேணும்?) */}
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

                      {/* Liter Options with Live Calculated Prices */}
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
                    <img
                      src={resolvedImage}
                      alt={productName}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    />

                    {/* Minimalist Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className={`absolute top-3.5 right-3.5 p-2 rounded-full transition-all cursor-pointer shadow-sm z-10 ${
                        favoritesList.includes(product.id)
                          ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                          : 'bg-white/90 text-stone-400 hover:text-red-500 hover:bg-white'
                      }`}
                      title={favoritesList.includes(product.id) ? 'In Favorites' : 'Add to Favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${favoritesList.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Card Details: Clean, Spacious & Neat */}
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
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                          isJustAdded
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

      </div>
    </div>
  );
};
