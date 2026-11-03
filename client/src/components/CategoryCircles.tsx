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
  const rawBottles =
    standingBottles !== undefined && standingBottles !== null
      ? standingBottles.filter((b) => b.enabled !== false)
      : DEFAULT_STANDING_BOTTLES;

  let seenSesame = false;
  const bottles = rawBottles.map((b) => {
    if (
      b.id === 'bottle-can' ||
      b.name.toLowerCase().includes('ss oil can') ||
      b.name.toLowerCase().includes('oil can') ||
      b.image.includes('ss_oil_can') ||
      b.id === 'bottle-ricebran' ||
      b.name.toLowerCase().includes('rice') ||
      b.image.includes('rice_bran') ||
      b.image.includes('photo-1474979266404-7eaacbcd87c5')
    ) {
      return {
        ...b,
        id: 'bottle-groundnut',
        name: 'Groundnut Oil',
        tamilName: 'மரச்செக்கு கடலை எண்ணெய்',
        slug: 'groundnut-oil',
        image: '/products/groundnut_oil.png',
      };
    }
    if (b.name.toLowerCase().includes('new pure') || b.image.includes('sesame_oil')) {
      if (!seenSesame) {
        seenSesame = true;
        return {
          ...b,
          id: 'bottle-sesame',
          name: 'Sesame Oil',
          tamilName: 'மரச்செக்கு நல்லெண்ணெய்',
          slug: 'sesame-oil',
          image: '/products/sesame_oil.png',
        };
      } else {
        return {
          ...b,
          id: 'bottle-ricebran',
          name: 'Rice Bran Oil',
          tamilName: 'தூய தவிட்டு எண்ணெய்',
          slug: 'cooking-oil',
          image: '/products/rice_bran_oil.png',
        };
      }
    }
    if (b.image && b.image.includes('unsplash')) {
      if (b.slug === 'coconut-oil' || b.name.toLowerCase().includes('coconut')) {
        return { ...b, image: '/products/coconut_oil.png' };
      }
      if (b.slug === 'sesame-oil' || b.name.toLowerCase().includes('sesame')) {
        return { ...b, image: '/products/sesame_oil.png' };
      }
      if (b.slug === 'groundnut-oil' || b.name.toLowerCase().includes('groundnut')) {
        return { ...b, image: '/products/groundnut_oil.png' };
      }
      if (b.slug === 'pooja-special' || b.name.toLowerCase().includes('lamp') || b.name.toLowerCase().includes('pooja')) {
        return { ...b, image: '/products/lamp_oil.png' };
      }
      return { ...b, image: '/products/groundnut_oil.png' };
    }
    return b;
  });

  if (!bottles || bottles.length === 0) {
    return null;
  }

  // Double duplicate for smooth infinite continuous loop from right to left
  const baseList = [...bottles, ...bottles];
  const marqueeBottles = [...baseList, ...baseList];

  return (
    <div className="w-full bg-white border-b border-stone-200/90 py-4 sm:py-6 select-none relative overflow-hidden">
      {/* Moving Oil Cans / Standing Bottles Marquee (Right to Left Continuous Motion) */}
      <div className="flex overflow-hidden relative w-full">
        <div className="flex items-end gap-10 sm:gap-14 md:gap-16 lg:gap-20 animate-bottles-marquee py-2 pr-10 sm:pr-14 md:pr-16 lg:pr-20">
          {marqueeBottles.map((bottle, idx) => {
            const isSelected = selectedCategory === bottle.slug;
            const displayName =
              language === 'ta' && bottle.tamilName ? bottle.tamilName : bottle.name;

            return (
              <button
                key={`${bottle.id}-${idx}`}
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
