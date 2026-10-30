import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { CartItem, PlacedOrder, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { CancelOrderModal } from './CancelOrderModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, packSize: string, delta: number) => void;
  onRemoveItem: (productId: string, packSize: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  // Extended for Orders & Favorites tabs
  orders?: PlacedOrder[];
  onCancelOrder?: (orderId: string, reason: string, note?: string) => void;
  onStartCancelOrder?: (order: PlacedOrder) => void;
  onAddToCart?: (product: Product, packSize: string, quantity?: number) => void;
  initialTab?: 'cart' | 'favorites' | 'orders';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  orders = [],
  onCancelOrder,
  onStartCancelOrder,
  onAddToCart,
  initialTab = 'cart',
}) => {
  const { language, t } = useLanguage();
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'cart' | 'favorites' | 'orders'>(initialTab);
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);
  const [selectedPackForFav, setSelectedPackForFav] = useState<Record<string, string>>({});
  const [cancellingOrder, setCancellingOrder] = useState<PlacedOrder | null>(null);

  // Sync favorites when drawer opens or updates
  useEffect(() => {
    if (isOpen) {
      setFavoritesList(getFavorites());
      if (initialTab) setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleFavChange = (e: any) => {
      setFavoritesList(e.detail || getFavorites());
    };
    window.addEventListener('ssoil_favorites_updated', handleFavChange);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavChange);
  }, []);

  // Lock background body scroll completely when Cart Drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const formatPack = (pack: string) => {
    if (language !== 'ta') return pack;
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

  // Resolve favorite products from current store catalog
  const favoriteProducts = products.filter((p) =>
    favoritesList.includes(p.id) || (p.slug && favoritesList.includes(p.slug))
  );

  const handleToggleFav = (productId: string) => {
    toggleFavorite(productId);
    setFavoritesList(getFavorites());
  };

  const getPackPrice = (basePrice: number, pack: string) => {
    if (pack.includes('500 ml') || pack.includes('500g') || pack.includes('500ml')) {
      return Math.round(basePrice * 0.55);
    }
    if (pack.includes('250 ml') || pack.includes('250g') || pack.includes('250ml')) {
      return Math.round(basePrice * 0.32);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 kg')) {
      return Math.round(basePrice * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L')) {
      return Math.round(basePrice * 4.75);
    }
    if (pack.includes('15 Litre') || pack.includes('15L')) {
      return Math.round(basePrice * 13.8);
    }
    return basePrice;
  };

  const handleAddFavoriteToCart = (product: Product) => {
    const chosenPack =
      selectedPackForFav[product.id] ||
      (product.packSizes && product.packSizes[0]) ||
      product.defaultPack ||
      '1 Litre Bottle';
    if (onAddToCart) {
      onAddToCart(product, chosenPack, 1);
    } else {
      onUpdateQuantity(product.id, chosenPack, 1);
    }
    setActiveTab('cart');
  };

  const totalCartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 h-full">
          <div
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full max-h-screen overflow-hidden"
            style={{ overscrollBehavior: 'contain' }}
          >
            
            {/* Top Header */}
            <div className="p-4 sm:p-5 border-b border-cream-300/80 bg-cream-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-forest-900 text-gold-400 flex items-center justify-center shadow-xs">
                  {activeTab === 'cart' && <ShoppingBag className="w-4 h-4" />}
                  {activeTab === 'favorites' && <Heart className="w-4 h-4 fill-gold-400 text-gold-400" />}
                  {activeTab === 'orders' && <Package className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-950">
                    {activeTab === 'cart' && (language === 'ta' ? 'ஷாப்பிங் கார்ட்' : 'Shopping Cart')}
                    {activeTab === 'favorites' && (language === 'ta' ? 'விருப்பப் பட்டியல்' : 'My Favorites')}
                    {activeTab === 'orders' && (language === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders')}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {activeTab === 'cart' && `${totalCartCount} ${language === 'ta' ? 'பொருட்கள்' : totalCartCount === 1 ? 'item' : 'items'}`}
                    {activeTab === 'favorites' && `${favoriteProducts.length} ${language === 'ta' ? 'விருப்பங்கள்' : 'saved items'}`}
                    {activeTab === 'orders' && `${orders.length} ${language === 'ta' ? 'ஆர்டர்கள்' : 'orders placed'}`}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Top Navigation Tabs */}
            <div className="bg-white border-b border-stone-200 px-3 py-2 flex items-center gap-1.5 shadow-2xs">
              <button
                onClick={() => setActiveTab('cart')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'cart'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'கார்ட்' : 'Cart'}</span>
                {totalCartCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === 'cart'
                        ? 'bg-gold-400 text-forest-950'
                        : 'bg-forest-900 text-white'
                    }`}
                  >
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-gold-400 text-gold-400' : 'text-stone-500'}`} />
                <span>{language === 'ta' ? 'விருப்பங்கள்' : 'Favorites'}</span>
                {favoriteProducts.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === 'favorites'
                        ? 'bg-gold-400 text-forest-950'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {favoriteProducts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}</span>
                {orders.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === 'orders'
                        ? 'bg-gold-400 text-forest-950'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {orders.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: CART VIEW */}
            {activeTab === 'cart' && (
              <>
                {/* Free Shipping Meter */}
                <div className="bg-forest-900 text-cream-100 px-5 py-3 text-xs">
                  <div className="flex items-center justify-between mb-1.5 font-medium">
                    <span>
                      {isFreeShipping ? (
                        <span className="text-gold-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {t('cart.freeShippingReached')}
                        </span>
                      ) : (
                        <span>
                          {t('cart.addMoreForFree')} ₹{remainingForFreeShipping} {t('cart.moreForFree')}
                        </span>
                      )}
                    </span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-forest-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div
                  className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain"
                  style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                >
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                      <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-stone-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-stone-700">
                          {t('cart.empty')}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1 max-w-xs">
                          {language === 'ta'
                            ? 'உங்கள் கார்ட்டில் இன்னும் பொருட்கள் சேர்க்கப்படவில்லை. விருப்பப் பட்டியலை அல்லது எங்கள் தயாரிப்புகளைப் பார்வையிடவும்.'
                            : 'Explore our authentic mara chekku cold-pressed oils or view your saved favorites.'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full max-w-xs pt-2">
                        <button
                          onClick={() => setActiveTab('favorites')}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>{language === 'ta' ? 'விருப்பப் பட்டியலைப் பார்' : 'View Saved Favorites'}</span>
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full py-2.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {language === 'ta' ? 'எண்ணெய் வகைகளை வாங்கவும்' : 'Shop Cold-Pressed Oils'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    items.map((item) => {
                      const isItemFav = favoritesList.includes(item.product.id) || (item.product.slug && favoritesList.includes(item.product.slug));
                      return (
                        <div
                          key={`${item.product.id}-${item.packSize}`}
                          className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200/90 bg-white hover:border-gold-500/50 transition-all shadow-2xs group"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-18 h-18 object-contain rounded-xl bg-cream-50 p-1.5 shrink-0 border border-stone-100"
                          />

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="font-serif font-bold text-xs text-forest-950 truncate">
                                  {language === 'ta' && item.product.tamilName
                                    ? item.product.tamilName
                                    : item.product.name}
                                </h4>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleToggleFav(item.product.id)}
                                    className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title={isItemFav ? 'In Favorites' : 'Add to Favorites'}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${isItemFav ? 'fill-red-500 text-red-500' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => onRemoveItem(item.product.id, item.packSize)}
                                    className="p-1 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-[11px] text-stone-500 mt-0.5">
                                {language === 'ta' ? 'அளவு:' : 'Pack:'}{' '}
                                <span className="font-semibold text-stone-700">{formatPack(item.packSize)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.packSize, -1)}
                                  className="p-1 hover:bg-cream-100 text-stone-600 rounded-l-lg transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2.5 text-xs font-bold text-stone-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.packSize, 1)}
                                  className="p-1 hover:bg-cream-100 text-stone-600 rounded-r-lg transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <span className="text-sm font-serif font-bold text-forest-900">
                                  ₹{item.price * item.quantity}
                                </span>
                                <span className="block text-[10px] text-stone-400">
                                  (₹{item.price} {language === 'ta' ? 'ஒவ்வொன்றும்' : 'each'})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Checkout Summary */}
                {items.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-cream-300 bg-cream-100/90 space-y-3.5">
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>{t('cart.subtotal')}:</span>
                        <span className="font-semibold text-stone-800">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('cart.delivery')}:</span>
                        <span className="font-semibold text-emerald-700">
                          {isFreeShipping ? t('cart.free') : '₹50'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-forest-950 pt-2 border-t border-cream-300">
                        <span>{language === 'ta' ? 'செலுத்த வேண்டிய தொகை:' : 'Total Payable:'}</span>
                        <span className="font-serif text-lg text-forest-900">
                          ₹{subtotal + (isFreeShipping ? 0 : 50)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onProceedToCheckout}
                      className="w-full py-3.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>{t('cart.proceedCheckout')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center justify-center text-[11px] text-stone-500">
                      <span>
                        {language === 'ta'
                          ? '100% தூய மரச்செக்கு இயற்கை எண்ணெய்'
                          : '100% Mara Chekku Genuine Cold-Pressed Oil'}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: FAVORITES VIEW */}
            {activeTab === 'favorites' && (
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain"
                style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
              >
                {favoriteProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-800">
                        {language === 'ta' ? 'விருப்பப் பட்டியல் காலியாக உள்ளது' : 'No Favorites Saved Yet'}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs">
                        {language === 'ta'
                          ? 'நீங்கள் விரும்பும் தயாரிப்புகளைச் சேமித்து வைத்து, எப்போது வேண்டுமானாலும் எளிதாக வாங்கலாம்.'
                          : 'Save the oils you love for faster ordering and regular subscription refills.'}
                      </p>
                    </div>

                    {/* Quick Recommendations to add */}
                    <div className="w-full text-left pt-3 border-t border-stone-100">
                      <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                        {language === 'ta' ? 'பரிந்துரைக்கப்பட்டவை:' : 'Recommended Bestsellers:'}
                      </div>
                      <div className="space-y-2">
                        {products.slice(0, 3).map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded-xl border border-stone-200 bg-stone-50"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg" />
                              <div className="truncate">
                                <div className="text-xs font-bold text-stone-800 truncate">
                                  {language === 'ta' && p.tamilName ? p.tamilName : p.name}
                                </div>
                                <div className="text-[11px] text-stone-500">₹{p.price}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleToggleFav(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 hover:text-red-600 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'சேர்' : 'Save'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  favoriteProducts.map((product) => {
                    const chosenPack =
                      selectedPackForFav[product.id] ||
                      (product.packSizes && product.packSizes[0]) ||
                      product.defaultPack ||
                      '1 Litre Bottle';
                    const displayPrice = getPackPrice(product.price, chosenPack);

                    return (
                      <div
                        key={product.id}
                        className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-gold-500/60 transition-all shadow-2xs flex flex-col justify-between gap-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-18 h-18 object-contain rounded-xl bg-cream-50 p-1.5 shrink-0 border border-stone-100"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-serif font-bold text-xs text-forest-950">
                                {language === 'ta' && product.tamilName ? product.tamilName : product.name}
                              </h4>
                              <button
                                onClick={() => handleToggleFav(product.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Remove from favorites"
                              >
                                <Heart className="w-4 h-4 fill-red-500" />
                              </button>
                            </div>

                            <div className="text-xs font-serif font-bold text-forest-900 mt-1">
                              ₹{displayPrice}
                            </div>

                            {/* Pack Sizes Selector */}
                            {product.packSizes && product.packSizes.length > 1 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {product.packSizes.map((ps) => {
                                  const isPackSelected = chosenPack === ps;
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
                                        isPackSelected
                                          ? 'bg-forest-900 text-white'
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

                        {/* Action: Add to Cart */}
                        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => handleAddFavoriteToCart(product)}
                            className="flex-1 py-2 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                            <span>{language === 'ta' ? 'கார்ட்டில் சேர்க்கவும்' : 'Move to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: ORDERS VIEW & CANCEL WITH REASON */}
            {activeTab === 'orders' && (
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain"
                style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
              >
                {orders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                    <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-stone-400">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-800">
                        {language === 'ta' ? 'ஆர்டர்கள் எதுவும் இல்லை' : 'No Orders Placed Yet'}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs">
                        {language === 'ta'
                          ? 'நீங்கள் செய்யும் புதிய ஆர்டர்கள் மற்றும் டெலிவரி நிலவரங்கள் இங்கே தோன்றும்.'
                          : 'Your live orders and dispatch tracking will appear here once you make a purchase.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('cart')}
                      className="py-2.5 px-5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {language === 'ta' ? 'கார்ட்டைப் பார்' : 'Go to Cart'}
                    </button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const isCancelled = order.orderStatus === 'CANCELLED';
                    const canCancel = order.orderStatus === 'PROCESSING' || order.orderStatus === 'PACKED';

                    return (
                      <div
                        key={order.id}
                        className={`p-4 rounded-2xl border transition-all shadow-2xs space-y-3 ${
                          isCancelled
                            ? 'bg-stone-50 border-stone-200 opacity-90'
                            : 'bg-white border-stone-200/90 hover:border-gold-500/50'
                        }`}
                      >
                        {/* Order Header: ID, Date & Status */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                          <div>
                            <span className="font-mono font-bold text-xs text-stone-900 block">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          {/* Order Status Badge */}
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.orderStatus === 'PACKED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : order.orderStatus === 'PROCESSING'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.orderStatus === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                              {order.orderStatus === 'SHIPPED' && <Truck className="w-3 h-3" />}
                              {order.orderStatus === 'PACKED' && <Package className="w-3 h-3" />}
                              {order.orderStatus === 'PROCESSING' && <Clock className="w-3 h-3" />}
                              {order.orderStatus === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                              <span>{order.orderStatus}</span>
                            </span>
                          </div>
                        </div>

                        {/* Items in this order */}
                        <div className="space-y-1.5 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-stone-700">
                              <span className="truncate max-w-[240px]">
                                {item.productName} ({item.packSize}) × {item.quantity}
                              </span>
                              <span className="font-semibold shrink-0">₹{item.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Total & Payment */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                          <span className="text-stone-500">
                            {order.paymentMethod} •{' '}
                            <strong className="text-stone-800">₹{order.totalAmount}</strong>
                          </span>

                          <span className="text-[11px] text-stone-500 font-medium">
                            {order.city || 'Tamil Nadu'}
                          </span>
                        </div>

                        {/* CANCELLED Details Box */}
                        {isCancelled && (
                          <div className="p-3 rounded-xl bg-red-50/80 border border-red-200 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-red-700">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'ஆர்டர் ரத்து செய்யப்பட்டது' : 'Order Cancelled'}</span>
                            </div>
                            <div className="text-[11px] text-red-800">
                              <strong>{language === 'ta' ? 'காரணம்:' : 'Reason:'}</strong>{' '}
                              <span>{order.cancelReason || 'Customer requested cancellation'}</span>
                            </div>
                            {order.cancelledAt && (
                              <div className="text-[10px] text-stone-400">
                                {new Date(order.cancelledAt).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ACTIVE ORDER: CANCEL BUTTON */}
                        {canCancel && onCancelOrder && (
                          <div className="pt-1">
                            <button
                              onClick={() => {
                                if (onStartCancelOrder) {
                                  onClose();
                                  onStartCancelOrder(order);
                                } else {
                                  setCancellingOrder(order);
                                }
                              }}
                              className="w-full py-2 px-3 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>{language === 'ta' ? 'ஆர்டரை ரத்து செய்' : 'Cancel Order'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Cancellation Reason Modal */}
      {cancellingOrder && onCancelOrder && (
        <CancelOrderModal
          isOpen={!!cancellingOrder}
          onClose={() => setCancellingOrder(null)}
          order={cancellingOrder}
          onConfirmCancel={(orderId, reason, note) => {
            onCancelOrder(orderId, reason, note);
            setCancellingOrder(null);
          }}
        />
      )}
    </>
  );
};
