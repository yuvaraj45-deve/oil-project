import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, packSize: string, delta: number) => void;
  onRemoveItem: (productId: string, packSize: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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
                  Your Shopping Cart
                </h3>
                <span className="text-xs text-stone-500">
                  {items.length} {items.length === 1 ? 'item' : 'items'} (Sample Order)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-colors"
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
                    Unlocked: You have got Free Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add ₹{remainingForFreeShipping} more for <strong>Free Delivery</strong>
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
                    Your cart is currently empty
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our pure cold-pressed Sesame, Groundnut, and Coconut oils to begin your order.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-forest-900 text-cream-100 text-xs font-semibold hover:bg-forest-800 transition-colors"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.packSize}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-cream-100/70 border border-cream-300/60 relative group"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-cream-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-forest-950 font-serif line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.packSize)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Pack: <span className="font-semibold text-stone-700">{item.packSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.packSize, -1)}
                          className="p-1 hover:bg-cream-100 text-stone-600 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.packSize, 1)}
                          className="p-1 hover:bg-cream-100 text-stone-600 rounded-r-lg transition-colors"
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
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-cream-300 bg-cream-100/90 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-emerald-700">
                    {isFreeShipping ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-forest-950 pt-2 border-t border-cream-300">
                  <span>Total (Sample Data):</span>
                  <span className="font-serif text-lg text-forest-900">
                    ₹{subtotal + (isFreeShipping ? 0 : 50)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(
                    'Order Simulation: Thank you for testing the SS OIL shopping cart! Backend checkout is disabled for this frontend preview.'
                  );
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sample E-Commerce Mode • 100% Cold-Pressed Genuine Oil</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
