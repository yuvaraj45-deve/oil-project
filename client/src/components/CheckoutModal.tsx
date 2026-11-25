import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Banknote,
  MapPin,
  Clock,
  Tag,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { CartItem, PlacedOrder, UserProfile } from '../types';
import { useLanguage, getLocalizedProductName } from '../context/LanguageContext';
import { useOffers } from '../context/OfferContext';
import { resolveProductImage } from '../utils/productUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: PlacedOrder) => void;
  currentUser?: UserProfile | null;
  onRequireAuth?: (mode?: 'login' | 'register') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  currentUser,
  onRequireAuth,
}) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    paymentMethod: 'UPI' as 'UPI' | 'CARD' | 'COD',
    upiId: '',
  });

  // Pre-populate customer details from logged-in account
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city || 'Coimbatore',
        pincode: currentUser.pincode || prev.pincode,
      }));
    }
  }, [currentUser, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isOffersAccordionOpen, setIsOffersAccordionOpen] = useState(true);

  // Lock background body scroll completely when Checkout Drawer is open
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

  const { activeOffer, availableOffers, applyOffer, removeOffer, calculateCartDiscount } = useOffers();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartOfferResult = calculateCartDiscount(subtotal);
  const discountAmount = cartOfferResult.discountAmount;
  const shippingFee = cartOfferResult.shippingFee;
  const totalAmount = cartOfferResult.finalTotal;

  const handleApplyCouponCode = (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim();
    if (!targetCode) {
      setCouponError(language === 'ta' ? 'கூப்பன் குறியீட்டை உள்ளிடவும்' : 'Please enter a coupon code');
      setCouponSuccess(null);
      return;
    }
    const result = applyOffer(targetCode);
    if (!result.success) {
      setCouponError(language === 'ta' ? result.messageTa : result.message);
      setCouponSuccess(null);
    } else {
      setCouponError(null);
      setCouponSuccess(language === 'ta' ? result.messageTa : result.message);
      setCouponInput('');
      setTimeout(() => setCouponSuccess(null), 3500);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = language === 'ta' ? 'உங்கள் முழு பெயரை உள்ளிடவும்' : 'Please enter your full name';
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = language === 'ta' ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errors.email = language === 'ta' ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email for order invoice';
    }
    if (!formData.address.trim() || formData.address.trim().length < 8) {
      errors.address = language === 'ta' ? 'முழுமையான கதவு எண் மற்றும் தெரு முகவரியை உள்ளிடவும்' : 'Please enter complete door number and street address';
    }
    if (!formData.city.trim()) {
      errors.city = language === 'ta' ? 'நகரத்தின் பெயரை உள்ளிடவும்' : 'City / Town name is required';
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = language === 'ta' ? 'சரியான 6 இலக்க பின்கோடு தேவை' : 'Valid 6-digit Pincode is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePincodeChange = (pin: string) => {
    setFormData((prev) => ({ ...prev, pincode: pin }));
    if (formErrors.pincode) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.pincode;
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('login');
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderNumber = `SSOIL-2026-${randomSuffix}`;

    const orderPayload = {
      userId: currentUser.id,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: `${formData.address.trim()}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      paymentMethod: formData.paymentMethod,
      couponCode: activeOffer && discountAmount > 0 ? activeOffer.code : undefined,
      discountAmount: discountAmount > 0 ? discountAmount : 0,
      subtotal,
      shippingFee,
      totalAmount,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: getLocalizedProductName(i.product, language) || i.product.name,
        packSize: i.packSize,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
    };

    let placedOrder: PlacedOrder = {
      id: `ord_${Date.now()}`,
      userId: currentUser.id,
      orderNumber: generatedOrderNumber,
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: orderPayload.shippingAddress,
      city: formData.city,
      pincode: formData.pincode,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PROCESSING',
      subtotal,
      discountAmount: discountAmount > 0 ? discountAmount : 0,
      couponCode: activeOffer && discountAmount > 0 ? activeOffer.code : undefined,
      shippingFee,
      totalAmount,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.product.id,
        productName: getLocalizedProductName(i.product, language) || i.product.name,
        packSize: i.packSize,
        quantity: i.quantity,
        unitPrice: i.price,
        subtotal: i.price * i.quantity,
      })),
    };

    try {
      // Attempt live POST to Express Backend API (Local or Render)
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          placedOrder = {
            ...placedOrder,
            id: result.data.id || placedOrder.id,
            orderNumber: result.data.orderNumber || generatedOrderNumber,
          };
        }
      }
    } catch (err) {
      console.log('Backend offline or simulated, placing order locally:', err);
    } finally {
      setIsSubmitting(false);
      onOrderSuccess(placedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop: Clear & subtle */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Side Drawer container (Right side) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 h-full w-full sm:w-auto">
        <div
          className="w-full sm:w-[540px] md:w-[600px] max-w-full bg-white shadow-2xl flex flex-col h-full max-h-[100dvh] overflow-hidden"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Top Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-cream-100 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide">
                    {t('checkout.title')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                  </span>
                </div>
                <p className="text-[11px] text-cream-200/70">
                  {t('checkout.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-cream-200/70 hover:text-white hover:bg-forest-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form wrapping scrollable content and sticky checkout footer */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#fbf9f6]">
              {/* Order Summary Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-cream-200">
                  <h4 className="font-serif font-bold text-sm text-forest-950">
                    {t('checkout.orderSummary')} ({items.reduce((s, i) => s + i.quantity, 0)} {language === 'ta' ? 'பொருட்கள்' : 'Items'})
                  </h4>
                  <span className="text-xs font-serif font-black text-forest-900">
                    ₹{totalAmount}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const pName = getLocalizedProductName(item.product, language);
                    const itemSubtotal = item.price * item.quantity;
                    let itemDiscount = 0;
                    if (activeOffer && discountAmount > 0) {
                      if (activeOffer.discountType === 'percentage') {
                        itemDiscount = Math.round((itemSubtotal * activeOffer.discountValue) / 100);
                      } else if (activeOffer.discountType === 'fixed' && subtotal > 0) {
                        itemDiscount = Math.round((itemSubtotal / subtotal) * discountAmount);
                      }
                    }
                    return (
                      <div
                        key={`${item.product.id}-${item.packSize}`}
                        className="flex items-center gap-3 py-1.5 border-b border-stone-100 last:border-0"
                      >
                        <img
                          src={resolveProductImage(item.product)}
                          alt={pName}
                          onError={(e) => {
                            e.currentTarget.src = '/products/sesame_oil.jpg?v=ssoil';
                          }}
                          className="w-11 h-11 rounded-lg object-contain border border-cream-200 bg-cream-50 shrink-0 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-forest-950 truncate">
                            {pName}
                          </h5>
                          <span className="text-[11px] text-stone-500">
                            {item.packSize} × {item.quantity}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          {itemDiscount > 0 ? (
                            <div>
                              <div className="flex items-baseline justify-end gap-1">
                                <span className="text-[10px] line-through text-stone-400">₹{itemSubtotal}</span>
                                <span className="text-xs font-serif font-black text-emerald-800">₹{itemSubtotal - itemDiscount}</span>
                              </div>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 block mt-0.5">
                                -₹{itemDiscount} {language === 'ta' ? 'குறைவு' : 'OFF'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-forest-900">
                              ₹{itemSubtotal}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="pt-2.5 border-t border-cream-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{t('checkout.subtotal')}:</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && activeOffer && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'ta' ? 'ஆஃபர் தள்ளுபடி' : 'Offer Discount'}:</span>
                      </span>
                      <span className="font-black text-emerald-700">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>{t('checkout.delivery')}:</span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-700' : 'text-stone-900'}`}>
                      {shippingFee === 0 ? t('checkout.free') : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600 text-[11px]">
                    <span>{language === 'ta' ? 'வரி & ஜிஎஸ்டி:' : 'GST & Mill Taxes:'}</span>
                    <span className="text-stone-500 font-medium">{language === 'ta' ? 'உள்ளடக்கப்பட்டுள்ளது' : 'Included'}</span>
                  </div>
                </div>
              </div>

              {/* Private Coupon Code Input Box (Customer Types Code - No Codes Shown) */}
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-serif font-bold text-forest-950">
                    {language === 'ta' ? 'கூப்பன் குறியீடு உள்ளதா?' : 'Have a Promo / Coupon Code?'}
                  </span>
                </div>

                {/* If Applied Banner (No code leaked) */}
                {activeOffer && discountAmount > 0 ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-emerald-950">
                          {language === 'ta' ? 'கூப்பன் தள்ளுபடி சேர்க்கப்பட்டது' : 'Coupon Applied'} ({activeOffer.discountValue}% OFF)
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          {language === 'ta' ? `₹${discountAmount} தள்ளுபடி செய்யப்பட்டுள்ளது!` : `₹${discountAmount} discount applied!`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeOffer}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
                    >
                      {language === 'ta' ? 'நீக்கு' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  /* Customer Types Their Secret Coupon Code */
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                          setCouponSuccess(null);
                        }}
                        placeholder={language === 'ta' ? 'கூப்பன் குறியீட்டை உள்ளிடவும்...' : 'Enter your coupon code...'}
                        className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold focus:outline-none focus:border-forest-900 uppercase bg-stone-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCouponCode()}
                        className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold text-xs transition-all shadow-2xs cursor-pointer shrink-0"
                      >
                        {language === 'ta' ? 'பயன்படுத்து' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 font-bold pl-1">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-emerald-700 font-bold pl-1">{couponSuccess}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Verified Signed In Customer Badge */}
              {currentUser && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-emerald-950 truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                          {language === 'ta' ? 'பதிவு செய்த வாடிக்கையாளர்' : 'Registered Customer'}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-medium block truncate">
                        {currentUser.phone} {currentUser.email ? `• ${currentUser.email}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* If NOT signed in: Display Required Customer Registration / Login Screen */}
              {!currentUser && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-md text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                      {language === 'ta' ? 'உள்நுழைவு கட்டாயம்' : 'Account Required'}
                    </span>
                    <h3 className="font-serif font-black text-lg sm:text-xl text-forest-950">
                      {language === 'ta' ? 'ஆர்டர் செய்ய பதிவு / உள்நுழைவு அவசியம்' : 'Please Sign In or Register to Order'}
                    </h3>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                      {language === 'ta'
                        ? 'நேரடி மரச்செக்கு எண்ணெய் தர உத்திரவாதம் மற்றும் பார்சல் டிராக்கிங் விபரங்களைப் பெற, பதிவு செய்த வாடிக்கையாளர்கள் மட்டுமே ஆர்டர் செய்ய முடியும்.'
                        : 'To ensure genuine Mara Chekku certificates, order tracking, and delivery updates, orders must be placed from a verified customer account.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 max-w-xs mx-auto pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onRequireAuth) onRequireAuth('login');
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onRequireAuth) onRequireAuth('register');
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{language === 'ta' ? 'பதிவு செய்க' : 'Register Free'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Details (Step 1) */}
              <div className={`bg-white p-4 sm:p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4 ${!currentUser ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 border-b border-cream-200 pb-2.5">
                  <MapPin className="w-4 h-4 text-forest-800" />
                  <h4 className="font-serif font-bold text-sm text-forest-950">
                    {t('checkout.step1')}
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('checkout.name')} *
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'ta' ? 'எ.கா. ரமேஷ் குமார்' : 'e.g. Ramesh Kumar'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-800/20 ${
                      formErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('checkout.phone')} (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      placeholder={language === 'ta' ? '10 இலக்க எண்' : '10-digit number'}
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-800/20 ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t('checkout.email')} *
                    </label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-800/20 ${
                        formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('checkout.address')} *
                  </label>
                  <textarea
                    rows={2}
                    placeholder={language === 'ta' ? 'கதவு எண், தெரு முகவரி, அடையாளம்...' : 'Door number, building, street, landmark...'}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-800/20 ${
                      formErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t('checkout.pincode')} *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder={language === 'ta' ? '6 இலக்க பின்கோடு' : '6-digit Pincode'}
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs text-center font-bold ${
                        formErrors.pincode ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.pincode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t('checkout.city')} *
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'ta' ? 'உங்கள் நகரம்' : 'Enter city / town'}
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (formErrors.city) {
                          setFormErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.city;
                            return copy;
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        formErrors.city ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-white'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t('checkout.state')}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (Step 2) */}
              <div className={`bg-white p-4 sm:p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3 ${!currentUser ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 border-b border-cream-200 pb-2.5">
                  <Banknote className="w-4 h-4 text-forest-800" />
                  <h4 className="font-serif font-bold text-sm text-forest-950">
                    {t('checkout.step2')}
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* UPI Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'UPI'
                        ? 'border-forest-900 bg-forest-900/5 ring-2 ring-forest-900/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Smartphone className="w-4 h-4 text-forest-900" />
                      {formData.paymentMethod === 'UPI' && (
                        <CheckCircle2 className="w-4 h-4 text-forest-900" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="block text-xs font-bold text-stone-900">UPI / QR</span>
                      <span className="text-[10px] text-stone-500">GPay, PhonePe</span>
                    </div>
                  </button>

                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'CARD'
                        ? 'border-forest-900 bg-forest-900/5 ring-2 ring-forest-900/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <CreditCard className="w-4 h-4 text-forest-900" />
                      {formData.paymentMethod === 'CARD' && (
                        <CheckCircle2 className="w-4 h-4 text-forest-900" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="block text-xs font-bold text-stone-900">{language === 'ta' ? 'கார்டு' : 'Cards'}</span>
                      <span className="text-[10px] text-stone-500">Credit / Debit</span>
                    </div>
                  </button>

                  {/* COD Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      formData.paymentMethod === 'COD'
                        ? 'border-forest-900 bg-forest-900/5 ring-2 ring-forest-900/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      {formData.paymentMethod === 'COD' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="block text-xs font-bold text-stone-900">{language === 'ta' ? 'நேரில் பணம்' : 'Cash on Del.'}</span>
                      <span className="text-[10px] text-stone-500">{language === 'ta' ? 'பொருளைப் பெற்று' : 'Pay at doorstep'}</span>
                    </div>
                  </button>
                </div>

                {/* Sub-view for UPI */}
                {formData.paymentMethod === 'UPI' && (
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-950">
                    <div className="flex items-center gap-2 font-bold">
                      {language === 'ta' ? 'டெலிவரி போது அல்லது செயலியில் உடனடி UPI' : 'Instant UPI Payment on Delivery or App'}
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      {language === 'ta'
                        ? 'உங்கள் ஆர்டர் ரசீதுடன் GPay/PhonePe க்யூஆர் கோடு மற்றும் கட்டண இணைப்பு வழங்கப்படும்.'
                        : 'A dynamic GPay/PhonePe payment link & QR will be sent with your order invoice.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Fresh Mill Dispatch Assurance */}
              <div className="bg-cream-100/80 p-4 rounded-2xl border border-cream-300/80 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 text-forest-900 font-bold">
                  <Truck className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ta' ? 'அதிவிரைவு டெலிவரி உத்தரவாதம்' : 'Express Dispatch Guarantee'}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {language === 'ta'
                    ? 'மதியம் 2:00 மணிக்குள் பெறப்படும் ஆர்டர்கள் சேலம் ஆலையிலிருந்து அன்றைய தினமே நேரடியாக அனுப்பி வைக்கப்படும்.'
                    : 'Orders placed before 2:00 PM are packed in tamper-proof tins/bottles and dispatched the same day from our central mill.'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{language === 'ta' ? 'டெலிவரி காலம்: தமிழ்நாடு முழுவதும் 24 - 48 மணி நேரம்' : 'Estimated Delivery: 24 - 48 Hours across Tamil Nadu'}</span>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Footer */}
            <div className="p-4 sm:p-5 border-t border-cream-300 bg-white shrink-0 space-y-2.5 shadow-xl">
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ta' ? `இந்த ஆர்டரில் நீங்கள் ₹${discountAmount} சேமிக்கிறீர்கள்!` : `You saved ₹${discountAmount} with this offer!`}</span>
                  </span>
                  <span className="text-emerald-700 font-black">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold tracking-wider">
                    {language === 'ta' ? 'செலுத்த வேண்டிய தொகை:' : 'Total Payable:'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl font-black text-forest-950">
                      ₹{totalAmount}
                    </span>
                    {subtotal !== totalAmount && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{subtotal}
                      </span>
                    )}
                  </div>
                </div>

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onRequireAuth) onRequireAuth('login');
                    }}
                    className="flex-1 max-w-[280px] py-3.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <Lock className="w-4 h-4 text-gold-400" />
                    <span>{language === 'ta' ? 'ஆர்டர் செய்ய உள்நுழைக' : 'Sign In to Order'}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 max-w-[280px] py-3.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-forest-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                        <span>{language === 'ta' ? 'ஆர்டர் செய்யப்படுகிறது...' : 'Processing...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('checkout.placeOrder')} (₹{totalAmount})</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
