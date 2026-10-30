import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react';
import { PlacedOrder } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CancelOrderPageProps {
  order: PlacedOrder | null;
  onConfirmCancel: (orderId: string, reason: string, note?: string) => void;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onViewOrders?: () => void;
}

export const CancelOrderPage: React.FC<CancelOrderPageProps> = ({
  order,
  onConfirmCancel,
  onBack,
  onNavigate,
  onViewOrders,
}) => {
  const { language } = useLanguage();

  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelledSuccess, setIsCancelledSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const CANCELLATION_REASONS = [
    {
      id: 'mistake',
      labelEn: 'Ordered by mistake',
      labelTa: 'தவறுதலாக ஆர்டர் செய்துவிட்டேன்',
      descEn: 'Placed wrong order or duplicate transaction',
      descTa: 'தவறான பொருள் அல்லது இருமுறை ஆர்டர் செய்துவிட்டேன்',
      icon: '🛒',
    },
    {
      id: 'address',
      labelEn: 'Incorrect delivery address / contact details',
      labelTa: 'தவறான டெலிவரி முகவரி அல்லது தொலைபேசி எண்',
      descEn: 'Need to update address or shipping details',
      descTa: 'முகவரி அல்லது தொலைபேசி எண்ணை மாற்ற வேண்டும்',
      icon: '📍',
    },
    {
      id: 'pack_size',
      labelEn: 'Want to change pack size or bottle quantity',
      labelTa: 'பாட்டில் அளவு அல்லது எண்ணிக்கையை மாற்ற வேண்டும்',
      descEn: 'Want 5L Can instead of 1L or need different variety',
      descTa: '1 லிட்டருக்குப் பதிலாக 5 லிட்டர் அல்லது வேறு எண்ணெய் வேண்டும்',
      icon: '🧴',
    },
    {
      id: 'delay',
      labelEn: 'Expected delivery date is too long / delayed',
      labelTa: 'டெலிவரி காலம் தாமதமாக உள்ளது',
      descEn: 'Need cooking oil urgently for kitchen',
      descTa: 'அவசரமாக சமையலுக்கு எண்ணெய் தேவைப்படுகிறது',
      icon: '🚚',
    },
    {
      id: 'pricing',
      labelEn: 'Found alternative / pricing concern',
      labelTa: 'விலை அல்லது கட்டணக் காரணம்',
      descEn: 'Payment issue or decided to purchase locally',
      descTa: 'கட்டணப் பிரச்சனை அல்லது மாற்று முடிவு',
      icon: '💳',
    },
    {
      id: 'other',
      labelEn: 'Other personal reason',
      labelTa: 'வேறு தனிப்பட்ட காரணம்',
      descEn: 'I will provide details in note below',
      descTa: 'கீழே உள்ள குறிப்பில் விவரங்களைக் குறிப்பிடுகிறேன்',
      icon: '✍️',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!selectedReason) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து ஆர்டரை ரத்து செய்வதற்கான காரணத்தைத் தேர்வு செய்யவும்.'
          : 'Please select a reason for cancelling this order.'
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const chosen = CANCELLATION_REASONS.find((r) => r.id === selectedReason);
      const reasonLabel = chosen
        ? language === 'ta'
          ? chosen.labelTa
          : chosen.labelEn
        : selectedReason;

      onConfirmCancel(order.id, reasonLabel, customNote.trim() || undefined);
      setIsSubmitting(false);
      setIsCancelledSuccess(true);
    }, 450);
  };

  // If no order selected or order already cancelled
  if (!order) {
    return (
      <div className="min-h-[85vh] bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 font-serif mb-2">
          {language === 'ta' ? 'ஆர்டர் விவரம் கிடைக்கவில்லை' : 'No Order Selected'}
        </h2>
        <p className="text-sm text-stone-500 max-w-sm mb-6">
          {language === 'ta'
            ? 'ரத்து செய்வதற்கு எந்த ஆர்டரும் தேர்வு செய்யப்படவில்லை. உங்கள் ஆர்டர்கள் பக்கத்திற்குச் செல்லவும்.'
            : 'No active order was selected for cancellation. Please select an order from your orders list.'}
        </p>
        <button
          onClick={onBack}
          className="py-2.5 px-6 rounded-xl bg-forest-950 text-white text-xs font-bold hover:bg-forest-900 transition-colors cursor-pointer"
        >
          {language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Store'}
        </button>
      </div>
    );
  }

  // Success Confirmation View
  if (isCancelledSuccess || order.orderStatus === 'CANCELLED') {
    return (
      <div className="min-h-[90vh] bg-stone-50 py-12 px-4 sm:px-6 flex justify-center items-center">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-serif font-black text-stone-900 mb-2">
            {language === 'ta' ? 'ஆர்டர் வெற்றிகரமாக ரத்து செய்யப்பட்டது' : 'Order Cancelled Successfully'}
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto mb-6">
            {language === 'ta'
              ? `ஆர்டர் #${order.id} ரத்து செய்யப்பட்டுவிட்டது. ஆன்லைன் மூலம் பணம் செலுத்தியிருந்தால் 3-5 வணிக நாட்களில் அதே கணக்கில் திருப்பிச் செலுத்தப்படும்.`
              : `Order #${order.id} has been cancelled. If you paid online, the refund will be credited to your original payment method in 3-5 business days.`}
          </p>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left mb-6 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-stone-500">{language === 'ta' ? 'ஆர்டர் எண்:' : 'Order ID:'}</span>
              <span className="font-mono font-bold text-stone-900">{order.id}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-stone-500">{language === 'ta' ? 'ரத்து செய்யப்பட்ட காரணம்:' : 'Recorded Reason:'}</span>
              <span className="font-bold text-red-700">
                {order.cancelReason || (CANCELLATION_REASONS.find((r) => r.id === selectedReason)?.labelTa || selectedReason)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">{language === 'ta' ? 'தொகை:' : 'Total Amount:'}</span>
              <span className="font-serif font-bold text-stone-900">₹{order.totalAmount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="py-3 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
            </button>
            <button
              onClick={() => {
                if (onViewOrders) onViewOrders();
                else onNavigate('/profile');
              }}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-stone-600" />
              <span>{language === 'ta' ? 'என் ஆர்டர்கள்' : 'View My Orders'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Top Navigation Back */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ta' ? 'திரும்பிச் செல்' : 'Back to Store / Orders'}</span>
          </button>
        </div>

        {/* Dedicated Cancellation Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-start gap-3.5 pb-6 border-b border-stone-100 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                  Order #{order.id}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {order.orderStatus}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900 mt-1">
                {language === 'ta' ? 'ஆர்டரை ரத்து செய்வதற்கான காரணம்' : 'Why do you want to cancel this order?'}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ta'
                  ? 'உங்கள் ஆர்டரை ரத்து செய்ய கீழ்வரும் காரணங்களில் ஒன்றைத் தேர்வு செய்யவும்.'
                  : 'Please select a reason below to proceed with order cancellation.'}
              </p>
            </div>
          </div>

          {/* Order Details Mini Summary */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>{language === 'ta' ? 'ஆர்டர் விவரங்கள்' : 'Order Summary'}</span>
              <span className="font-serif font-bold text-forest-950 text-sm">₹{order.totalAmount}</span>
            </h4>
            <div className="space-y-2 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-stone-600">
                  <span className="font-medium truncate pr-2">
                    {item.productName} ({item.packSize}) × {item.quantity}
                  </span>
                  <span className="font-mono font-bold shrink-0">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            {order.shippingAddress && (
              <div className="mt-3 pt-2.5 border-t border-stone-200 text-[11px] text-stone-500 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{order.shippingAddress}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cancellation Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Reason Selection Radio Cards */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2.5 uppercase tracking-wider">
                {language === 'ta' ? 'காரணத்தைத் தேர்வு செய்யவும் *' : 'Select Cancellation Reason *'}
              </label>

              <div className="space-y-2.5">
                {CANCELLATION_REASONS.map((r) => {
                  const isSelected = selectedReason === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReason(r.id);
                        setErrorMessage(null);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="text-xl shrink-0">{r.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-red-950 font-serif' : 'text-stone-800'}`}>
                          {language === 'ta' ? r.labelTa : r.labelEn}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {language === 'ta' ? r.descTa : r.descEn}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Additional Notes Textarea */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {language === 'ta' ? 'கூடுதல் விவரங்கள் அல்லது கருத்துக்கள் (விருப்பத்தேர்வு):' : 'Additional Comments / Notes (Optional):'}
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={3}
                placeholder={
                  language === 'ta'
                    ? 'உங்கள் காரணத்தை இங்கே மேலும் விவரமாகக் கூறலாம்...'
                    : 'Any additional details or feedback for our Mara Chekku team...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>

            {/* Policy Guarantee Banner */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 leading-relaxed">
                <span className="font-bold block mb-0.5">
                  {language === 'ta' ? '100% உடனடி பணத்திருப்புதல் உறுதி:' : '100% Instant Refund Policy:'}
                </span>
                {language === 'ta'
                  ? 'ஆன்லைன் பரிவர்த்தனை செய்யப்பட்டிருந்தால், முழுத் தொகையும் 3-5 வேலை நாட்களில் உங்கள் கணக்கிற்கே திருப்பி அனுப்பப்படும். கேஷ் ஆன் டெலிவரி ஆர்டர்களுக்கு எவ்வித கட்டணமும் இல்லை.'
                  : 'For prepaid orders, the full amount will be credited back to your original payment method within 3-5 business days. Zero cancellation fee for COD orders.'}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                {language === 'ta' ? 'ஆர்டரை ரத்து செய்ய வேண்டாம் (திரும்பிச் செல்)' : 'Keep Order / Do Not Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !selectedReason}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  !selectedReason || isSubmitting
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'ta' ? 'ஆர்டரை ரத்து செய்வதை உறுதிசெய்' : 'Confirm Order Cancellation'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
