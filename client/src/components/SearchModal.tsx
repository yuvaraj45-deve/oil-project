import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/oilData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, packSize: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickTerms = ['Groundnut', 'Sesame', 'Coconut', 'Cold-Pressed', 'Mara Chekku'];

  const filtered = query.trim()
    ? PRODUCTS_DATA.filter((p) => {
        const text = `${p.name} ${p.tagline} ${p.categoryName} ${p.description} ${p.extractionMethod}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-cream-300 text-left">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-forest-800 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by oil name, category, or extraction type (e.g. Groundnut, Sesame)..."
              className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="px-5 py-3 bg-cream-100/70 border-b border-cream-200 flex items-center gap-2 flex-wrap text-xs text-stone-500">
            <span className="font-semibold text-stone-600">Quick Searches:</span>
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-cream-200 text-forest-900 border border-cream-300 font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-5 max-h-96 overflow-y-auto space-y-3">
            {query.trim() === '' ? (
              <div className="text-center py-8 text-stone-400 text-xs sm:text-sm">
                <Sparkles className="w-6 h-6 text-gold-500 mx-auto mb-2 opacity-80" />
                <span>Type to search from our range of 100% authentic edible oils.</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                No matching edible oils found for "{query}". Try searching for Groundnut, Sesame, or Coconut.
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-cream-100/80 border border-cream-200 transition-colors gap-3"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-cream-300 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-forest-950 hover:text-forest-700">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {product.extractionMethod}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-forest-900 font-serif">
                          ₹{product.price}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          ({product.defaultPack})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddToCart(product, product.defaultPack);
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-forest-900 text-gold-400 hover:bg-forest-800 transition-colors shadow-xs"
                      title="Quick Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="p-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-cream-200 transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
