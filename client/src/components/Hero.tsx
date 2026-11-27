import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCMS } from '../context/CMSContext';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onSelectCategory }) => {
  const { language } = useLanguage();
  const { siteContent } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const homeCms = siteContent?.home?.status === 'PUBLISHED' ? siteContent.home : null;

  // Slides matching the flagship homepage layout
  const slides = [
    {
      id: '3-generations-heritage',
      bannerImage: '/banners/ssoil_3generations_hero_banner.jpg',
      headline: (
        <>
          {language === 'ta' ? (
            homeCms?.heroTamilTitle || (
              <>
                பாரம்பரிய வாகை மரச்செக்கு
                <br />
                தூய எண்ணெய்கள்
              </>
            )
          ) : (
            homeCms?.heroTitle || (
              <>
                Pure Mara Chekku
                <br />
                Cold-Pressed Oils
              </>
            )
          )}
        </>
      ),
      subheadline:
        language === 'ta'
          ? homeCms?.heroTamilSubtitle ||
            'எங்களின் நவீன, பயன்படுத்த எளிதான பேக்கேஜிங்கில் பாரம்பரிய எண்ணெய்களின் செழுமையை அனுபவியுங்கள்.'
          : homeCms?.heroSubtitle ||
            'Timeless Purity, Modern Convenience',
      buttonText:
        language === 'ta'
          ? homeCms?.buttonTamilText || 'இப்போதே வாங்க'
          : homeCms?.buttonText || 'SHOP NOW',
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

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide every 5 seconds (5000ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  const activeSlide = slides[currentSlide];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0a1e12] text-white select-none w-full max-w-none p-0 m-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Width Compact Hero Viewport: Edge-to-edge width cover (Mobile: 250px, Tablet: 340px, Desktop: 420px) */}
      <div className="relative w-full max-w-none h-[250px] sm:h-[340px] lg:h-[420px] overflow-hidden p-0 m-0">

        {/* Full-Width Foreground Banner Images - 100% Width Cover (object-fit: cover, object-position: center center) */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full max-w-none transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.bannerImage}
                alt={`SS OIL Hero Banner ${index + 1}`}
                className="w-full h-full object-cover object-center pointer-events-none select-none max-w-none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Minimal Soft Scrim - Keeps text overlay legible without hiding the banner details */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />

        {/* Text Overlay - Clean, elegant left-aligned title & Shop Now button */}
        <div className="absolute inset-0 z-20 max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-14 flex flex-col justify-center pointer-events-none">
          <div
            key={currentSlide}
            className="pointer-events-auto max-w-xs sm:max-w-md lg:max-w-lg space-y-1.5 sm:space-y-2.5 animate-fadeIn"
          >
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              {activeSlide.headline}
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-md line-clamp-2 sm:line-clamp-none">
              {activeSlide.subheadline}
            </p>
            <div className="pt-0.5 sm:pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onSelectCategory && activeSlide.category !== 'all') {
                    onSelectCategory(activeSlide.category);
                  }
                  onShopNow();
                }}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#f59e0b] hover:bg-[#fbbf24] active:bg-[#d97706] text-black font-extrabold text-[10px] sm:text-xs md:text-sm tracking-wider uppercase transition-all duration-150 shadow-lg cursor-pointer rounded-none hover:scale-105 active:scale-95"
              >
                {activeSlide.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={handlePrev}
          aria-label="Previous Banner Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-1 sm:p-1.5 transition-all cursor-pointer hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 stroke-[2.5]" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={handleNext}
          aria-label="Next Banner Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-1 sm:p-1.5 transition-all cursor-pointer hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 stroke-[2.5]" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-1.5 sm:space-x-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                idx === currentSlide
                  ? 'w-6 sm:w-8 bg-[#f59e0b]'
                  : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/90 drop-shadow'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

