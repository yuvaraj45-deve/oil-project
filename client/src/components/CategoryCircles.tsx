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

  return (
    <div className="w-full bg-white border-b border-stone-200/90 py-4 sm:py-6 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Row of Standing Bottles */}
        <div className="flex items-end justify-center sm:justify-around gap-6 sm:gap-10 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Standing Bottle Presentation with Shadow */}
                <div className="relative h-28 sm:h-36 lg:h-44 w-20 sm:w-24 lg:w-28 flex items-end justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle Floor Shadow */}
                  <div className="absolute -bottom-1 w-14 h-2 bg-black/15 blur-xs rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* Bottle Title Label - matching exact reddish-brown serif typography */}
                <span className={`mt-2 text-xs sm:text-[13px] font-serif font-bold tracking-tight text-center transition-colors ${
                  isSelected ? 'text-[#b32d2e] underline font-extrabold' : 'text-[#8b2b2b] group-hover:text-[#b32d2e]'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
