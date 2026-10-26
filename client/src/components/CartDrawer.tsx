import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, packSize: string, delta: number) => void;
  onRemoveItem: (productId: string, packSize: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const { language, t } = useLanguage();

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-cream-300/80 bg-cream-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest-900 text-gold-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {t('cart.title')}
                </h3>
                <span className="text-xs text-stone-500">
                  {items.length} {language === 'ta' ? 'பொருட்கள்' : items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-700">
                    {t('cart.emptyTitle')}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    {t('cart.emptySubtitle')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-forest-900 text-cream-100 text-xs font-semibold hover:bg-forest-800 transition-colors cursor-pointer"
                >
                  {t('cart.startShopping')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const productName =
                  language === 'ta' && t(`prod.${item.product.id}.name`)
                    ? t(`prod.${item.product.id}.name`)
                    : item.product.name;

                return (
                  <div
                    key={`${item.product.id}-${item.packSize}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-cream-100/70 border border-cream-300/60 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-cream-200">
                      <img
                        src={item.product.image}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-bold text-forest-950 font-serif line-clamp-1">
                            {productName}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.packSize)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
            <div className="p-5 border-t border-cream-300 bg-cream-100/90 space-y-4">
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

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'ta'
                    ? '100% தூய மரச்செக்கு இயற்கை எண்ணெய்'
                    : '100% Cold-Pressed Genuine Oil'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
