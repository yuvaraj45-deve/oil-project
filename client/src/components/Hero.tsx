import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Award, Droplets, Leaf, Star } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts: () => void;
  onQuickViewSample: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onExploreProducts,
  onQuickViewSample,
}) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-cream-50 to-cream-100/60 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-cream-200">
      
      {/* Subtle Ambient Light Reflections */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] rounded-full bg-gold-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-forest-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/10 border border-forest-800/15 text-forest-900 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-gold-600 fill-gold-600" />
              <span>100% Pure Traditional Wood-Pressed & Cold-Pressed</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-forest-950 tracking-tight leading-[1.12]">
              Pure Quality.{' '}
              <span className="relative inline-block text-forest-800">
                Every Drop.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-gold-400"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,10 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover quality oils for your everyday cooking. Slow-extracted from sun-ripened seeds using traditional wooden churns to preserve authentic aroma, vitamins, and heartfelt health.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-base transition-all duration-200 shadow-md hover:shadow-card hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-cream-50 text-forest-900 font-bold text-base border-2 border-forest-900/20 hover:border-forest-900/40 transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Products</span>
              </button>
            </div>

            {/* 4 Trust Proof Indicators */}
            <div className="pt-6 border-t border-cream-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cream-200/80 flex items-center justify-center text-forest-800 shrink-0">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Zero Chemicals</div>
                  <div className="text-[11px] text-stone-500">Unrefined Purity</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cream-200/80 flex items-center justify-center text-forest-800 shrink-0">
                  <Droplets className="w-4 h-4 text-gold-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Cold Pressed</div>
                  <div className="text-[11px] text-stone-500">Below 45°C</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cream-200/80 flex items-center justify-center text-forest-800 shrink-0">
                  <Shield className="w-4 h-4 text-forest-800" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Lab Certified</div>
                  <div className="text-[11px] text-stone-500">24 Quality Checks</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cream-200/80 flex items-center justify-center text-forest-800 shrink-0">
                  <Award className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Heritage Churn</div>
                  <div className="text-[11px] text-stone-500">Traditional Taste</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Product Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/25 via-forest-700/15 to-transparent rounded-3xl transform rotate-2 scale-105 filter blur-sm" />

              {/* Main Card Container */}
              <div className="relative bg-white p-4 rounded-3xl shadow-card border border-cream-300 overflow-hidden group">
                <div className="relative h-96 sm:h-[480px] rounded-2xl overflow-hidden bg-cream-100">
                  <img
                    src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=85"
                    alt="SS OIL Premium Edible Oil Bottles"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-forest-900/95 backdrop-blur-md text-cream-100 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-forest-700/60 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                    <span>Pure Harvest Selection</span>
                  </div>

                  {/* Star Rating Overlay */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-stone-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 (1.2k+ reviews)</span>
                  </div>

                  {/* Bottom Glass Card Information */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-cream-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
                        Signature Collection
                      </span>
                      <h4 className="text-base font-bold font-serif text-forest-950 mt-0.5">
                        SS Mara Chekku Heritage Oils
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Sesame, Groundnut, Coconut & Cooking
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 block">Sample Starting</span>
                      <span className="text-xl font-black font-serif text-forest-900">₹210</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Decorative Corner Seal */}
              <div className="absolute -bottom-5 -left-5 bg-gold-500 text-forest-950 p-3.5 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-forest-950 text-gold-400 flex items-center justify-center font-serif font-black text-lg">
                  SS
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Purity Assured</div>
                  <div className="text-[11px] text-forest-950/80 font-semibold">100% Mara Chekku</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
