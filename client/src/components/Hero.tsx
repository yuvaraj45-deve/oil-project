import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Droplet,
  Sparkles,
  Award,
  Check,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onShopNow: () => void;
  onExploreProducts?: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onSelectCategory }) => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Full-Width Flagship Banners matching gemedible.com
  const slides = [
    {
      id: 'groundnut',
      bannerImage: '/banners/groundnut_hero_banner.jpg',
      badge: language === 'ta' ? '🌿 100% மரச்செக்கு • சேலம் மரபு 1957 முதல்' : '🌿 100% MARA CHEKKU • SALEM HERITAGE SINCE 1957',
      title: language === 'ta' ? 'பாரம்பரியத்தில் வேரூன்றி... நிகழ்கால ஆரோக்கியத்திற்கு!' : 'Rooted in Tradition. Made for Today.',
      subtitle: language === 'ta' ? 'பாரம்பரிய மரச்செக்கு கடலை எண்ணெய்' : 'Pure Wood-Pressed Groundnut Oil',
      description:
        language === 'ta'
          ? 'வாகை மரச்செக்கில் 42°C-க்கு கீழ் மெதுவாகக் கடையப்பட்ட தூய கடலை எண்ணெய். ரசாயன கரைப்பான்கள் (Hexane) இன்றி, இயற்கை வைட்டமின் E மற்றும் தனித்துவ மணத்துடன்!'
          : 'Slow-pressed in traditional Vaagai Mara Chekku below 42°C without chemical solvents or artificial refining. Retains natural Vitamin E, golden unadulterated color, and authentic aroma.',
      highlights: [
        language === 'ta' ? '100% மரச்செக்கு முறை' : '100% Cold-Pressed',
        language === 'ta' ? 'இயற்கை வைட்டமின் E' : 'Rich in Vitamin E',
        language === 'ta' ? 'கைகளால் தொடாத தூய்மை' : 'Hands-Free Bottling',
      ],
      category: 'groundnut',
      ctaText: language === 'ta' ? 'கடலை எண்ணெய் வாங்க' : 'Shop Groundnut Oil',
      secondaryCta: language === 'ta' ? 'மரச்செக்கு முறை அறிக' : 'Our Mill Story',
      accentColor: 'from-amber-400 to-yellow-500',
      hotspots: [
        {
          x: '52%',
          y: '35%',
          label: language === 'ta' ? 'ஆரோமா-லாக் காற்றுப்புகா மூடி' : 'Aroma-Lock Tight Seal',
          desc: language === 'ta' ? 'இயற்கை நறுமணத்தைப் பாதுகாக்கும்' : 'Shields natural volatile aromas',
        },
        {
          x: '48%',
          y: '65%',
          label: language === 'ta' ? '0% ரசாயனம் (ஹெக்ஸேன் இல்லை)' : 'Zero Chemical Solvent (No Hexane)',
          desc: language === 'ta' ? '100% மரச்செக்கு சான்றிதழ்' : 'Certified 100% pure cold pressed',
        },
      ],
    },
    {
      id: 'sesame-sunflower',
      bannerImage: '/banners/sesame_sunflower_banner.jpg',
      badge: language === 'ta' ? '✨ தூய கருப்பட்டி நல்லெண்ணெய் & சூரியகாந்தி' : '✨ TAMIL HERITAGE • GINGELLY & SUNFLOWER',
      title: language === 'ta' ? 'தமிழர் பாரம்பரியத்தின் தூய திரவத் தங்கம்' : 'The Liquid Gold of Tamil Heritage',
      subtitle: language === 'ta' ? 'மரச்செக்கு நல்லெண்ணெய் & தூய சூரியகாந்தி எண்ணெய்' : 'Wood-Pressed Gingelly & Refined Sunflower Oil',
      description:
        language === 'ta'
          ? 'முதல்தர நாட்டு எள்ளுடன் தூய பனை கருப்பட்டி சேர்த்து மரச்செக்கில் மெதுவாக ஆட்டப்பட்ட நல்லெண்ணெய் மற்றும் நீராவி முறையில் சுத்திகரிக்கப்பட்ட சூரியகாந்தி எண்ணெய்.'
          : 'First-grade black sesame seeds slow-churned with organic palm karupatti for authentic flavor, paired with chemical-free steam-refined sunflower oil for light, crisp frying.',
      highlights: [
        language === 'ta' ? 'பனை கருப்பட்டி கலந்தது' : 'Blended with Palm Jaggery',
        language === 'ta' ? 'ஆர்கிமோன் கலப்படமற்றது' : 'Zero Argemone Adulteration',
        language === 'ta' ? 'அதிக கொதிநிலை (High Smoke Point)' : 'High Smoke Point for Frying',
      ],
      category: 'sesame',
      ctaText: language === 'ta' ? 'நல்லெண்ணெய் & சூரியகாந்தி' : 'Shop Sesame & Sunflower',
      secondaryCta: language === 'ta' ? 'பரிசோதனை அறிக்கை' : 'View Lab Certificate',
      accentColor: 'from-yellow-400 to-amber-500',
      hotspots: [
        {
          x: '54%',
          y: '40%',
          label: language === 'ta' ? 'பனை கருப்பட்டி சேர்க்கை' : 'Slow Churned with Palm Jaggery',
          desc: language === 'ta' ? 'இயற்கை செசமால் ஆன்டிஆக்ஸிடன்ட்' : 'Natural Sesamol Antioxidants',
        },
        {
          x: '66%',
          y: '50%',
          label: language === 'ta' ? 'இயற்கை நீராவி சுத்திகரிப்பு' : 'Natural Steam Deodorization',
          desc: language === 'ta' ? 'காஸ்டிக் சோடா கலக்காதது' : 'Zero Caustic Soda',
        },
      ],
    },
    {
      id: 'smart-bottle',
      bannerImage: '/banners/smart_measuring_banner.jpg',
      badge: language === 'ta' ? '🧴 புதுமை • GEM EDIBLE பாணி ஸ்மார்ட் பாட்டில்' : '🧴 INNOVATION • SMART MEASURING BOTTLE',
      title: language === 'ta' ? 'ஸ்மார்ட் அளவீட்டு பாட்டில் & தூய பேக்கேஜிங்' : 'Smart Bottle with Built-in Measuring Chamber',
      subtitle: language === 'ta' ? 'சொட்டு சிந்தாத துல்லிய அளவீடு (10ml • 20ml • 30ml)' : 'Zero Mess, Anti-Drip, Precision Pouring',
      description:
        language === 'ta'
          ? 'தினசரி சமையல் எண்ணெயை துல்லியமாக அளந்து ஊற்ற உதவும் உள்ளமைக்கப்பட்ட சேம்பர். சமையலறை மேடையில் எண்ணெய் சிந்தாமல் சுத்தமாக வைத்துக்கொள்ளும் ஆன்டி-டிரிப் மூடி!'
          : 'Control your daily cooking oil with accurate 10ml, 20ml, and 30ml markings. Patented anti-drip pour spout keeps kitchen countertops clean and spotless.',
      highlights: [
        language === 'ta' ? '10ml, 20ml, 30ml அளவீட்டு சேம்பர்' : '10ml, 20ml, 30ml Chamber',
        language === 'ta' ? 'சொட்டு சிந்தாத ஆன்டி-டிரிப் மூடி' : 'Anti-Drip Pour Spout',
        language === 'ta' ? 'கைகளால் தொடாத ஆட்டோமேஷன்' : 'Hands-Free Hygienic Bottling',
      ],
      category: 'smart',
      ctaText: language === 'ta' ? 'ஸ்மார்ட் பாட்டில் ஆர்டர் செய்க' : 'Order Smart Pack',
      secondaryCta: language === 'ta' ? 'அளவீட்டு செய்முறை' : 'Interactive Demo',
      accentColor: 'from-amber-400 to-yellow-400',
      hotspots: [
        {
          x: '75%',
          y: '30%',
          label: language === 'ta' ? 'துல்லிய அளவீட்டு சேம்பர் (10-30ml)' : 'Built-in Measuring Chamber (10-30ml)',
          desc: language === 'ta' ? 'எண்ணெய் பயன்பாட்டைக் கட்டுப்படுத்த' : 'Track daily calorie intake',
        },
        {
          x: '75%',
          y: '18%',
          label: language === 'ta' ? 'சொட்டு சிந்தாத ஆன்டி-டிரிப் ஸ்பவுட்' : 'Anti-Drip Clean Pour Spout',
          desc: language === 'ta' ? 'சமையலறை மேடை எப்போதும் சுத்தமாக' : 'Prevents oil dripping on counters',
        },
      ],
    },
  ];

  // Auto-play timer (6 seconds per slide)
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-stone-950 text-white select-none w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ============================================================ */}
      {/* FULL-WIDTH CINEMATIC HERO BANNER SLIDER                      */}
      {/* ============================================================ */}
      <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] overflow-hidden">
        
        {/* Render All Slides with Smooth Crossfade */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Full-Bleed Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.bannerImage}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform scale-105 animate-pulse transition-transform duration-10000"
                  style={{ animationDuration: '12s' }}
                />
                
                {/* Cinematic Multi-Stop Gradient Overlays for High-Contrast Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/40" />
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
              </div>

              {/* Hotspots Placed on the Active Slide */}
              {isActive &&
                slide.hotspots.map((spot, spotIdx) => {
                  const isHovered = activeHotspot === spotIdx;
                  return (
                    <div
                      key={spotIdx}
                      className="absolute z-30 hidden md:block cursor-pointer transition-transform duration-300 hover:scale-110"
                      style={{ left: spot.x, top: spot.y }}
                      onMouseEnter={() => setActiveHotspot(spotIdx)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      onClick={() => setActiveHotspot(isHovered ? null : spotIdx)}
                    >
                      {/* Pulsing Radar Ring */}
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-8 h-8 rounded-full bg-amber-400/50 animate-ping pointer-events-none" />
                        <span className="absolute w-6 h-6 rounded-full bg-gold-400/40 pointer-events-none" />
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-black text-[11px] flex items-center justify-center shadow-2xl border-2 border-white">
                          +
                        </div>
                      </div>

                      {/* Tooltip Card */}
                      {isHovered && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-forest-950/95 backdrop-blur-md text-white text-xs p-3 rounded-2xl border border-gold-400/80 shadow-2xl whitespace-nowrap animate-fadeIn z-40 space-y-0.5">
                          <div className="font-bold flex items-center gap-1.5 text-gold-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>{spot.label}</span>
                          </div>
                          <p className="text-[10px] text-stone-300 font-light">{spot.desc}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

            </div>
          );
        })}

        {/* Foreground Content Container (Aligned within 7xl grid) */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            
            {/* Top Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-bold tracking-wider backdrop-blur-md shadow-lg animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.12] text-white drop-shadow-md">
                {activeSlide.title}
              </h1>
              <p className="text-lg sm:text-2xl font-serif font-medium text-amber-400 italic">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Description Body */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-200 font-light leading-relaxed max-w-xl drop-shadow-xs">
              {activeSlide.description}
            </p>

            {/* 3 Value Highlights Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeSlide.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs font-semibold text-stone-100 backdrop-blur-md shadow-xs hover:border-gold-400/50 transition-colors"
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  if (onSelectCategory && activeSlide.category !== 'smart') {
                    onSelectCategory(activeSlide.category);
                  }
                  onShopNow();
                }}
                className="px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-sm sm:text-base transition-all duration-300 shadow-2xl shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onShopNow}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/30 hover:border-gold-400 transition-all cursor-pointer backdrop-blur-md flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{activeSlide.secondaryCta}</span>
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* CAROUSEL CONTROLS: Left & Right Chevrons, Dots, and Chips    */}
        {/* ============================================================ */}

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 backdrop-blur-md shadow-xl hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-400 hover:text-stone-950 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 backdrop-blur-md shadow-xl hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Banner Slide Selector Navigation Bar */}
        <div className="absolute bottom-5 inset-x-0 z-30 flex items-center justify-center gap-2 sm:gap-3 px-4">
          {slides.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-xl font-black scale-105'
                    : 'bg-black/50 hover:bg-black/70 text-stone-300 border border-white/20 text-xs'
                }`}
              >
                <span className="font-mono text-[10px]">0{idx + 1}</span>
                <span className="hidden sm:inline text-xs font-bold">{s.subtitle.split(' ')[0]}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ============================================================ */}
      {/* GEM EDIBLE STYLE MARQUEE TRUST BAR (Continuous Running Strip) */}
      {/* ============================================================ */}
      <div className="border-t border-b border-gold-500/20 bg-[#08150d] py-3.5 overflow-hidden shadow-inner">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-bold text-cream-100 tracking-wide uppercase">
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🏛️</span>
            <span>{language === 'ta' ? 'சேலம் மரபு 1957 முதல்' : 'Salem Heritage Since 1957'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🌿</span>
            <span>{language === 'ta' ? '100% மரச்செக்கு பாரம்பரிய முறை (<42°C)' : '100% Cold-Pressed Mara Chekku (<42°C)'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🧪</span>
            <span>{language === 'ta' ? '0% ரசாயனம் • ஹெக்ஸேன் கலக்காதது' : '0% Chemical Solvents (Zero Hexane)'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🧴</span>
            <span>{language === 'ta' ? 'ஸ்மார்ட் அளவீட்டு சேம்பர் பாட்டில் (10ml-30ml)' : 'Smart Measuring Chamber Bottle (10-30ml)'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🛡️</span>
            <span>{language === 'ta' ? 'FSSAI & NABL அங்கீகரிக்கப்பட்ட தரம்' : 'NABL Lab Certified Purity'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">🚚</span>
            <span>{language === 'ta' ? 'தமிழகம் முழுவதும் விரைவு விநியோகம்' : 'Same-Day Mill Fresh Dispatch'}</span>
          </span>
          <span className="text-amber-400/40">•</span>
          <span className="flex items-center gap-2">
            <span className="text-amber-400">⭐</span>
            <span>{language === 'ta' ? '25,000+ வாடிக்கையாளர்களின் நம்பிக்கை' : '4.9/5 Rating from 25,000+ Families'}</span>
          </span>
        </div>
      </div>

    </section>
  );
};
