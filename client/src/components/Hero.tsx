import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onSelectCategory }) => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides matching the exact screenshot from gemedible.com
  const slides = [
    {
      id: 'conveyor-bottling',
      bannerImage: '/banners/gemedible_exact_hero_banner.jpg',
      headline: (
        <>
          {language === 'ta' ? (
            <>காலமற்ற தூய்மை,<br />நவீன வசதி</>
          ) : (
            <>Timeless Purity,<br />Modern Convenience</>
          )}
        </>
      ),
      subheadline:
        language === 'ta'
          ? 'எங்களின் நவீன, பயன்படுத்த எளிதான பேக்கேஜிங்கில் பாரம்பரிய எண்ணெய்களின் செழுமையை அனுபவியுங்கள்.'
          : 'Experience the richness of traditional oils in our modern, easy-to-use packaging',
      buttonText: language === 'ta' ? 'இப்போதே வாங்க' : 'SHOP NOW',
      category: 'all',
    },
    {
      id: 'groundnut-tradition',
      bannerImage: '/banners/groundnut_hero_banner.jpg',
      headline: (
        <>
          {language === 'ta' ? (
            <>பாரம்பரியத்தில் வேரூன்றி,<br />நிகழ்காலத்திற்கு</>
          ) : (
            <>Rooted in Tradition,<br />Made for Today</>
          )}
        </>
      ),
      subheadline:
        language === 'ta'
          ? 'வாகை மரச்செக்கில் 42°C-க்கு கீழ் இயற்கை வெப்பமின்றிக் கடையப்பட்ட 100% தூய கடலை எண்ணெய்.'
          : '100% Cold-Pressed Mara Chekku Groundnut Oil crafted with decades of heritage and zero chemical refining.',
      buttonText: language === 'ta' ? 'கடலை எண்ணெய் வாங்க' : 'SHOP NOW',
      category: 'groundnut-oil',
    },
    {
      id: 'sesame-sunflower',
      bannerImage: '/banners/sesame_sunflower_banner.jpg',
      headline: (
        <>
          {language === 'ta' ? (
            <>தூய நல்லெண்ணெய் &<br />சூரியகாந்தி எண்ணெய்</>
          ) : (
            <>Pure Gingelly &<br />Refined Sunflower Oil</>
          )}
        </>
      ),
      subheadline:
        language === 'ta'
          ? 'முதல்தர நாட்டு எள்ளுடன் பனை கருப்பட்டி கலந்த நல்லெண்ணெய் மற்றும் ரசாயனமற்ற நீராவி சூரியகாந்தி எண்ணெய்.'
          : 'Slow-churned with organic palm karupatti for authentic flavor, paired with chemical-free steam refined sunflower oil.',
      buttonText: language === 'ta' ? 'நல்லெண்ணெய் வாங்க' : 'SHOP NOW',
      category: 'sesame-oil',
    },
    {
      id: 'smart-dispenser',
      bannerImage: '/banners/smart_measuring_banner.jpg',
      headline: (
        <>
          {language === 'ta' ? (
            <>ஸ்மார்ட் அளவீடு,<br />சொட்டு சிந்தாத மூடி</>
          ) : (
            <>Smart Dosage,<br />Zero Mess Pouring</>
          )}
        </>
      ),
      subheadline:
        language === 'ta'
          ? 'உள்ளமைக்கப்பட்ட 10ml, 20ml, 30ml சேம்பர் மற்றும் ஆன்டி-டிரிப் ஸ்பவுட்டுடன் கூடிய பிரத்யேக ஸ்மார்ட் பாட்டில்.'
          : 'Built-in 10ml, 20ml & 30ml measuring chamber dispenser keeping your kitchen countertops spotless and clean.',
      buttonText: language === 'ta' ? 'ஸ்மார்ட் பாட்டில் வாங்க' : 'SHOP NOW',
      category: 'cooking-oil',
    },
  ];

  // Static banner - strictly NO auto-movement (hero section move aga vena)
  const activeSlide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-black text-white select-none w-full"
    >
      {/* Full-Bleed Hero Banner Viewport - STATIC */}
      <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[620px] overflow-hidden">
        {/* Background Banner Image */}
        <div className="absolute inset-0">
          <img
            src={activeSlide.bannerImage}
            alt="Gem Edible Oils Hero Banner"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Text Overlay - Left Aligned */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-5 sm:px-10 lg:px-14 flex flex-col justify-center">
          <div className="max-w-xl sm:max-w-2xl space-y-4 sm:space-y-5 animate-fadeIn">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-lg">
              {activeSlide.headline}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/95 font-normal leading-relaxed drop-shadow-md max-w-lg">
              {activeSlide.subheadline}
            </p>
            <div className="pt-2 sm:pt-3">
              <button
                onClick={() => {
                  if (onSelectCategory && activeSlide.category !== 'all') {
                    onSelectCategory(activeSlide.category);
                  }
                  onShopNow();
                }}
                className="px-8 sm:px-10 py-3 sm:py-3.5 bg-[#f59e0b] hover:bg-[#fbbf24] active:bg-[#d97706] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-150 shadow-md cursor-pointer rounded-none"
              >
                {activeSlide.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Right Arrow Navigation Chevron (Visible in screenshot) */}
        <button
          onClick={handleNext}
          aria-label="Next Banner Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-2 transition-all cursor-pointer hover:scale-125 focus:outline-none"
        >
          <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
};
