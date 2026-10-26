import React, { useState } from 'react';
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
  Sparkles,
} from 'lucide-react';
import { CartItem, PlacedOrder } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Salem',
    state: 'Tamil Nadu',
    pincode: '636001',
    paymentMethod: 'UPI' as 'UPI' | 'CARD' | 'COD',
    upiId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 499 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

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
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = language === 'ta' ? 'சரியான 6 இலக்க பின்கோடு தேவை' : 'Valid 6-digit Pincode is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePincodeChange = (pin: string) => {
    setFormData((prev) => ({ ...prev, pincode: pin }));
    // Quick Tamil Nadu regional helper
    if (pin.startsWith('636')) {
      setFormData((prev) => ({ ...prev, pincode: pin, city: 'Salem', state: 'Tamil Nadu' }));
    } else if (pin.startsWith('600')) {
      setFormData((prev) => ({ ...prev, pincode: pin, city: 'Chennai', state: 'Tamil Nadu' }));
    } else if (pin.startsWith('641')) {
      setFormData((prev) => ({ ...prev, pincode: pin, city: 'Coimbatore', state: 'Tamil Nadu' }));
    } else if (pin.startsWith('625')) {
      setFormData((prev) => ({ ...prev, pincode: pin, city: 'Madurai', state: 'Tamil Nadu' }));
    } else if (pin.startsWith('620')) {
      setFormData((prev) => ({ ...prev, pincode: pin, city: 'Tiruchirappalli', state: 'Tamil Nadu' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedOrderNumber = `SSOIL-2026-${randomSuffix}`;

    const orderPayload = {
      customerName: formData.name.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: `${formData.address.trim()}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      paymentMethod: formData.paymentMethod,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        packSize: i.packSize,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
    };

    let placedOrder: PlacedOrder = {
      id: `ord_${Date.now()}`,
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
      shippingFee,
      totalAmount,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-cream-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold tracking-wide">
                  {t('checkout.title')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-cream-200/70">
                {t('checkout.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cream-200/70 hover:text-white hover:bg-forest-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two columns on desktop */}
        <div className="overflow-y-auto flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-cream-50/40">
          
          {/* Left Form (7 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-7 space-y-5">
            {/* Delivery Details */}
            <div className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-xs space-y-4">
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

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t('checkout.pincode')}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
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

            {/* Payment Method Selector */}
            <div className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-xs space-y-3">
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
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
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

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-sm transition-all duration-200 shadow-lg shadow-forest-950/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ta' ? 'ஆர்டர் செய்யப்படுகிறது...' : 'Processing Secure Order...'}</span>
                </>
              ) : (
                <>
                  <span>{t('checkout.placeOrder')} (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            {/* Order Items */}
            <div className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-xs space-y-3">
              <h4 className="font-serif font-bold text-sm text-forest-950 pb-2 border-b border-cream-200">
                {t('checkout.orderSummary')} ({items.reduce((s, i) => s + i.quantity, 0)} {language === 'ta' ? 'பொருட்கள்' : 'Items'})
              </h4>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => {
                  const pName = language === 'ta' && t(`prod.${item.product.id}.name`) ? t(`prod.${item.product.id}.name`) : item.product.name;
                  return (
                    <div
                      key={`${item.product.id}-${item.packSize}`}
                      className="flex items-center gap-3 py-1.5 border-b border-stone-100 last:border-0"
                    >
                      <img
                        src={item.product.image}
                        alt={pName}
                        className="w-12 h-12 rounded-lg object-cover border border-cream-200 bg-cream-50 shrink-0"
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
                        <span className="text-xs font-bold text-forest-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-cream-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{t('checkout.subtotal')}:</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
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
                <div className="flex justify-between pt-2 border-t border-cream-200 text-sm font-bold text-forest-950">
                  <span>{t('checkout.total')}:</span>
                  <span className="font-serif text-base text-forest-900">₹{totalAmount}</span>
                </div>
              </div>
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
                  : 'Orders placed before 2:00 PM are packed in tamper-proof tins/bottles and dispatched the same day from our Salem mill.'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold pt-1">
                <Clock className="w-3 h-3" />
                <span>{language === 'ta' ? 'டெலிவரி காலம்: தமிழ்நாடு முழுவதும் 24 - 48 மணி நேரம்' : 'Estimated Delivery: 24 - 48 Hours across Tamil Nadu'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
