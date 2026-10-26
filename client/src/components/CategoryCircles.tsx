import React, { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  badge?: string;
}

interface CategoryCirclesProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory?: string;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);

  const categories: CategoryItem[] = [
    {
      id: 'groundnut',
      name: 'Groundnut Oil',
      slug: 'groundnut-oil',
      image: '/products/groundnut_oil.jpg',
      badge: 'Wood-Pressed',
    },
    {
      id: 'sesame',
      name: 'Sesame (Gingelly) Oil',
      slug: 'sesame-oil',
      image: '/products/sesame_oil.jpg',
      badge: 'Bestseller',
    },
    {
      id: 'coconut',
      name: 'Virgin Coconut Oil',
      slug: 'coconut-oil',
      image: '/products/coconut_oil.jpg',
      badge: 'Raw Cold',
    },
    {
      id: 'sunflower',
      name: 'Sunflower Oil',
      slug: 'cooking-oil',
      image: '/products/sunflower_oil.jpg',
      badge: 'Light & Pure',
    },
    {
      id: 'ricebran',
      name: 'Rice Bran Oil',
      slug: 'cooking-oil',
      image: '/products/rice_bran_oil.jpg',
      badge: 'Heart Care',
    },
    {
      id: 'lamp',
      name: 'Pooja Deepam Oil',
      slug: 'pooja-special',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=400&q=85',
      badge: 'Traditional',
    },
    {
      id: 'jaggery',
      name: 'Palm Jaggery (Karupatti)',
      slug: 'palm-jaggery-special',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=400&q=85',
      badge: 'Native Pure',
    },
    {
      id: 'ghee',
      name: 'A2 Cultured Cow Ghee',
      slug: 'a2-desi-ghee',
      image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=85',
      badge: 'Bilona',
    },
  ];

  // Scroll carousel with smooth zoom animation
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Trigger interactive zoom pulse on click
      setIsZooming(true);
      setTimeout(() => setIsZooming(false), 500);
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-[#fbfaf7] border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Left/Right Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-bold text-forest-800 tracking-[0.18em] uppercase block mb-1">
              PRODUCT CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-forest-950 tracking-tight">
              Explore Our Product Categories
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Carousel Navigation Arrow: Left */}
            <button
              onClick={() => handleScroll('left')}
              aria-label="Scroll categories left"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-forest-950 text-forest-950 hover:text-white border border-stone-300 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Carousel Navigation Arrow: Right (With Zoom trigger) */}
            <button
              onClick={() => handleScroll('right')}
              aria-label="Scroll categories right"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-forest-950 text-forest-950 hover:text-white border border-stone-300 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* View All Text Link */}
            <button
              onClick={() => onSelectCategory('all')}
              className="ml-2 text-xs sm:text-sm font-bold text-forest-900 hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Circular Categories Strip (Bigger circles with close-up zoom) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 scrollbar-none no-scrollbar justify-start scroll-smooth"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group flex flex-col items-center text-center shrink-0 w-28 sm:w-32 lg:w-36 cursor-pointer focus:outline-none"
              >
                {/* Bigger Circle Container with Rich Zoom */}
                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full p-1 transition-all duration-500 ease-out bg-white ${
                    isSelected
                      ? 'ring-4 ring-forest-900 shadow-xl scale-110'
                      : 'border-2 border-stone-200 group-hover:border-amber-500 group-hover:shadow-xl group-hover:scale-105'
                  } ${isZooming ? 'scale-108' : ''}`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ease-out scale-110 group-hover:scale-135 group-active:scale-145 ${
                        isZooming ? 'scale-125' : ''
                      }`}
                    />
                  </div>

                  {/* Subtle Badge Tag */}
                  {cat.badge && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-forest-950 text-amber-300 shadow-sm border border-amber-400/30 whitespace-nowrap">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <span className="mt-3.5 text-xs sm:text-sm font-bold text-forest-950 group-hover:text-amber-800 transition-colors line-clamp-2 leading-tight px-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
