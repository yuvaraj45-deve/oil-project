import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  Check,
  CheckCircle2,
  Star,
  ShieldCheck,
  Droplets,
  Flame,
  FlaskConicalOff,
  Clock,
  Truck,
  Heart,
  ChevronRight,
  Plus,
  Minus,
  Award,
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage, getLocalizedProductName, getLocalizedProductTagline } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/oilData';
import { getFavorites, toggleFavorite } from '../utils/favorites';

interface ProductDetailPageProps {
  product: Product;
  allProducts?: Product[];
  onAddToCart: (product: Product, packSize: string, quantity: number) => void;
  onBuyNow: (product: Product, packSize: string, quantity: number) => void;
  onViewLabReport: (product: Product) => void;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORY_TAMIL_NAMES: Record<string, string> = {
  'sesame-oil': 'நல்லெண்ணெய்',
  'groundnut-oil': 'கடலை எண்ணெய்',
  'coconut-oil': 'தேங்காய் எண்ணெய்',
  'cooking-oil': 'சமையல் எண்ணெய்',
  'sunflower-oil': 'சூரியகாந்தி எண்ணெய்',
  'ricebran-oil': 'தவிட்டு எண்ணெய்',
  'pooja-special': 'பூஜை எண்ணெய்',
  'a2-desi-ghee': 'நாட்டு மாட்டு நெய்',
  'palm-jaggery-special': 'பனை கருப்பட்டி',
  'mustard-oil': 'கடுகு எண்ணெய்',
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: initialProduct,
  allProducts = PRODUCTS_DATA,
  onAddToCart,
  onBuyNow,
  onViewLabReport,
  onNavigate,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const { products: storeProducts, settings, updateProduct, categories: storeCategories } = useStore();
  const effectiveAllProducts = storeProducts && storeProducts.length > 0 ? storeProducts : allProducts;
  // Pick live product from store matching exact id (or matching non-empty slug)
  const product =
    effectiveAllProducts.find((p) => p.id === initialProduct.id) ||
    effectiveAllProducts.find((p) => Boolean(p.slug) && Boolean(initialProduct.slug) && p.slug === initialProduct.slug) ||
    initialProduct;
  const [selectedPack, setSelectedPack] = useState<string>(product.defaultPack || product.packSizes[0] || '1 Litre Bottle');
  const [quantity, setQuantity] = useState<number>(1);

  // Sync selected pack and quantity when product changes
  useEffect(() => {
    setSelectedPack(product.defaultPack || product.packSizes[0] || '1 Litre Bottle');
    setQuantity(1);
  }, [product.id]);
  const [activeTab, setActiveTab] = useState<'benefits' | 'craft' | 'lab'>('benefits');
  const [isAddedAnimation, setIsAddedAnimation] = useState<boolean>(false);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);

  useEffect(() => {
    const handleFavUpdate = () => setFavoritesList(getFavorites());
    window.addEventListener('ssoil_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavUpdate);
  }, []);

  const isFav = favoritesList.includes(product.id) || (product.slug && favoritesList.includes(product.slug));

  const handleToggleFav = () => {
    toggleFavorite(product.id);
    setFavoritesList(getFavorites());
  };

  // Helper to calculate price by pack size
  const getPackPrice = (basePrice: number, pack: string): number => {
    if (pack.includes('500 ml') || pack.includes('500ml') || pack.includes('500g')) {
      return Math.round(basePrice * 0.55);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can') || pack.includes('2 Litre Bottle')) {
      return Math.round(basePrice * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L') || pack.includes('5 Litre Can') || pack.includes('5 Litre Tin')) {
      return Math.round(basePrice * 4.8);
    }
    if (pack.includes('15 Litre') || pack.includes('15L') || pack.includes('15 Litre Tin')) {
      return Math.round(basePrice * 14);
    }
    if (pack.includes('1 kg') || pack.includes('1kg')) {
      return Math.round(basePrice * 1.9);
    }
    return basePrice;
  };

  const getPackOriginalPrice = (baseOrigPrice: number, pack: string): number => {
    if (pack.includes('500 ml') || pack.includes('500ml') || pack.includes('500g')) {
      return Math.round(baseOrigPrice * 0.55);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can') || pack.includes('2 Litre Bottle')) {
      return Math.round(baseOrigPrice * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L') || pack.includes('5 Litre Can') || pack.includes('5 Litre Tin')) {
      return Math.round(baseOrigPrice * 4.8);
    }
    if (pack.includes('15 Litre') || pack.includes('15L') || pack.includes('15 Litre Tin')) {
      return Math.round(baseOrigPrice * 14);
    }
    return baseOrigPrice;
  };

  const unitPrice = getPackPrice(product.price, selectedPack);
  const unitOriginalPrice = getPackOriginalPrice(product.originalPrice || product.price, selectedPack);
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = unitOriginalPrice * quantity;
  const discountPercent =
    unitOriginalPrice > unitPrice
      ? Math.round(((unitOriginalPrice - unitPrice) / unitOriginalPrice) * 100)
      : product.discountPercent || 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedPack, quantity);
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1600);
  };

