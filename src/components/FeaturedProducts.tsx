import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check, Sparkles, Filter, ShieldCheck, Droplets } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';

interface FeaturedProductsProps {
  onAddToCart: (product: Product, packSize: string) => void;
  onQuickView: (product: Product) => void;
  onViewLabReport: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  onAddToCart,
  onQuickView,
  onViewLabReport,
  selectedCategory,
  onSelectCategory,
}) => {
  // Local state to track selected pack size per product card
  const [selectedPacks, setSelectedPacks] = useState<Record<string, string>>({
    'ss-groundnut-1000': '1 Litre Bottle',
    'ss-sesame-1000': '1 Litre Bottle',
    'ss-coconut-1000': '1 Litre Glass Jar',
    'ss-cooking-daily-1000': '1 Litre Bottle',
  });

  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  const categories = [
    { label: 'All Oils', value: 'all' },
    { label: 'Groundnut Oil', value: 'groundnut-oil' },
    { label: 'Sesame Oil', value: 'sesame-oil' },
    { label: 'Coconut Oil', value: 'coconut-oil' },
    { label: 'Cooking Oil', value: 'cooking-oil' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  const handlePackChange = (productId: string, pack: string) => {
    setSelectedPacks((prev) => ({ ...prev, [productId]: pack }));
  };

  const handleAddToCartClick = (product: Product) => {
    const pack = selectedPacks[product.id] || product.defaultPack;
    onAddToCart(product, pack);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1200);
  };

  return (
    <section id="products" className="py-16 sm:py-20 bg-cream-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
              <span>Premium Edible Oils</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
              Featured Products
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Freshly pressed, unrefined, and chemical-free edible oils packed with culinary goodness.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => onSelectCategory(c.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === c.value
                    ? 'bg-forest-900 text-cream-100 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-cream-100 border border-cream-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const currentPack = selectedPacks[product.id] || product.defaultPack;
            const isJustAdded = addedItemEffect === product.id;

            return (
              <div
                key={product.id}
                className="group rounded-3xl bg-white border border-cream-300/80 hover:border-gold-400 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Product Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-cream-100 p-4 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-6 left-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-forest-900 text-gold-300 shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Lab Certificate Link Pill */}
                  {product.labReport && (
                    <button
                      onClick={() => onViewLabReport(product)}
                      className="absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-forest-900 backdrop-blur-xs hover:bg-gold-500 hover:text-forest-950 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                      title="View Lab Analysis Certificate"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lab Tested</span>
                    </button>
                  )}

                  {/* Quick View Button Hover Overlay */}
                  <div className="absolute inset-0 bg-forest-950/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => onQuickView(product)}
                      className="px-4 py-2 rounded-xl bg-white text-forest-900 font-semibold text-xs shadow-md hover:bg-cream-100 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-forest-700" />
                      <span>View Product</span>
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400'
                                : 'fill-stone-200 text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-800 ml-1">
                        {product.rating}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        ({product.reviewsCount} sample reviews)
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>

                    {/* Smoke point & Extraction tag */}
                    <div className="mt-2 text-[10px] text-forest-800 bg-forest-50 p-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span className="truncate">{product.extractionMethod}</span>
                    </div>

                    {/* Pack Size Selector Dropdown / Pills */}
                    <div className="mt-3.5">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Pack Size:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {product.packSizes.slice(0, 4).map((pack) => (
                          <button
                            key={pack}
                            type="button"
                            onClick={() => handlePackChange(product.id, pack)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all text-center truncate cursor-pointer ${
                              currentPack === pack
                                ? 'bg-forest-900 text-cream-100 font-semibold'
                                : 'bg-cream-100 text-stone-600 hover:bg-cream-200 border border-cream-300'
                            }`}
                            title={pack}
                          >
                            {pack}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-3 border-t border-cream-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold font-serif text-forest-950">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-stone-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {product.discountPercent}% Off
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block -mt-0.5">
                          Price marked as sample data
                        </span>
                      </div>
                    </div>

                    {/* Card CTAs */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onQuickView(product)}
                        className="py-2.5 px-3 rounded-xl border border-stone-300 hover:border-forest-800 text-stone-700 hover:text-forest-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Product</span>
                      </button>

                      <button
                        onClick={() => handleAddToCartClick(product)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-forest-900 hover:bg-forest-800 text-cream-100 shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Collection Banner Link */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-stone-500">
            Need customized bulk order tins for restaurants or catering?{' '}
            <a
              href="#contact"
              className="text-forest-800 font-bold underline hover:text-gold-600 transition-colors"
            >
              Contact our Wholesale Desk
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};
