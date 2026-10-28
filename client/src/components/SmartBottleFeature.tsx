import React from 'react';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface SmartBottleFeatureProps {
  onShopOils: () => void;
  onSelectProductSlug?: (slug: string) => void;
}

export const SmartBottleFeature: React.FC<SmartBottleFeatureProps> = ({ onShopOils, onSelectProductSlug }) => {
  const { language } = useLanguage();
  const { products } = useStore();

  const groundnutProd = products.find((p) => p.category === 'groundnut-oil' || p.name.includes('Groundnut'));
  const sunflowerProd = products.find((p) => p.category === 'cooking-oil' || p.name.includes('Sunflower'));
  const mustardProd = products.find((p) => p.category === 'mustard-oil' || p.name.includes('Mustard') || p.category === 'sesame-oil');
  const nithyamProd = products.find((p) => p.category === 'pooja-special' || p.name.includes('Lamp') || p.name.includes('Deepam'));

  const handleCardClick = (slug: string) => {
    if (onSelectProductSlug) {
      onSelectProductSlug(slug);
    } else {
      onShopOils();
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] text-stone-900 relative overflow-hidden">
      
      {/* Subtle Warm Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'ta'
                ? '100% இயற்கை மரச்செக்கு பாரம்பரியம்'
                : '100% Cold-Pressed Organic Heritage'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#261E16] tracking-tight leading-tight">
            {language === 'ta'
              ? 'மண்ணின் மணத்தோடு வாகை மரச்செக்கு தூய்மை'
              : 'From Native Soil to Pure Golden Drops'}
          </h2>

          <p className="text-stone-600 text-base sm:text-lg font-normal leading-relaxed">
            {language === 'ta'
              ? 'ரசாயன கலப்பற்ற நாட்டு விதைகள், பழங்கால வாகை மரச்செக்கின் மெதுவான ஆட்டல், மற்றும் சூரிய ஒளியில் உருவான அசல் இயற்கை சமையல் எண்ணெய்.'
              : 'Pure Mara Chekku oil crafted from chemical-free, pesticide-free native seeds crushed in authentic Vaagai wood pestles without artificial heat, refining, or solvents.'}
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mx-auto rounded-full" />
        </div>

        {/* 4 Product Showcase Cards Matching the Brand Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Cold-Pressed Groundnut Oil */}
          <div
            onClick={() => handleCardClick('groundnut-oil')}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div className="bg-[#FEF7DE] rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-stone-200/60 shadow-xs group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
              <img
                src="/showcase/showcase_groundnut.png"
                alt="Cold-Pressed Groundnut Oil"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3 text-center sm:text-left">
              <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors">
                {language === 'ta' ? (groundnutProd?.tamilName || 'மரச்செக்கு கடலை எண்ணெய்') : (groundnutProd?.name || 'Cold-Pressed Groundnut Oil')}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                {language === 'ta' ? `ரூ. ${groundnutProd?.price || 199}.00 முதல்` : `From Rs. ${groundnutProd?.price || 199}.00`}
              </p>
            </div>
          </div>

          {/* Card 2: Physically-Refined Sunflower Oil */}
          <div
            onClick={() => handleCardClick('cooking-oil')}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div className="bg-[#FEECE2] rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-stone-200/60 shadow-xs group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
              <img
                src={sunflowerProd?.image || "/showcase/showcase_sunflower.png"}
                alt="Physically-Refined Sunflower Oil"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3 text-center sm:text-left">
              <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors">
                {language === 'ta' ? (sunflowerProd?.tamilName || 'சூரியகாந்தி எண்ணெய்') : (sunflowerProd?.name || 'Physically-Refined Sunflower Oil')}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                {language === 'ta' ? `ரூ. ${sunflowerProd?.price || 250}.00 முதல்` : `From Rs. ${sunflowerProd?.price || 250}.00`}
              </p>
            </div>
          </div>

          {/* Card 3: Cold-Pressed Mustard Oil */}
          <div
            onClick={() => handleCardClick('sesame-oil')}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div className="bg-[#EAF8E8] rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-stone-200/60 shadow-xs group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 relative">
              {mustardProd && !mustardProd.inStock && (
                <span className="absolute top-3 left-3 bg-stone-300/80 backdrop-blur-xs text-stone-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10">
                  {language === 'ta' ? 'விற்றுத் தீர்ந்தது' : 'Sold out'}
                </span>
              )}
              <img
                src={mustardProd?.image || "/showcase/showcase_mustard.png"}
                alt="Cold-Pressed Mustard Oil"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3 text-center sm:text-left">
              <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors">
                {language === 'ta' ? (mustardProd?.tamilName || 'கடுகு எண்ணெய்') : (mustardProd?.name || 'Cold-Pressed Mustard Oil')}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                Rs. {mustardProd?.price || 299}.00
              </p>
            </div>
          </div>

          {/* Card 4: Nithyam Lamp Oil Festive Offer */}
          <div
            onClick={() => handleCardClick('pooja-oil')}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div className="bg-[#FAF3EA] rounded-3xl overflow-hidden aspect-square flex items-center justify-center border border-stone-200/60 shadow-xs group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
              <img
                src="/showcase/showcase_nithyam.png"
                alt="Nithyam Lamp Oil Festive Offer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3 text-center sm:text-left">
              <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors line-clamp-1">
                {language === 'ta'
                  ? (nithyamProd?.tamilName || 'நித்யம் தீப எண்ணெய் (2x1L + 250ml இலவசம்)')
                  : (nithyamProd?.name || 'Nithyam Lamp Oil (Buy 2x1L and get 250ml free)')}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-xs text-stone-400 line-through">
                  Rs. {nithyamProd?.originalPrice || 1199}.00
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#8B2522]">
                  Rs. {nithyamProd?.price || 999}.00
                </span>
                <span className="bg-[#8B2522] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  -{nithyamProd?.discountPercent || 16}%
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
