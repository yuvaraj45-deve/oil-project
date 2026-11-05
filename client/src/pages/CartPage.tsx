import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Heart,
  Package,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Droplets,
  AlertCircle,
  Tag,
  X,
} from 'lucide-react';
import { CartItem, PlacedOrder, Product } from '../types';
import { useLanguage, getLocalizedProductName } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { AVAILABLE_COUPONS } from './OffersPage';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, packSize: string, delta: number) => void;
  onRemoveItem: (productId: string, packSize: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  orders: PlacedOrder[];
  onCancelOrder: (orderId: string, reason: string, note?: string) => void;
  onStartCancelOrder: (order: PlacedOrder) => void;
  onAddToCart: (product: Product, packSize: string, quantity?: number) => void;
  onNavigate: (path: string) => void;
  initialTab?: 'cart' | 'favorites' | 'orders';
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  orders = [],
  onCancelOrder,
  onStartCancelOrder,
  onAddToCart,
  onNavigate,
  initialTab = 'cart',
}) => {
  const { language, t } = useLanguage();
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'cart' | 'favorites' | 'orders'>(initialTab);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);
  const [selectedPackForFav, setSelectedPackForFav] = useState<Record<string, string>>({});
  const [cancelingOrder, setCancelingOrder] = useState<PlacedOrder | null>(null);

  // Sync favorites when window storage changes
  useEffect(() => {
    const handleFavUpdate = () => {
      setFavoritesList(getFavorites());
    };
    window.addEventListener('ssoil_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavUpdate);
  }, []);

  // Coupon handling state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCouponData, setAppliedCouponData] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    minOrder: number;
    maxDiscount?: number;
    title: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('ssoil_applied_coupon');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  useEffect(() => {
    const handleCouponUpdate = () => {
      try {
        const saved = localStorage.getItem('ssoil_applied_coupon');
        if (saved) setAppliedCouponData(JSON.parse(saved));
        else setAppliedCouponData(null);
      } catch {}
    };
    window.addEventListener('ssoil_coupon_updated', handleCouponUpdate);
    return () => window.removeEventListener('ssoil_coupon_updated', handleCouponUpdate);
  }, []);

  const handleApplyCouponCode = (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!targetCode) {
      setCouponError(language === 'ta' ? 'கூப்பன் குறியீட்டை உள்ளிடவும்' : 'Please enter a coupon code');
      return;
    }
    const matched = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === targetCode);
    if (!matched) {
      setCouponError(language === 'ta' ? 'தவறான கூப்பன் குறியீடு' : 'Invalid coupon code');
      return;
    }
    const payload = {
      code: matched.code,
      discountType: matched.discountType,
      discountValue: matched.discountValue,
      minOrder: matched.minOrder,
      maxDiscount: matched.maxDiscount,
      title: matched.title,
    };
    try {
      localStorage.setItem('ssoil_applied_coupon', JSON.stringify(payload));
      setAppliedCouponData(payload);
      setCouponInput('');
      setCouponError(null);
      window.dispatchEvent(new Event('ssoil_coupon_updated'));
    } catch {}
  };

  const handleRemoveCoupon = () => {
    try {
      localStorage.removeItem('ssoil_applied_coupon');
      setAppliedCouponData(null);
      setCouponError(null);
      window.dispatchEvent(new Event('ssoil_coupon_updated'));
    } catch {}
  };

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeDelCoupon = appliedCouponData?.code === 'FREEDEL';
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0 || isFreeDelCoupon;
  const shippingFee = isFreeShipping ? 0 : 50;

  // Coupon discount calculation
  let couponDiscount = 0;
  let isCouponEligible = true;
  let minOrderShortage = 0;

  if (appliedCouponData && subtotal > 0) {
    if (subtotal >= appliedCouponData.minOrder) {
      if (appliedCouponData.discountType === 'percentage') {
        const disc = Math.round((subtotal * appliedCouponData.discountValue) / 100);
        couponDiscount = appliedCouponData.maxDiscount ? Math.min(disc, appliedCouponData.maxDiscount) : disc;
      } else if (appliedCouponData.discountType === 'fixed') {
        couponDiscount = Math.min(subtotal, appliedCouponData.discountValue);
      }
    } else {
      isCouponEligible = false;
      minOrderShortage = appliedCouponData.minOrder - subtotal;
    }
  }

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  // Favorite products list
  const favoriteProducts = products.filter(
    (p) => favoritesList.includes(p.id) || (p.slug && favoritesList.includes(p.slug))
  );

  const handleToggleFav = (productId: string) => {
    toggleFavorite(productId);
    setFavoritesList(getFavorites());
  };

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
    return basePrice;
  };

  const formatPack = (pack: string): string => {
    return pack
      .replace('Bottle', '')
      .replace('Can', '')
      .replace('Tin', '')
      .trim();
  };

  const handleAddFavoriteToCart = (product: Product) => {
    const chosenPack =
      selectedPackForFav[product.id] ||
      (product.packSizes && product.packSizes[0]) ||
      product.defaultPack ||
      '1 Litre Bottle';

    if (onAddToCart) {
      onAddToCart(product, chosenPack, 1);
    }
    setActiveTab('cart');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="bg-white border-b border-stone-200/60 sticky top-[69px] z-20">
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
                {language === 'ta' ? 'அங்காடி' : 'Shop'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <span className="font-bold text-stone-900">
                {language === 'ta' ? 'கார்ட்' : 'Shopping Cart'}
              </span>
            </nav>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-emerald-800 font-medium text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ta' ? '100% தூய மரச்செக்கு உத்திரவாதம்' : '100% Vaagai Chekku Guarantee'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Page Title & Segmented Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
              {language === 'ta' ? 'உங்கள் கூடை & ஆர்டர்கள்' : 'Your Cart & Orders'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === 'ta'
                ? 'நேரடி மரச்செக்கு எண்ணெய்கள் • ரசாயன கலப்பற்ற தூய்மை • உங்கள் வீட்டு வாசலில்'
                : 'Direct from Mara Chekku • Unrefined & Cold Extracted • Delivered to Your Doorstep'}
            </p>
          </div>

          {/* Segmented Tabs: Cart | Favorites | Orders */}
          <div className="inline-flex p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80 self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-forest-950 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'கார்ட்' : 'Cart'}</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-gold-400 text-forest-950">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-forest-950 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-gold-300 text-gold-300' : 'text-stone-500'}`} />
              <span>{language === 'ta' ? 'விருப்பங்கள்' : 'Favorites'}</span>
              {favoriteProducts.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white">
                  {favoriteProducts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-forest-950 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}</span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: CART VIEW */}
        {activeTab === 'cart' && (
          <div>
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-16 text-center max-w-2xl mx-auto shadow-xs space-y-5 my-8">
                <div className="w-20 h-20 rounded-full bg-cream-100 text-stone-400 flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingBag className="w-10 h-10 text-stone-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                    {language === 'ta' ? 'உங்கள் கார்ட் காலியாக உள்ளது' : 'Your Cart is Empty'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                    {language === 'ta'
                      ? 'பாரம்பரிய வாகை மரச்செக்கில் பிழியப்பட்ட சுத்தமான கடலை, நல்லெண்ணெய் மற்றும் தேங்காய் எண்ணெய்களை இப்போது ஆர்டர் செய்யுங்கள்.'
                      : 'Explore our farm-fresh wood-pressed oils extracted cold under 38°C in Vaagai mortars with zero artificial heat or solvents.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Droplets className="w-4 h-4 text-gold-400" />
                    <span>{language === 'ta' ? 'எண்ணெய் வகைகளை வாங்கவும்' : 'Shop Cold-Pressed Oils'}</span>
                  </button>

                  {favoriteProducts.length > 0 && (
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 hover:border-forest-950 text-stone-800 hover:bg-stone-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      <span>{language === 'ta' ? 'விருப்பப் பட்டியலைப் பார்' : 'View Saved Favorites'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Cols: Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between pb-2 text-xs font-bold text-stone-500">
                    <span>{items.length} {items.length === 1 ? 'Variety' : 'Varieties'} in Cart</span>
                    <button
                      onClick={onClearCart}
                      className="text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'கார்ட்டை காலிசெய்' : 'Clear All'}</span>
                    </button>
                  </div>

                  {items.map((item) => {
                    const itemSubtotal = item.price * item.quantity;
                    const isItemFav = favoritesList.includes(item.product.id) || (item.product.slug && favoritesList.includes(item.product.slug));

                    return (
                      <div
                        key={`${item.product.id}-${item.packSize}`}
                        className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs hover:border-gold-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                      >
                        {/* Product Image (Strict Fixed Dimensions so it never overflows) */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 min-w-[80px] max-w-[96px] h-[80px] sm:h-[96px] rounded-xl bg-amber-50/40 p-2 border border-stone-100 flex items-center justify-center shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-serif font-bold text-sm sm:text-base text-forest-950">
                                {getLocalizedProductName(item.product, language)}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold">
                                  {item.packSize}
                                </span>
                                <span className="text-xs text-stone-500 font-medium">
                                  ₹{item.price} / unit
                                </span>
                              </div>
                            </div>

                            {/* Item Actions: Fav & Remove */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleToggleFav(item.product.id)}
                                className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Save to Favorites"
                              >
                                <Heart className={`w-4 h-4 ${isItemFav ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                              <button
                                onClick={() => onRemoveItem(item.product.id, item.packSize)}
                                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Remove from cart"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price & Quantity Bar */}
                          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-stone-100">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.packSize, -1)}
                                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs font-bold"
                                title="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-forest-950">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.packSize, 1)}
                                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs font-bold"
                                title="Increase"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <span className="text-[10px] text-stone-400 block uppercase font-bold">Subtotal</span>
                              <span className="font-serif font-black text-base sm:text-lg text-forest-950">
                                ₹{itemSubtotal}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}

                  {/* Free Delivery Banner */}
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="text-xs">
                      {subtotal >= freeShippingThreshold ? (
                        <span className="font-bold text-emerald-900">
                          {language === 'ta'
                            ? ' வாழ்த்துக்கள்! உங்கள் ஆர்டருக்கு இலவச விரைவு டெலிவரி உண்டு.'
                            : '🎉 You unlocked FREE Express Delivery on this order!'}
                        </span>
                      ) : (
                        <span className="text-emerald-800">
                          {language === 'ta'
                            ? `இன்னும் ₹${freeShippingThreshold - subtotal} சேர்த்தால் இலவச டெலிவரி கிடைக்கும்!`
                            : `Add ₹${freeShippingThreshold - subtotal} more for FREE Express Shipping!`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Order Summary Sidebar */}
                <div className="lg:col-span-4 sticky top-[130px] space-y-4">
                  <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-5">
                    <h3 className="font-serif font-black text-lg text-forest-950 border-b border-stone-100 pb-3">
                      {language === 'ta' ? 'ஆர்டர் சுருக்கம்' : 'Order Summary'}
                    </h3>

                    {/* Coupon Code Section */}
                    <div className="space-y-2 pt-2 border-b border-stone-100 pb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-700 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-700" />
                          <span>{language === 'ta' ? 'தள்ளுபடி கூப்பன்' : 'Discount Coupon'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigate('/offers')}
                          className="text-[11px] font-bold text-amber-800 hover:text-forest-950 transition-colors cursor-pointer"
                        >
                          {language === 'ta' ? 'அனைத்து கூப்பன்கள் →' : 'View Offers →'}
                        </button>
                      </div>

                      {appliedCouponData ? (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                                {appliedCouponData.code}
                              </span>
                              <span className="text-xs font-bold text-emerald-900">
                                {appliedCouponData.discountType === 'percentage'
                                  ? `${appliedCouponData.discountValue}% OFF`
                                  : appliedCouponData.discountType === 'fixed'
                                  ? `₹${appliedCouponData.discountValue} OFF`
                                  : 'FREE DELIVERY'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-stone-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Remove coupon"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {!isCouponEligible && (
                            <p className="text-[10px] text-amber-800 font-semibold bg-amber-100/60 p-1.5 rounded-lg">
                              {language === 'ta'
                                ? `இன்னும் ₹${minOrderShortage} சேர்த்தால் இந்த கூப்பன் தள்ளுபடி கிடைக்கும்.`
                                : `Add ₹${minOrderShortage} more to activate this coupon! (Min order: ₹${appliedCouponData.minOrder})`}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponError(null);
                              }}
                              placeholder={language === 'ta' ? 'கூப்பன் குறியீடு (எ.கா. FIRST10)' : 'Coupon code (e.g. SAVE15)'}
                              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:outline-none focus:border-forest-900 uppercase bg-stone-50"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyCouponCode()}
                              className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              {language === 'ta' ? 'சேர்' : 'Apply'}
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-[10px] text-red-600 font-bold">{couponError}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between text-stone-600">
                        <span>{language === 'ta' ? 'பொருட்களின் மதிப்பு' : 'Subtotal'}</span>
                        <span className="font-bold text-stone-900">₹{subtotal}</span>
                      </div>

                      {couponDiscount > 0 && (
                        <div className="flex items-center justify-between text-emerald-700 font-bold">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{language === 'ta' ? 'கூப்பன் தள்ளுபடி' : 'Coupon Discount'}</span>
                          </span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-stone-600">
                        <span>{language === 'ta' ? 'டெலிவரி கட்டணம்' : 'Delivery Fee'}</span>
                        <span className="font-bold">
                          {shippingFee === 0 ? (
                            <span className="text-emerald-700 uppercase font-black">{language === 'ta' ? 'இலவசம்' : 'FREE'}</span>
                          ) : (
                            <span>₹{shippingFee}</span>
                          )}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-base font-serif">
                        <span className="font-black text-forest-950">{language === 'ta' ? 'மொத்த தொகை' : 'Grand Total'}</span>
                        <span className="font-black text-xl text-forest-950 text-gold-600">₹{grandTotal}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={onProceedToCheckout}
                      className="w-full py-4 px-6 rounded-2xl bg-[#1e7e34] hover:bg-[#18682a] text-white font-black text-sm tracking-wide transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      <span>{language === 'ta' ? 'ஆர்டரை உறுதிசெய்க' : 'Proceed to Checkout'}</span>
                      <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Trust Guarantees */}
                    <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>100% Unadulterated Vaagai Wood Mortar Pressed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Agmark Grade I & FSSAI Certified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Zero Chemical Extraction & Preservatives</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: FAVORITES VIEW (Full Spacious Layout - Never Cut Off!) */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-16 text-center max-w-2xl mx-auto shadow-xs space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest-950">
                    {language === 'ta' ? 'விருப்பப் பட்டியல் காலியாக உள்ளது' : 'No Favorites Saved Yet'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    {language === 'ta'
                      ? 'நீங்கள் விரும்பும் தயாரிப்புகளில் இதயக் குறியீட்டை (Heart) அழுத்தி இங்கே சேமித்து வைக்கலாம்.'
                      : 'Click the heart icon on any mara chekku oil to save it here for convenient quick ordering.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="px-6 py-2.5 rounded-xl bg-forest-950 text-gold-300 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>{language === 'ta' ? 'தயாரிப்புகளைப் பார்க்க' : 'Browse All Oils'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteProducts.map((product) => {
                  const chosenPack =
                    selectedPackForFav[product.id] ||
                    (product.packSizes && product.packSizes[0]) ||
                    product.defaultPack ||
                    '1 Litre Bottle';
                  const displayPrice = getPackPrice(product.price, chosenPack);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs hover:border-gold-500/60 transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="flex gap-4">
                        {/* Bounded Fixed Image */}
                        <div className="w-24 h-24 min-w-[96px] max-w-[96px] h-[96px] rounded-xl bg-amber-50/40 p-2 border border-stone-100 shrink-0 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif font-bold text-sm text-forest-950 truncate">
                              {getLocalizedProductName(product, language)}
                            </h4>
                            <button
                              onClick={() => handleToggleFav(product.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <Heart className="w-4 h-4 fill-red-500" />
                            </button>
                          </div>

                          <div className="font-serif font-black text-base text-forest-950 mt-1">
                            ₹{displayPrice}
                          </div>

                          {/* Pack Size Pills */}
                          {product.packSizes && product.packSizes.length > 1 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.packSizes.map((ps) => {
                                const isSelected = chosenPack === ps;
                                return (
                                  <button
                                    key={ps}
                                    onClick={() =>
                                      setSelectedPackForFav((prev) => ({
                                        ...prev,
                                        [product.id]: ps,
                                      }))
                                    }
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-forest-950 text-gold-300'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                                  >
                                    {formatPack(ps)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Move to Cart Action */}
                      <button
                        onClick={() => handleAddFavoriteToCart(product)}
                        className="w-full py-2.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                        <span>{language === 'ta' ? 'கார்ட்டில் சேர்க்கவும்' : 'Move to Cart'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS VIEW (Genuine Customer Orders Only) */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-16 text-center max-w-2xl mx-auto shadow-xs space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-cream-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-stone-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest-950">
                    {language === 'ta' ? 'இன்னும் ஆர்டர்கள் எதுவும் செய்யப்படவில்லை' : 'No Orders Placed Yet'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    {language === 'ta'
                      ? 'நீங்கள் செய்யும் புதிய ஆர்டர்கள் அனைத்தும் இங்கு உடனுக்குடன் நேரடி டெலிவரி கண்காணிப்புடன் காட்டப்படும்.'
                      : 'Orders you place will appear here with live tracking, invoice downloads, and doorstep status updates.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="px-6 py-2.5 rounded-xl bg-forest-950 text-gold-300 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>{language === 'ta' ? 'ஆர்டர் செய்யத் தொடங்குங்கள்' : 'Start Shopping'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {orders.map((order) => {
                  const isShipped = order.orderStatus === 'SHIPPED';
                  const isDelivered = order.orderStatus === 'DELIVERED';
                  const isCancelled = order.orderStatus === 'CANCELLED';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 text-xs">
                        <div>
                          <span className="font-serif font-black text-sm text-forest-950">
                            {order.orderNumber}
                          </span>
                          <span className="text-stone-400 ml-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              isCancelled
                                ? 'bg-red-100 text-red-800'
                                : isDelivered
                                ? 'bg-emerald-100 text-emerald-800'
                                : isShipped
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-stone-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-stone-900">{item.productName}</span>
                              <span className="text-stone-500 ml-2">({item.packSize}) × {item.quantity}</span>
                            </div>
                            <span className="font-bold text-stone-900">₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-stone-500">Total: </span>
                          <span className="font-serif font-black text-sm text-forest-950">₹{order.totalAmount}</span>
                          <span className="text-stone-400 ml-2">({order.paymentMethod})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate(`/track/${order.orderNumber}`)}
                            className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-forest-900 text-stone-700 hover:text-forest-950 font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Track Order</span>
                          </button>

                          {!isCancelled && !isDelivered && (
                            <button
                              onClick={() => {
                                if (onStartCancelOrder) onStartCancelOrder(order);
                                else setCancelingOrder(order);
                              }}
                              className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Cancel Order Modal */}
      {cancelingOrder && (
        <CancelOrderModal
          order={cancelingOrder}
          isOpen={true}
          onClose={() => setCancelingOrder(null)}
          onConfirmCancel={(orderId, reason, note) => {
            if (onCancelOrder) onCancelOrder(orderId, reason, note);
            setCancelingOrder(null);
          }}
        />
      )}
    </div>
  );
};
