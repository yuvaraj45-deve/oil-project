import React from 'react';
import { ArrowRight, Droplets, ShieldCheck, Check } from 'lucide-react';

interface EasyOilGuideProps {
  onSelectCategory?: (category: string) => void;
  onShopOil?: (oilType: string) => void;
}

export const EasyOilGuide: React.FC<EasyOilGuideProps> = ({ onShopOil }) => {
  const oils = [
    {
      id: 'sesame',
      englishName: 'Wood-Pressed Sesame (Gingelly) Oil',
      tamilSubtitle: 'Traditional Gingelly Oil (Nallennai)',
      badge: 'Best For Gravies & Health',
      badgeColor: 'bg-gold-100 text-forest-950 border-gold-300',
      accentColor: 'from-gold-500/10 to-yellow-500/10 border-gold-300/80',
      price: '₹395 / Litre',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
      bestFor: 'Idli Podi, Sambar, Spicy Gravies & Tadka',
      aroma: 'Cold-churned with natural palm jaggery for smooth aroma',
      health: 'Natural body coolant • Strengthens bones & joints',
      recommendation: 'Must-have for traditional South Indian gravies and hot idlis.',
    },
    {
      id: 'coconut',
      englishName: 'Pure Cold-Pressed Coconut Oil',
      tamilSubtitle: 'Virgin Raw Copra (Thengai Ennai)',
      badge: '100% Pure & Multi-Purpose',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      accentColor: 'from-emerald-500/10 to-teal-500/10 border-emerald-300/80',
      price: '₹320 / Litre',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      bestFor: 'Healthy Cooking, Avial, Hair Care & Glowing Skin',
      aroma: 'Fresh, sweet coconut scent from sun-dried natural copra',
      health: 'Boosts immunity & digestion • 100% Sulphur-free',
      recommendation: 'Safe and pure for healthy cooking, hair growth, and baby massage.',
    },
    {
      id: 'cooking',
      englishName: 'SS Gold Everyday Pure Cooking Oil',
      tamilSubtitle: 'Light, Balanced & Nutrient-Rich Oil',
      badge: 'Best For Modern Kitchens',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      accentColor: 'from-amber-500/10 to-orange-500/10 border-amber-300/80',
      price: '₹210 / Litre',
      image: 'https://images.unsplash.com/photo-1552592074-ea7a91b851b3?auto=format&fit=crop&w=600&q=80',
      bestFor: 'Rotis, Dosa, Pulao, Curries & Everyday Cooking',
      aroma: 'Clean, light, neutral aroma that preserves native spice flavors',
      health: 'Heart-healthy • Low oil absorption formula',
      recommendation: 'The perfect light and non-sticky cooking oil for daily family meals.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-cream-100/60 via-white to-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Simple & Crystal Clear in English) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-950 text-xs font-bold uppercase tracking-wider mb-3">
            <Droplets className="w-3.5 h-3.5 text-gold-600" />
            <span>Simple Oil Guide • Quick & Easy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 tracking-tight leading-tight">
            Which Oil is Best for You?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Short and sweet guide to picking the right wood-pressed oil for your kitchen and family's health.
          </p>
        </div>

        {/* 3 Short & Sweet Oil Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {oils.map((oil) => (
            <div
              key={oil.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${oil.accentColor}`}
            >
              <div>
                {/* Image & Price Strip */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={oil.image}
                    alt={oil.englishName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Top Badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${oil.badgeColor}`}>
                    {oil.badge}
                  </span>

                  {/* Bottom Price on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-medium text-stone-200 font-mono">100% Mara Chekku</span>
                    <span className="text-lg font-black font-serif text-gold-300">{oil.price}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 mb-0.5">
                  {oil.englishName}
                </h3>
                <p className="text-xs font-semibold text-stone-500 mb-4">
                  {oil.tamilSubtitle}
                </p>

                {/* 3 Simple Bullet Points (Easy English) */}
                <div className="space-y-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70 text-xs text-stone-800">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none">🍲</span>
                    <div>
                      <strong className="text-forest-950 block text-[11px] uppercase tracking-wider">Best For</strong>
                      <p className="text-stone-700 font-medium mt-0.5">{oil.bestFor}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-stone-200/60">
                    <span className="text-base leading-none">👃</span>
                    <div>
                      <strong className="text-forest-950 block text-[11px] uppercase tracking-wider">Aroma & Taste</strong>
                      <p className="text-stone-700 font-medium mt-0.5">{oil.aroma}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-stone-200/60">
                    <span className="text-base leading-none">💚</span>
                    <div>
                      <strong className="text-forest-950 block text-[11px] uppercase tracking-wider">Health Benefit</strong>
                      <p className="text-stone-700 font-medium mt-0.5">{oil.health}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation summary */}
                <p className="text-xs text-stone-500 italic mt-3 px-1 leading-relaxed">
                  💡 {oil.recommendation}
                </p>
              </div>

              {/* Direct Order Button */}
              <button
                onClick={() => onShopOil && onShopOil(oil.id)}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>Shop Fresh Batch</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
              </button>
            </div>
          ))}
        </div>

        {/* 4 Simple Points: Why Mara Chekku is Better (Easy English) */}
        <div className="mt-14 bg-forest-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-forest-900">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Why Mara Chekku?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-cream-100">
              Refined Factory Oil vs. SS OIL Mara Chekku
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Unlike factory oils that use boiling heat and chemical solvents, we press slowly in traditional wood to protect 100% of the natural nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-forest-900/60 p-5 rounded-2xl border border-forest-800/80">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center text-lg mb-3">
                🪵
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Vaagai Wood (No Heat)</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Factory machines heat oils up to 200°C destroying vitamins. Our slow wood press stays cool so all natural nutrition is locked in.
              </p>
            </div>

            <div className="bg-forest-900/60 p-5 rounded-2xl border border-forest-800/80">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-lg mb-3">
                🚫
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Zero Chemicals</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                No hexane solvents, no chemical bleaching, no artificial colors, and zero palm oil mixing. 100% pure and unadulterated.
              </p>
            </div>

            <div className="bg-forest-900/60 p-5 rounded-2xl border border-forest-800/80">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center text-lg mb-3">
                🌾
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Direct Farm Seeds</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Sourced directly from trusted village farmers. Hand-cleaned, sun-dried native seeds for rich flavor and aroma.
              </p>
            </div>

            <div className="bg-forest-900/60 p-5 rounded-2xl border border-forest-800/80">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-lg mb-3">
                💧
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Thick Oil = Use 40% Less</h4>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Naturally dense with full authentic aroma. A small spoon gives more flavor than two spoons of factory-refined oil.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
