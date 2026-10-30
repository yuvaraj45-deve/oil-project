import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { PlacedOrder } from '../types';
import { useLanguage } from '../context/LanguageContext';

export interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PlacedOrder | null;
  onConfirmCancel: (orderId: string, reason: string, notes?: string) => void;
}

export const CANCELLATION_REASONS = [
  {
    id: 'mistake',
    en: 'Ordered by mistake',
    ta: 'தவறுதலாக ஆர்டர் செய்துவிட்டேன்',
    icon: '🚫',
  },
  {
    id: 'address',
    en: 'Incorrect delivery address or contact number',
    ta: 'தவறான டெலிவரி முகவரி / தொடர்பு எண்',
    icon: '📍',
  },
  {
    id: 'pack_change',
    en: 'Want to change pack size or oil variant',
    ta: 'பாட்டில் அளவு அல்லது எண்ணெய் வகையை மாற்ற விரும்புகிறேன்',
    icon: '📦',
  },
  {
    id: 'delivery_delay',
    en: 'Expected delivery time is taking too long',
    ta: 'டெலிவரி காலம் தாமதமாக உள்ளது',
    icon: '⏱️',
  },
  {
    id: 'price_change',
    en: 'Found better price or changed my mind',
    ta: 'விலை மாற்றம் அல்லது எண்ணம் மாறிவிட்டது',
    icon: '💵',
  },
  {
    id: 'other',
    en: 'Other reason (Please specify below)',
    ta: 'வேறு காரணம் (கீழே குறிப்பிடவும்)',
    icon: '✍️',
  },
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmCancel,
}) => {
  const { language } = useLanguage();
  const [selectedReasonId, setSelectedReasonId] = useState<string>('mistake');
  const [customReason, setCustomReason] = useState<string>('');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenOption = CANCELLATION_REASONS.find((r) => r.id === selectedReasonId);
    let finalReason = language === 'ta' ? chosenOption?.ta : chosenOption?.en;

    if (selectedReasonId === 'other' && customReason.trim()) {
      finalReason = customReason.trim();
    } else if (feedbackNote.trim()) {
      finalReason = `${finalReason} (${feedbackNote.trim()})`;
    }

    setTimeout(() => {
      onConfirmCancel(order.id, finalReason || 'Cancelled by customer', feedbackNote);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-scale-up">
          
          {/* Header */}
          <div className="p-6 bg-red-50/70 border-b border-red-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {language === 'ta' ? 'ஆர்டரை ரத்து செய்தல்' : 'Cancel Order'}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  #{order.orderNumber} • ₹{order.totalAmount}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                {language === 'ta'
                  ? 'ரத்து செய்வதற்கான காரணத்தைத் தேர்ந்தெடுக்கவும்:'
                  : 'Select Reason for Cancellation:'}
              </label>

              <div className="space-y-2">
                {CANCELLATION_REASONS.map((reason) => {
                  const isSelected = selectedReasonId === reason.id;
                  return (
                    <label
                      key={reason.id}
                      onClick={() => setSelectedReasonId(reason.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-50/50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellation_reason"
                        value={reason.id}
                        checked={isSelected}
                        onChange={() => setSelectedReasonId(reason.id)}
                        className="w-4 h-4 text-red-600 border-stone-300 focus:ring-red-500"
                      />
                      <span className="text-base">{reason.icon}</span>
                      <span className="text-xs font-semibold text-stone-800 flex-1">
                        {language === 'ta' ? reason.ta : reason.en}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Custom Reason Textarea if "Other" is selected */}
            {selectedReasonId === 'other' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'காரணத்தைக் குறிப்பிடவும்:' : 'Please specify the reason:'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={
                    language === 'ta'
                      ? 'உங்கள் காரணத்தை இங்கே விரிவாக எழுதவும்...'
                      : 'Enter your specific reason here...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                />
              </div>
            )}

            {/* Additional Remarks / Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta'
                  ? 'கூடுதல் தகவல் அல்லது கருத்து (விருப்பப்பட்டால்):'
                  : 'Additional feedback or notes (Optional):'}
              </label>
              <textarea
                rows={2}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'எங்கள் சேவையை மேம்படுத்த ஏதேனும் கருத்து உள்ளதா?'
                    : 'Any other comments to help us improve?'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-stone-400"
              />
            </div>

            {/* Warning notice */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {language === 'ta'
                  ? 'ஆர்டரை ரத்து செய்த பிறகு, ஆன்லைன் கட்டணம் செலுத்தப்பட்டிருந்தால் 3-5 வேலை நாட்களில் உங்கள் வங்கிக் கணக்கிற்குத் திருப்பித் தரப்படும்.'
                  : 'Once cancelled, any prepaid payment via UPI/Card will be refunded to your original source within 3-5 business days.'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'ஆர்டரைத் தொடரவும்' : 'Keep My Order'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting
                  ? (language === 'ta' ? 'ரத்து செய்யப்படுகிறது...' : 'Cancelling...')
                  : (language === 'ta' ? 'ரத்துசெய்வதை உறுதிப்படுத்து' : 'Confirm Cancel')}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

