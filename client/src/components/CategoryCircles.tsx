import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_STANDING_BOTTLES } from '../types';

interface CategoryCirclesProps {
  onSelectCategory?: (slug: string) => void;
  selectedCategory?: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { language } = useLanguage();
  const { standingBottles } = useStore();

  const isCorrupt = (b: any) =>
    !b ||
    !b.name ||
    b.name.toLowerCase().includes('new pure') ||
    b.name.toLowerCase().includes('ss oil can') ||
    b.name.toLowerCase().includes('oil can') ||
    b.image?.includes('ss_oil_can') ||
    b.image?.includes('unsplash') ||
    b.image?.includes('photo-');

  const rawBottles =
    standingBottles && standingBottles.length >= 7 && !standingBottles.some(isCorrupt) && standingBottles[0]?.slug === 'groundnut-oil'
      ? standingBottles.filter((b) => b.enabled !== false)
      : DEFAULT_STANDING_BOTTLES;

  const bottles = rawBottles;

  if (!bottles || bottles.length === 0) {
    return null;
  }

  // Exactly two sets (Set A: all 7 bottles in sequence, Set B: all 7 bottles in sequence)
  // Ensures all 7 bottles complete their sequence from 1 to 7 before repeating from 1
  const marqueeBottles = [...bottles, ...bottles];

  return (
    <div className="w-full bg-white border-b border-stone-200/90 pt-0.5 pb-1 sm:pb-1.5 select-none relative overflow-hidden">
      {/* Moving Oil Cans / Standing Bottles Marquee (Right to Left Continuous Motion) */}
      <div className="flex overflow-hidden relative w-full">
        <div className="flex items-end gap-8 sm:gap-12 md:gap-14 lg:gap-16 animate-bottles-marquee pt-0 pb-0.5 pr-8 sm:pr-12 md:pr-14 lg:pr-16">
          {marqueeBottles.map((bottle, idx) => {
            const rawDisplayName =
              language === 'ta' && bottle.tamilName ? bottle.tamilName : bottle.name;
            const displayName = rawDisplayName.startsWith('SS OIL')
              ? rawDisplayName
              : `SS OIL ${rawDisplayName.replace(/^SS\s+/i, '')}`;

            return (
              <div
                key={`${bottle.id}-${idx}`}
                title={displayName}
                className="group flex flex-col items-center shrink-0 select-none cursor-default"
              >
                {/* Standing Bottle Presentation with Floor Shadow - 100% Transparent PNG */}
                <div className="relative h-20 sm:h-24 lg:h-28 w-14 sm:w-16 lg:w-20 flex items-end justify-center pointer-events-none select-none">
                  <img
                    src={bottle.image}
                    alt={displayName}
                    onError={(e) => {
                      e.currentTarget.src = '/products/sesame_oil.jpg?v=ssoil';
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.14)] pointer-events-none select-none"
                  />
                  {/* Subtle Floor Shadow */}
                  <div className="absolute -bottom-1 w-12 sm:w-14 h-1.5 bg-black/15 blur-xs rounded-full pointer-events-none" />
                </div>

                {/* Bottle Title Label with user-provided SS OIL logo */}
                <div className="mt-1 sm:mt-1.5 flex items-center justify-center gap-1.5 select-none">
                  <img
                    src="/admin_assets/ss_gold_drop_logo.png"
                    alt="SS Oil"
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                  <span className="text-xs sm:text-[13px] font-serif font-bold tracking-tight text-center text-[#8B2323] whitespace-nowrap select-none">
                    {displayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
