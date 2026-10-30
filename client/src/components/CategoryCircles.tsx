import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

interface CategoryCirclesProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory?: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  // Standing bottles: Groundnut, Sunflower, Mustard, Lamp, Sesame, Coconut (SS OIL pure bottles)
  const categories: CategoryItem[] = [
    {
      id: 'groundnut',
      name: 'Groundnut Oil',
      slug: 'groundnut-oil',
      image: '/products/groundnut_oil.jpg?v=ssoil',
    },
    {
      id: 'sunflower',
      name: 'Sunflower Oil',
      slug: 'cooking-oil',
      image: '/products/sunflower_oil.jpg?v=ssoil',
    },
    {
      id: 'mustard',
      name: 'Mustard Oil',
      slug: 'cooking-oil',
      image: '/products/mustard_oil.jpg?v=ssoil',
    },
    {
      id: 'lamp',
      name: 'Lamp Oil',
      slug: 'pooja-special',
      image: '/products/lamp_oil.jpg?v=ssoil',
    },
    {
      id: 'sesame',
      name: 'Sesame Oil',
      slug: 'sesame-oil',
      image: '/products/sesame_oil.jpg?v=ssoil',
    },
    {
      id: 'coconut',
      name: 'Coconut Oil',
      slug: 'coconut-oil',
      image: '/products/coconut_oil.jpg?v=ssoil',
    },
  ];

  // Duplicate categories for continuous seamless infinite loop
  const marqueeCategories = [...categories, ...categories];

  return (
    <div className="w-full bg-white border-b border-stone-200/90 py-5 sm:py-7 overflow-hidden select-none relative">
      {/* Left and Right Fade Edge Gradients */}
      <div className="absolute left-0 inset-y-0 w-10 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-10 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Continuous Infinite Horizontal Moving Track (Right to Left) with Generous Spacing between Bottles */}
      <div className="animate-bottles-marquee flex items-end gap-16 sm:gap-24 lg:gap-32 px-8 sm:px-14">
        {marqueeCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => onSelectCategory(cat.slug)}
              title={cat.name}
              className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Standing Bottle Presentation with Shadow - 100% Transparent PNG */}
              <div className="relative h-28 sm:h-36 lg:h-44 w-20 sm:w-24 lg:w-28 flex items-end justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.14)] group-hover:scale-108 transition-transform duration-300 pointer-events-none select-none mix-blend-multiply"
                />
                {/* Subtle Floor Shadow */}
                <div className="absolute -bottom-1 w-14 h-2 bg-black/15 blur-xs rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
              </div>

              {/* Bottle Title Label - matching exact reddish-brown serif typography */}
              <span className={`mt-2.5 text-xs sm:text-[13px] font-serif font-bold tracking-tight text-center transition-colors whitespace-nowrap ${
                isSelected ? 'text-[#b32d2e] underline font-extrabold' : 'text-[#8b2b2b] group-hover:text-[#b32d2e]'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
