import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, X } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

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
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedExtraction, setSelectedExtraction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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

  const categories = [
    { slug: 'all', label: t('shop.cat.all') },
    { slug: 'groundnut-oil', label: t('shop.cat.groundnut') },
    { slug: 'sesame-oil', label: t('shop.cat.sesame') },
    { slug: 'coconut-oil', label: t('shop.cat.coconut') },
    { slug: 'cooking-oil', label: t('shop.cat.cooking') },
    { slug: 'pooja-special', label: t('shop.cat.pooja') },
    { slug: 'a2-desi-ghee', label: t('shop.cat.ghee') },
    { slug: 'palm-jaggery-special', label: t('shop.cat.jaggery') },
  ];

  const { products } = useStore();
  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Filtering
  const filteredProducts = sourceProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesExtraction =
      selectedExtraction === 'all' ||
      product.extractionMethod.toLowerCase().includes(selectedExtraction.toLowerCase());
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesExtraction && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="bg-cream-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header & Breadcrumb */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <span>{t('shop.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {t('shop.title')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('shop.subtitle')}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-cream-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={t('shop.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-cream-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-forest-900 text-cream-100 shadow-sm'
                      : 'bg-cream-100/70 text-stone-600 hover:bg-cream-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
                {t('shop.sortBy')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 focus:outline-none"
              >
                <option value="featured">{t('shop.sort.featured')}</option>
                <option value="price-low">{t('shop.sort.priceLow')}</option>
                <option value="price-high">{t('shop.sort.priceHigh')}</option>
                <option value="rating">{t('shop.sort.rating')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
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
                className="relative bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badge */}
                  <div className="relative h-64 bg-cream-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-forest-950/90 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {product.extractionMethod}
                    </div>

                    <button
                      onClick={() => onQuickView(product)}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md text-forest-900 hover:bg-forest-900 hover:text-white transition-all shadow-md cursor-pointer"
                      title={t('prod.details')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-gold-700 uppercase tracking-widest">
                        {product.categoryName}
                      </span>
                      <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                        {t('prod.pure')}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-forest-950 line-clamp-1">
                      {productName}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {productTagline}
                    </p>

                    {/* Available sizes */}
                    <p className="text-[11px] text-stone-400 mt-2">
                      {t('prod.available')}{' '}
                      <span className="text-stone-600 font-medium">
                        {language === 'ta' ? '500மி.லி, 1லி, 2லி, 5லி' : '500ml, 1L, 2L, 5L'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Buying Overlay: Shows ONLY when user clicks Add to Cart */}
                {buyingProductId === product.id && (
                  <div className="absolute inset-0 bg-white/98 z-30 p-5 flex flex-col justify-between backdrop-blur-md rounded-3xl border-2 border-forest-900 shadow-2xl animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                          {t('prod.selectLiter')}
                        </span>
                        <h4 className="font-serif font-bold text-forest-950 text-sm">
                          {t('prod.howManyLiters')}
                        </h4>
                      </div>
                      <button
                        onClick={() => setBuyingProductId(null)}
                        className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 my-auto py-2">
                      {product.packSizes.map((pack) => {
                        const packPrice = getPackPrice(product, pack);
                        const packFormatted = formatPack(pack, language);
                        return (
                          <button
                            key={pack}
                            onClick={() => {
                              onAddToCart(product, pack);
                              setBuyingProductId(null);
                            }}
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

                {/* Footer Pricing & CTA */}
                <div className="p-5 pt-0 border-t border-cream-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs line-through text-stone-400 block">
                      {t('shop.mrp')} ₹{product.originalPrice}
                    </span>
                    <span className="text-lg font-serif font-black text-forest-900">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => setBuyingProductId(product.id)}
                    className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t('prod.addToCart')}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
