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
  // Standing bottles matching gemedible.com screenshot: Groundnut, Sunflower, Mustard, Lamp, Sesame, Coconut
  const categories: CategoryItem[] = [
    {
      id: 'groundnut',
      name: 'Groundnut Oil',
      slug: 'groundnut-oil',
      image: '/products/groundnut_oil.jpg',
    },
    {
      id: 'sunflower',
      name: 'Sunflower Oil',
      slug: 'cooking-oil',
      image: '/products/sunflower_oil.jpg',
    },
    {
      id: 'mustard',
      name: 'Mustard Oil',
      slug: 'cooking-oil',
      image: '/products/mustard_oil.jpg',
    },
    {
      id: 'lamp',
      name: 'Lamp Oil',
      slug: 'pooja-special',
      image: '/products/lamp_oil.jpg',
    },
    {
      id: 'sesame',
      name: 'Sesame Oil',
      slug: 'sesame-oil',
      image: '/products/sesame_oil.jpg',
    },
    {
      id: 'coconut',
      name: 'Coconut Oil',
      slug: 'coconut-oil',
      image: '/products/coconut_oil.jpg',
    },
  ];

  // Duplicate categories for continuous seamless infinite loop
  const marqueeCategories = [...categories, ...categories];

  return (
    <div className="w-full bg-white border-b border-stone-200/90 py-4 sm:py-6 overflow-hidden select-none relative">
      {/* Left and Right Fade Edge Gradients */}
      <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Continuous Infinite Horizontal Moving Track (Right to Left) */}
      <div className="animate-bottles-marquee flex items-end gap-8 sm:gap-14 px-4">
        {marqueeCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => onSelectCategory(cat.slug)}
              title={cat.name}
              className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Standing Bottle Presentation with Shadow - ONLY BOTTLE */}
              <div className="relative h-32 sm:h-40 lg:h-48 w-24 sm:w-28 lg:w-32 flex items-end justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none"
                />
                {/* Subtle Floor Shadow */}
                <div className="absolute -bottom-1 w-16 h-2.5 bg-black/15 blur-xs rounded-full pointer-events-none group-hover:scale-115 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
