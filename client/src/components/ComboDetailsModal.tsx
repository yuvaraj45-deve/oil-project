import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Check,
  Star,
  CheckCircle2,
  Boxes,
  Truck,
  Sparkles,
  Heart,
  Droplets,
  PackageCheck,
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage, getLocalizedProductName, getLocalizedProductTagline } from '../context/LanguageContext';
import { toggleFavorite, getFavorites } from '../utils/favorites';

interface ComboDetailsModalProps {
  combo: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, packSize: string, quantity: number) => void;
}

export const ComboDetailsModal: React.FC<ComboDetailsModalProps> = ({
  combo,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !combo) return null;

  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isFav, setIsFav] = useState(() => getFavorites().includes(combo.id));

  const comboName = getLocalizedProductName(combo, language);
  const comboTagline = getLocalizedProductTagline(combo, language);

  const comboPack =
    combo.defaultPack || (combo.packSizes && combo.packSizes[0]) || '1 Combo Pack';

  const savings =
    combo.originalPrice && combo.originalPrice > combo.price
      ? combo.originalPrice - combo.price
      : 0;

  const discountPercent =
    combo.discountPercent ||
    (savings && combo.originalPrice ? Math.round((savings / combo.originalPrice) * 100) : 0);

  // Extract included items
  const includedList =
    combo.benefits && combo.benefits.length > 0
      ? combo.benefits
      : combo.description
      ? combo.description.split(/[,•\n]+/).map((s) => s.trim()).filter(Boolean)
      : [combo.tagline || combo.name];

  const handleFavoriteToggle = () => {
    toggleFavorite(combo.id);
    setIsFav((prev) => !prev);
  };

  const handleAdd = () => {
    onAddToCart(combo, comboPack, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn select-none">
      <div className="bg-white w-full max-w-4xl rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden relative my-6 max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-forest-950 via-[#132c19] to-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-forest-950 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-forest-950" />
              <span>SPECIAL COMBO DEAL</span>
            </span>
            {savings > 0 && (
              <span className="text-xs font-black text-amber-300 hidden sm:inline-block">
                Save ₹{savings * quantity} ({discountPercent}% OFF)
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Left Column: Image Showcase */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50/50 via-[#FAF8F5] to-stone-100 p-6 sm:p-8 border border-amber-200/80 shadow-inner flex items-center justify-center group">
              <img
                src={combo.image || '/products/sesame_oil.jpg?v=ssoil'}
                alt={comboName}
                className="w-full max-h-72 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
              />

              <button
                onClick={handleFavoriteToggle}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-all cursor-pointer shadow-md z-10 ${
                  isFav
                    ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                    : 'bg-white/95 text-stone-400 hover:text-red-500 hover:bg-white'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-forest-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                {comboPack}
              </div>
            </div>

            {/* Purity & Assurance Pills */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                <Droplets className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                <span className="text-[10px] font-black text-forest-950 block">100% Mara Chekku</span>
                <span className="text-[9px] text-stone-500">Traditional Wood</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60">
                <PackageCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="text-[10px] font-black text-forest-950 block">Multi-Oil Bundle</span>
                <span className="text-[9px] text-stone-500">Complete Kitchen</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                <Truck className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                <span className="text-[10px] font-black text-forest-950 block">Free Shipping</span>
                <span className="text-[9px] text-stone-500">Above ₹499</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Add to Cart */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Combo Pack
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-stone-800">{combo.rating || 5.0}</span>
                  <span className="text-stone-400 text-[11px]">({combo.reviewsCount || 280}+ reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-black text-forest-950 leading-tight">
                {comboName}
              </h2>

              {combo.tamilName && language === 'en' && (
                <p className="text-sm font-bold text-amber-900 mt-1">
                  {combo.tamilName}
                </p>
              )}

              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {comboTagline}
              </p>
            </div>

            {/* Price & Savings Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-stone-50 border-2 border-amber-200/90 space-y-1.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Special Combo Offer Price
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="font-serif text-3xl font-black text-forest-950">
                      ₹{combo.price * quantity}
                    </span>
                    {combo.originalPrice && combo.originalPrice > combo.price && (
                      <span className="text-sm font-bold text-stone-400 line-through">
                        MRP ₹{combo.originalPrice * quantity}
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="text-right">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs inline-block shadow-xs">
                      SAVE ₹{savings * quantity} ({discountPercent}% OFF)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Included Products in this Combo */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-[#FAF8F5] border border-amber-200/70">
              <div className="flex items-center gap-2 text-xs font-black text-forest-950 uppercase tracking-wider">
                <Boxes className="w-4 h-4 text-amber-700" />
                <span>What's Included in This Combo Box:</span>
              </div>

              <div className="space-y-1.5">
                {includedList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-stone-800 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Select Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-stone-100 font-bold text-sm text-stone-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-bold text-xs font-mono text-forest-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 hover:bg-stone-100 font-bold text-sm text-stone-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg cursor-pointer transform active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>✓ Added Combo to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-stone-950" />
                    <span>Add Complete Combo to Cart (₹{combo.price * quantity})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
