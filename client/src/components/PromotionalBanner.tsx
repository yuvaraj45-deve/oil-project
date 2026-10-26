import React from 'react';
import { ArrowRight, Check, Droplets } from 'lucide-react';

interface PromotionalBannerProps {
  onShopCollection: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onShopCollection }) => {
  return (
    <section className="py-12 sm:py-16 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-forest-950 border border-forest-800">
          
          {/* Background Image with Opacity & Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=80"
              alt="Authentic traditional cooking with edible oil"
              className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity filter saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/95 to-forest-950/80" />
            
            {/* Golden radial aura */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 lg:py-20 max-w-3xl">
            {/* Sub-badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Droplets className="w-3.5 h-3.5 text-gold-400" />
              <span>Experience The Difference</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
              Bring Quality to Your Kitchen
            </h2>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-cream-200/90 leading-relaxed font-light">
              Elevate every sambar, tadka, sauté, and sweet delight with unadulterated cold-pressed oils. Our time-tested wood pressing process captures the true soul, golden color, and aroma of freshly harvested seeds.
            </p>

            {/* Feature Checklist */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-cream-100">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Zero chemical processing or bleaching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Rich in natural Vitamin E & antioxidants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Safe packaging with tamper-evident seal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Direct delivery from village press to doorstep</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onShopCollection}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-base transition-all duration-200 shadow-lg hover:shadow-gold-glow flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-xs text-cream-300/80 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-gold-400" />
                <span>Sample starter packs available with easy returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
