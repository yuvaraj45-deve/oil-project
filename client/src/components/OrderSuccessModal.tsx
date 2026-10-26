import React from 'react';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  Share2,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { PlacedOrder } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrderSuccessModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOpenAdmin,
}) => {
  const { language } = useLanguage();
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareText = language === 'ta'
    ? `நான் SS OIL-ல் இருந்து சுத்தமான மரச்செக்கு எண்ணெய் ஆர்டர் செய்துள்ளேன்! ஆர்டர் எண் #${order.orderNumber}. சொட்டு தோறும் தூய்மை.`
    : `I just placed an order for pure Mara Chekku oil from SS OIL! Order #${order.orderNumber}. Pure Quality, Every Drop.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Success Banner */}
        <div className="bg-gradient-to-br from-emerald-900 via-forest-900 to-forest-950 p-6 text-cream-100 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-400/30 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> {language === 'ta' ? 'ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Order Successfully Placed!'}
          </span>

          <h3 className="font-serif text-2xl font-bold tracking-wide">
            {language === 'ta' ? `நன்றி, ${order.customerName}!` : `Thank you, ${order.customerName}!`}
          </h3>
          <p className="text-xs text-cream-200/80 mt-1">
            {language === 'ta'
              ? 'உங்கள் மரச்செக்கு எண்ணெய் ஆர்டர் ஏற்கப்பட்டு மில்லில் பேக்கிங் செய்யப்படுகிறது.'
              : 'Your artisanal Mara Chekku order has been received and sent for mill packing.'}
          </p>
        </div>

        {/* Content Details */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-cream-50/50">
          
          {/* Order Reference Box */}
          <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                {language === 'ta' ? 'ஆர்டர் கண்காணிப்பு எண்' : 'Order Tracking ID'}
              </span>
              <span className="font-mono text-base font-bold text-forest-950">
                {order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {language === 'ta' ? 'உறுதியானது' : order.orderStatus}
              </span>
              <span className="block text-[10px] text-stone-400 mt-0.5">
                {language === 'ta' ? 'பேமெண்ட்' : 'Payment'}: {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Delivery & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-forest-900">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                <span>{language === 'ta' ? 'டெலிவரி முகவரி' : 'Shipping Address'}</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {order.shippingAddress}
              </p>
              <p className="text-stone-500 text-[10px]">{language === 'ta' ? 'தொலைபேசி' : 'Phone'}: {order.customerPhone}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-forest-900">
                <Calendar className="w-3.5 h-3.5 text-gold-600" />
                <span>{language === 'ta' ? 'எதிர்பார்க்கப்படும் வருகை' : 'Estimated Arrival'}</span>
              </div>
              <p className="text-stone-700 text-xs font-semibold">
                {language === 'ta' ? '24 முதல் 48 மணி நேரத்திற்குள்' : 'Within 24 to 48 Hours'}
              </p>
              <p className="text-stone-500 text-[10px]">
                {language === 'ta'
                  ? 'சேலம் மரச்செக்கு மில்லில் இருந்து நேரடி பாதுகாப்பு சீலுடன் அனுப்பப்படுகிறது.'
                  : 'Dispatched from Salem Mara Chekku Mill with tamper-proof seal.'}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="bg-white p-4 rounded-2xl border border-cream-200 space-y-2.5">
            <h4 className="font-serif font-bold text-xs text-forest-950 pb-1.5 border-b border-cream-200 flex items-center justify-between">
              <span>{language === 'ta' ? 'ஆர்டர் செய்யப்பட்ட பொருட்கள்' : 'Items in this Order'}</span>
              <span className="text-[11px] text-stone-500 font-sans font-normal">
                {order.items.length} {language === 'ta' ? 'பொருட்கள்' : 'items'}
              </span>
            </h4>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0"
                >
                  <div>
                    <h5 className="font-bold text-stone-800 text-xs">{item.productName}</h5>
                    <span className="text-[11px] text-stone-500">
                      {item.packSize} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-forest-900">
                    ₹{item.subtotal}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs">
              <span className="text-stone-500">{language === 'ta' ? 'மொத்த தொகை:' : 'Total Paid / Payable:'}</span>
              <span className="font-serif text-base font-bold text-forest-950">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'ta' ? 'தொடர்ந்து வாங்க' : 'Continue Shopping'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="py-3 px-4 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-cream-300"
            >
              <Package className="w-4 h-4 text-forest-800" />
              <span>{language === 'ta' ? 'அட்மின் டாஷ்போர்டு' : 'View in Admin Dashboard'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-cream-200">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> {language === 'ta' ? 'ரசீதை பிரிண்ட் செய்' : 'Print Order Receipt'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> {language === 'ta' ? 'WhatsApp-ல் பகிருங்கள்' : 'Share on WhatsApp'}
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