  // Name and tagline localization
  const productName = getLocalizedProductName(product, language);
  const productTagline = getLocalizedProductTagline(product, language);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-36 sm:pb-32">
      
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-forest-900 text-stone-700 hover:text-forest-950 font-bold transition-all text-xs cursor-pointer bg-stone-50 hover:bg-white shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முந்தைய பக்கம்' : 'Back to Store'}</span>
            </button>

            <nav className="flex items-center gap-2 text-stone-500 whitespace-nowrap">
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-forest-950 font-medium transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'முகப்பு' : 'Home'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <button
                onClick={() => onNavigate('/shop')}
                className="hover:text-forest-950 font-medium transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'எண்ணெய்கள்' : 'Shop'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <span className="text-stone-400 capitalize">
                {language === 'ta' && (CATEGORY_TAMIL_NAMES[product.category] || CATEGORY_TAMIL_NAMES[product.category.toLowerCase()])
                  ? (CATEGORY_TAMIL_NAMES[product.category] || CATEGORY_TAMIL_NAMES[product.category.toLowerCase()])
                  : (product.categoryName || product.category)}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <span className="font-bold text-forest-950 truncate max-w-[200px] sm:max-w-xs">{productName}</span>
            </nav>
          </div>

        </div>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ======================================================== */}
          {/* LEFT: Product Image & Certified Trust Seals               */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Main Photo Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md relative overflow-hidden group">
              
              {/* Product Image */}
              <div className="aspect-square w-full max-w-md mx-auto flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={productName}
                  className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                />
              </div>

              {/* Organic Origin Seal */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-serif italic">Mara Chekku Wood Mill Production • Since 1966</span>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pure Native Grade</span>
                </span>
              </div>
            </div>

            {/* 4 Organic Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 text-center space-y-1 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-[11px] text-stone-900">Agmark Grade I</h5>
                <p className="text-[10px] text-stone-500">FSSAI Certified</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 text-center space-y-1 shadow-2xs">
                <Droplets className="w-5 h-5 text-amber-600 mx-auto" />
                <h5 className="font-bold text-[11px] text-stone-900">Vaagai Chekku</h5>
                <p className="text-[10px] text-stone-500">&lt; 42°C Cold Pressed</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 text-center space-y-1 shadow-2xs">
                <FlaskConicalOff className="w-5 h-5 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-[11px] text-stone-900">Zero Chemical</h5>
                <p className="text-[10px] text-stone-500">No Solvents / Hexane</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 text-center space-y-1 shadow-2xs">
                <Truck className="w-5 h-5 text-forest-800 mx-auto" />
                <h5 className="font-bold text-[11px] text-stone-900">Express Delivery</h5>
                <p className="text-[10px] text-stone-500">Across Tamil Nadu</p>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: Product Details, Pricing, Pack Sizes & Actions     */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Category Pill & Title */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-stone-100 text-stone-700 border border-stone-200 inline-block">
                  {language === 'ta' && (CATEGORY_TAMIL_NAMES[product.category] || CATEGORY_TAMIL_NAMES[product.category.toLowerCase()])
                    ? (CATEGORY_TAMIL_NAMES[product.category] || CATEGORY_TAMIL_NAMES[product.category.toLowerCase()])
                    : (product.categoryName || product.category)}
                </span>

                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isFav
                      ? 'bg-red-50 text-red-600 border-red-200 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'
                  }`}
                  title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
                  <span>
                    {isFav
                      ? (language === 'ta' ? 'விருப்பத்தில் உள்ளது' : 'Saved in Favorites')
                      : (language === 'ta' ? 'விருப்பத்தில் சேர்' : 'Add to Favorites')}
                  </span>
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-forest-950 tracking-tight leading-tight">
                {productName}
              </h1>

              <p className="text-stone-600 text-base sm:text-lg mt-2 font-normal leading-relaxed">
                {productTagline}
              </p>

              {/* Ratings & Stock */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-stone-900">{product.rating || 4.9}</span>
                  <span className="text-stone-400">({product.reviewsCount || 289} {language === 'ta' ? 'மதிப்புரைகள்' : 'reviews'})</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'ta' ? 'கையிருப்பு உள்ளது - புதிய ஆலை பேட்ச்' : 'In Stock - Fresh Mill Batch'}</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-serif font-black text-forest-950">
                  ₹{totalPrice}
                </span>
                <span className="text-lg text-stone-400 line-through">
                  MRP ₹{totalOriginalPrice}
                </span>
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9E2B25] text-white">
                    {discountPercent}% {language === 'ta' ? 'தள்ளுபடி' : 'OFF'}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ta' ? 'வரிகள் உள்ளடக்கம் • ₹499 மேல் இலவச டெலிவரி' : 'Inclusive of all taxes • Free express shipping above ₹499'}</span>
              </p>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider">
                  {language === 'ta' ? 'அளவு தேர்வு (Pack Size):' : 'Select Pack Size:'}
                </span>
                <span className="text-amber-800 font-bold">{selectedPack}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {product.packSizes.map((pack) => {
                  const isSelected = selectedPack === pack;
                  const priceForPack = getPackPrice(product.price, pack);
                  return (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-forest-950 text-white border-forest-950 shadow-md ring-2 ring-forest-950/20'
                          : 'bg-white text-stone-800 border-stone-200 hover:border-forest-900/60 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-xs font-bold truncate block">{pack}</span>
                      <span className={`text-xs mt-1 font-serif font-black ${isSelected ? 'text-gold-300' : 'text-stone-900'}`}>
                        ₹{priceForPack}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart / Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center rounded-2xl border border-stone-300 bg-white p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCartClick}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isAddedAnimation
                      ? 'bg-emerald-700 text-white scale-[1.02]'
                      : 'bg-forest-950 hover:bg-forest-900 text-white hover:shadow-lg'
                  }`}
                >
                  {isAddedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-gold-300" />
                      <span>{language === 'ta' ? 'கூடையில் சேர்க்கப்பட்டது! ✓' : 'Added to Cart! ✓'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold-400" />
                      <span>{language === 'ta' ? 'கூடையில் சேர்க்கவும்' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. Deep Story Tabs: Benefits, Craft & Lab Specifications */}
        {/* ======================================================== */}
        <div className="mt-16 sm:mt-20 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'benefits'
                  ? 'bg-forest-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'ta' ? 'ஆரோக்கிய நன்மைகள்' : 'Health & Cooking Benefits'}
            </button>

            <button
              onClick={() => setActiveTab('craft')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'craft'
                  ? 'bg-forest-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'ta' ? 'மரச்செக்கு செய்முறை' : 'Artisanal Wood-Pressing Craft'}
            </button>
          </div>

          {/* Tab 1: Benefits */}
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h4 className="text-xl font-serif font-black text-forest-950">
                  {language === 'ta' ? 'இயற்கை மரச்செக்கு எண்ணெயின் நன்மைகள்' : 'Why Pure Mara Chekku Makes a Difference'}
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {product.description || 'Extracted traditionally using pure Vaagai wood mortars, preserving volatile aromatic compounds and heat-sensitive antioxidants.'}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">Zero Trans Fats & Zero Cholesterol</h5>
                      <p className="text-xs text-stone-500">Unrefined raw fats that nourish the heart and support healthy lipid profiles.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">Naturally Rich in Vitamin E Tocopherols</h5>
                      <p className="text-xs text-stone-500">Because crushing temperature stays below 42°C, living nutrients stay intact.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-stone-900">High Smoke Point for Authentic Cooking</h5>
                      <p className="text-xs text-stone-500">{product.smokePoint} smoke tolerance — ideal for deep frying, tadka tempering & gravies.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Culinary Recommendation Card */}
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-stone-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ta' ? 'சமையல் பரிந்துரை' : 'Culinary Pairing Guide'}</span>
                </div>
                <h5 className="font-serif font-black text-lg text-forest-950">
                  {language === 'ta' ? 'சிறந்த பாரம்பரிய உணவு சேர்க்கை' : 'Best For Traditional Indian Kitchens'}
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {product.bestForDish || 'Perfect for traditional South Indian sambar tadka, vatha kuzhambu, idli podi pairing, and everyday vegetable stir-fries.'}
                </p>
                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Smoke Point: {product.smokePoint}</span>
                  <span>Extraction: &lt; 42°C Cold</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Craft */}
          {activeTab === 'craft' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-mono text-xs font-bold text-amber-700 block">Step 01</span>
                <h5 className="font-serif font-black text-base text-forest-950">Vaagai Wood Mortar</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Crafted from seasoned Albizia Lebbeck (Vaagai) wood which naturally absorbs heat during crushing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-mono text-xs font-bold text-amber-700 block">Step 02</span>
                <h5 className="font-serif font-black text-base text-forest-950">12–14 RPM Gentle Press</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Ultra-slow rotational speed prevents frictional overheating and protein denaturing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="font-mono text-xs font-bold text-amber-700 block">Step 03</span>
                <h5 className="font-serif font-black text-base text-forest-950">5-Day Solar Settling</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Resting in glass vessels under warm sunlight. Impurities settle by natural gravity without chemical bleaching.
                </p>
              </div>
            </div>
          )}

        </div>

        </div>
    </div>
  );
};
