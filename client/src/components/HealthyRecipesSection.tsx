import React from 'react';
import { ChefHat, Clock, Droplet, ArrowRight } from 'lucide-react';

interface HealthyRecipesSectionProps {
  onExploreOils: () => void;
}

export const HealthyRecipesSection: React.FC<HealthyRecipesSectionProps> = ({ onExploreOils }) => {
  const recipes = [
    {
      title: 'Crispy Roast Dosa & Spicy Gunpowder',
      oilType: 'Wood-Pressed Sesame (Gingelly) Oil',
      oilQty: '10ml Smart Pour',
      time: '15 mins',
      benefit: 'Rich in natural sesamol & authentic South Indian aroma',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Traditional Coastal Fish Curry / Meen Kuzhambu',
      oilType: 'Pure Cold-Pressed Virgin Coconut Oil',
      oilQty: '15ml Smart Pour',
      time: '25 mins',
      benefit: 'Packed with 64% Lauric Acid for gut health & coastal flavor',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Aromatic Temple Style Sambar & Tadka',
      oilType: 'Everyday Pure Cooking Oil',
      oilQty: '10ml Smart Pour',
      time: '20 mins',
      benefit: 'High smoke point that captures native mustard & curry leaf aroma',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-cream-50/50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-2">
              <ChefHat className="w-3.5 h-3.5 text-gold-600" />
              <span>Healthy Kitchen Swaps</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
              Cook Healthier with Pure Oils
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">
              Authentic traditional recipes made with controlled, healthy portions and pure wood-pressed aroma.
            </p>
          </div>

          <button
            onClick={onExploreOils}
            className="self-start md:self-auto text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All Cooking Oils</span>
            <ArrowRight className="w-4 h-4 text-gold-600" />
          </button>
        </div>

        {/* 3 Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {recipes.map((recipe, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-cream-200">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Time & Qty Badges */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-forest-950 shadow-xs backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-gold-600" />
                    <span>{recipe.time}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-forest-950/90 text-gold-300 shadow-xs border border-gold-500/30 backdrop-blur-xs">
                    <Droplet className="w-3 h-3 text-gold-400" />
                    <span>{recipe.oilQty}</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5">
                  <span className="text-[11px] font-semibold text-cream-200 block uppercase tracking-wider">
                    {recipe.oilType}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {recipe.benefit}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-200">
                  <button
                    onClick={onExploreOils}
                    className="w-full py-2.5 rounded-xl bg-cream-100 group-hover:bg-forest-950 text-forest-950 group-hover:text-cream-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Pure Cooking Oils</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
