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
      className="relative overflow-hidden bg-[#0a1e12] text-white select-none w-full p-0 m-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sleek Reduced Height Hero Viewport: Exactly proportioned, full image completely visible */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px] overflow-hidden flex items-center justify-center">

        {/* Ambient Blurred Backdrop - Fills entire screen width with matching natural colors (zero white gaps) */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={`bg-${slide.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-50 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.bannerImage}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover blur-2xl scale-110 brightness-60 pointer-events-none select-none"
              />
            </div>
          );
        })}

        {/* High-Resolution Crisp Foreground Image - 100% FULL Image Visible, ZERO Cropping */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.bannerImage}
                alt={`SS OIL Hero Banner ${index + 1}`}
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-2xl"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Subtle Scrim for text readability on left side */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/45 via-black/10 to-transparent pointer-events-none" />

        {/* Top-Right Brand Badge with User's Golden Drop Logo */}
        <div className="absolute top-2.5 right-3 sm:top-4 sm:right-6 z-20 flex items-center gap-2 bg-[#06180d]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/50 shadow-xl pointer-events-none">
          <img
            src="/admin_assets/ss_gold_drop_logo.png"
            alt="SS OIL Logo"
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain drop-shadow"
          />
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-300 uppercase font-serif">
            SS OIL
          </span>
        </div>

        {/* Text Overlay - Left Aligned with smooth animation & user logo */}
        <div className="absolute inset-0 z-20 max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-14 flex flex-col justify-center pointer-events-none">
          <div
            key={currentSlide}
            className="pointer-events-auto max-w-xs sm:max-w-md lg:max-w-lg space-y-2 sm:space-y-3 animate-fadeIn"
          >
            {/* User Logo Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06180d]/90 border border-amber-400/60 shadow-md backdrop-blur-xs">
              <img
                src="/admin_assets/ss_gold_drop_logo.png"
                alt="SS OIL Logo"
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              />
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-amber-300 font-serif uppercase">
                SS OIL • Traditional Mara Chekku
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              {activeSlide.headline}
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-md">
              {activeSlide.subheadline}
            </p>
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onSelectCategory && activeSlide.category !== 'all') {
                    onSelectCategory(activeSlide.category);
                  }
                  onShopNow();
                }}
                className="group inline-flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 bg-[#f59e0b] hover:bg-[#fbbf24] active:bg-[#d97706] text-black font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase transition-all duration-150 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
              >
                <img
                  src="/admin_assets/ss_gold_drop_logo.png"
                  alt="SS Oil"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
                <span>{activeSlide.buttonText}</span>
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-amber-400 flex items-center justify-center font-black group-hover:translate-x-1 transition-transform text-[9px] sm:text-xs">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={handlePrev}
          aria-label="Previous Banner Slide"
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-1.5 sm:p-2 transition-all cursor-pointer hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 stroke-[2.5]" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={handleNext}
          aria-label="Next Banner Slide"
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white p-1.5 sm:p-2 transition-all cursor-pointer hover:scale-110 focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 stroke-[2.5]" />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-1.5 sm:space-x-2">
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

