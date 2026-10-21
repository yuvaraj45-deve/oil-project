import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Flame, Droplets, ArrowRight, FileText } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, packSize: string, quantity: number) => void;
  onViewLabReport?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewLabReport,
}) => {
  if (!product) return null;

  const [selectedPack, setSelectedPack] = useState(product.defaultPack);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedPack, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-3xl my-8 text-left align-middle transition-all transform bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-cream-300">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Image Section */}
            <div className="md:col-span-5 bg-cream-100 p-6 flex flex-col justify-between relative">
              <div className="relative h-72 md:h-full rounded-2xl overflow-hidden bg-white border border-cream-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-forest-900 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 text-cream-100 text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                  Sample Data
                </div>
              </div>

              {/* Lab Report Quick CTA Button */}
              {product.labReport && onViewLabReport && (
                <button
                  onClick={() => onViewLabReport(product)}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Batch Lab Analysis</span>
                </button>
              )}
            </div>

            {/* Right Information Section */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider bg-forest-50 px-2 py-0.5 rounded">
                  {product.categoryName}
                </span>

                <h3 className="text-2xl font-serif font-bold text-forest-950 mt-1.5">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {product.tagline}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-800">
                    {product.rating}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({product.reviewsCount} sample reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 pt-2 border-t border-cream-200">
                <span className="text-2xl font-serif font-bold text-forest-950">
                  ₹{product.price}
                </span>
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.discountPercent}% Off
                </span>
                <span className="text-[10px] text-stone-400 block ml-auto">
                  Sample pricing
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Extraction Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-cream-100/70 p-3 rounded-xl border border-cream-200">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Droplets className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span className="truncate">{product.extractionMethod}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{product.smokePoint}</span>
                </div>
              </div>

              {/* Benefits bullets */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-700 block">
                  Pure Health Highlights:
                </span>
                <ul className="text-[11px] text-stone-600 space-y-0.5 pl-1">
                  {product.benefits.slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pack Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Pack Size:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.packSizes.map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-center truncate cursor-pointer ${
                        selectedPack === pack
                          ? 'bg-forest-900 text-cream-100 font-semibold shadow-xs'
                          : 'bg-cream-100 text-stone-700 hover:bg-cream-200 border border-cream-300'
                      }`}
                    >
                      {pack}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="pt-3 border-t border-cream-200 flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-forest-900 hover:bg-forest-800 text-cream-100 shadow-md'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • ₹{product.price * quantity}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
