import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_STANDING_BOTTLES } from '../types';

interface CategoryCirclesProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory?: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { language } = useLanguage();
  const { standingBottles } = useStore();
  const bottles =
    standingBottles !== undefined && standingBottles !== null
      ? standingBottles.filter((b) => b.enabled !== false)
      : DEFAULT_STANDING_BOTTLES;

  if (!bottles || bottles.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-stone-200/90 py-4 sm:py-6 select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Standing Bottles Row: Exact Match to screenshot (Clean standing bottles with names below) */}
        <div className="flex items-end justify-center gap-8 sm:gap-14 md:gap-16 lg:gap-20 overflow-x-auto no-scrollbar py-2">
          {bottles.map((bottle) => {
            const isSelected = selectedCategory === bottle.slug;
            const displayName =
              language === 'ta' && bottle.tamilName ? bottle.tamilName : bottle.name;

            return (
              <button
                key={bottle.id}
                onClick={() => onSelectCategory(bottle.slug)}
                title={displayName}
                className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Standing Bottle Presentation with Floor Shadow - 100% Transparent PNG */}
                <div className="relative h-28 sm:h-36 lg:h-44 w-20 sm:w-24 lg:w-28 flex items-end justify-center">
                  <img
                    src={bottle.image}
                    alt={displayName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.14)] group-hover:scale-108 transition-transform duration-300 pointer-events-none select-none"
                  />
                  {/* Subtle Floor Shadow */}
                  <div className="absolute -bottom-1 w-14 h-2 bg-black/15 blur-xs rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* Bottle Title Label - exact reddish-brown serif font from screenshot */}
                <span
                  className={`mt-2.5 text-xs sm:text-[13px] font-serif font-bold tracking-tight text-center transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-[#8B2323] underline font-extrabold'
                      : 'text-[#8B2323] group-hover:text-[#681818]'
                  }`}
                >
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
