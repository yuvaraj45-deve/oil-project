import React, { useState, useRef } from 'react';
import {
  X,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReelStory {
  id: string;
  video: string;
  creator: string;
  title: string;
  dishName: string;
  oilUsed: string;
  productSlug: string;
  description: string;
}

export const ReelsCarouselSection: React.FC = () => {
  const { language } = useLanguage();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    reel_1: true,
    reel_2: true,
    reel_3: true,
    reel_4: true,
    reel_5: true,
  });
  const [selectedStory, setSelectedStory] = useState<ReelStory | null>(null);
  const [modalPlaying, setModalPlaying] = useState<boolean>(true);

  // References to video elements
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const reels: ReelStory[] = [
    {
      id: 'reel_1',
      video: '/videos/reel_1.mp4',
      creator: '@ssoil_official',
      title:
        language === 'ta'
          ? 'பாரம்பரிய மில் & நேரடி செக்கு சமையல்'
          : 'Heritage Mill Cooking & Live Crushing Fair',
      dishName:
        language === 'ta'
          ? 'மணக்கும் மரச்செக்கு சமையல்'
          : 'Authentic Mara Chekku Cooking',
      oilUsed:
        language === 'ta'
          ? 'அசல் மரச்செக்கு நல்லெண்ணெய்'
          : 'Pure Wood-Pressed Sesame Oil',
      productSlug: 'ss-gingelly-1000',
      description:
        language === 'ta'
          ? 'நாட்டு விதைகளை வாகை மரச்செக்கில் நேரில் ஆட்டி தரும் அசல் நல்லெண்ணெயில் சமைத்த உணவு. 10,000+ குடும்பங்களின் நம்பிக்கை.'
          : 'Traditional Vaagai wood churned oil used in authentic South Indian kitchens. Chemical-free, nutrient-rich liquid gold.',
    },
    {
      id: 'reel_2',
      video: '/videos/reel_2.mp4',
      creator: '@neeraj_elango',
      title:
        language === 'ta'
          ? 'வாகை கடலை எண்ணெயில் மிருதுவான சப்பாத்தி'
          : 'Hand-Rolled Rotis with Vaagai Groundnut Oil',
      dishName:
        language === 'ta'
          ? 'மென்மையான பஞ்சு சப்பாத்தி'
          : 'Fluffy Soft Layered Chapatis',
      oilUsed:
        language === 'ta'
          ? 'நாட்டு மரச்செக்கு கடலை எண்ணெய்'
          : 'Cold-Pressed Native Groundnut Oil',
      productSlug: 'ss-groundnut-1000',
      description:
        language === 'ta'
          ? 'எண்ணெய் பிசுக்கு இல்லாமல் சுடச்சுட பஞ்சு போன்ற மென்மையான சப்பாத்தி அசல் மரச்செக்கு கடலை எண்ணெயுடன்.'
          : 'Fluffy, ultra-soft layered chapatis prepared with wholesome cold-pressed native groundnut oil without any heavy greasiness.',
    },
    {
      id: 'reel_3',
      video: '/videos/reel_3.mp4',
      creator: '@chef_samayal',
      title:
        language === 'ta'
          ? 'மணக்கும் பனைவெல்ல நல்லெண்ணெய் தாளிப்பு'
          : 'Aromatic Curry Leaf Sizzling Tadka',
      dishName:
        language === 'ta'
          ? 'மொறுமொறு நாட்டு கறிவேப்பிலை தாளிப்பு'
          : 'Crisp Curry Leaf & Mustard Crackle',
      oilUsed:
        language === 'ta'
          ? 'பனைவெல்ல மரச்செக்கு நல்லெண்ணெய்'
          : 'Palm Jaggery Mara Chekku Gingelly Oil',
      productSlug: 'ss-gingelly-1000',
      description:
        language === 'ta'
          ? 'சூடான வாணலியில் பனைவெல்லம் கலந்த நல்லெண்ணெயில் படபடவென பொரியும் நாட்டு கறிவேப்பிலையின் தெய்வீக நறுமணம்.'
          : 'Fresh garden curry leaves crackling in authentic wood-pressed gingelly oil infused with natural Karupatti sweetness.',
    },
    {
      id: 'reel_4',
      video: '/videos/reel_4.mp4',
      creator: '@south_kitchen',
      title:
        language === 'ta'
          ? 'காரசார உருளை வறுவல் & மணக்கும் மசாலா சாதம்'
          : 'Crispy Spiced Potato Roast & Flavored Rice',
      dishName:
        language === 'ta'
          ? 'செட்டிநாடு மொறுமொறு உருளை ரோஸ்ட்'
          : 'Chettinad Crispy Potato Fry',
      oilUsed:
        language === 'ta'
          ? 'மரச்செக்கு கடலை & சூரியகாந்தி எண்ணெய்'
          : 'Wood Pressed Groundnut Oil',
      productSlug: 'ss-groundnut-1000',
      description:
        language === 'ta'
          ? 'உடலுக்கு குளிர்ச்சியான இயற்கை மரச்செக்கு எண்ணெயில் மொறுமொறுவென வறுத்த உருளை வறுவலும் சீரக சாதமும்.'
          : 'Slow-roasted spicy golden potatoes paired with aromatic seasoned cumin rice in authentic wood-pressed oil.',
    },
    {
      id: 'reel_5',
      video: '/videos/reel_5.mp4',
      creator: '@priya_cooking',
      title:
        language === 'ta'
          ? 'ஆரோக்கிய சமையலுக்கு மாறிய எனது அனுபவம்'
          : 'Healthy Mara Chekku Oil in Modern Kitchens',
      dishName:
        language === 'ta'
          ? 'தினசரி ஆரோக்கிய சமையல்'
          : 'Everyday Wholesome Home Cooking',
      oilUsed:
        language === 'ta'
          ? '100% தூய மரச்செக்கு எண்ணெய் தொடர்'
          : '100% Chemical-Free Mara Chekku Range',
      productSlug: 'ss-coconut-1000',
      description:
        language === 'ta'
          ? 'ரசாயன ரீஃபைன்ட் எண்ணெய்களை கைவிட்டு கெம்ஸ் கோல்ட் இயற்கை எண்ணெய்க்கு மாறியதால் எங்கள் குடும்பத்திற்கு கிடைத்த ஆரோக்கியம்.'
          : 'Why switching from chemical-refined solvent oils to Gem’s Gold 100% unrefined cold-pressed oils transformed my family wellness.',
    },
  ];

  // Mouse hover: Whichever video the arrow points to -> plays instantly!
  // All other videos pause immediately!
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);

    // Pause all other videos
    videoRefs.current.forEach((vid, i) => {
      if (vid && i !== index) {
        vid.pause();
      }
    });

    // Play ONLY this hovered video
    const targetVid = videoRefs.current[index];
    if (targetVid) {
      targetVid.play().catch(() => {
        targetVid.muted = true;
        targetVid.play();
      });
    }
  };

  // Mouse leave: Pause the video
  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    const targetVid = videoRefs.current[index];
    if (targetVid) {
      targetVid.pause();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx =
      hoveredIndex !== null && hoveredIndex > 0 ? hoveredIndex - 1 : reels.length - 1;
    handleMouseEnter(nextIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx =
      hoveredIndex !== null && hoveredIndex < reels.length - 1 ? hoveredIndex + 1 : 0;
    handleMouseEnter(nextIdx);
  };

  const toggleSound = (reelId: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !mutedStates[reelId];
    setMutedStates((prev) => ({ ...prev, [reelId]: newMuted }));
    const vid = videoRefs.current[index];
    if (vid) {
      vid.muted = newMuted;
    }
  };

  const openModal = (reel: ReelStory, e: React.MouseEvent) => {
    e.stopPropagation();
    videoRefs.current.forEach((vid) => vid?.pause());
    setSelectedStory(reel);
    setModalPlaying(true);
  };

  const toggleModalPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setModalPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setModalPlaying(false);
      }
    }
  };

  return (
    <section className="bg-white py-6 sm:py-10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">

        {/* Carousel Container matching exact width & height of reference screenshot */}
        <div className="relative max-w-[1040px] mx-auto py-8 sm:py-10">

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Reel"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-xl border border-stone-200/90 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
            title="Previous Story"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Reel"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-xl border border-stone-200/90 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all"
            title="Next Story"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* 5 Video Cards Row: Completely Rock-Solid & Stable (Zero Shake / Zero Jitter) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 overflow-visible">
            {reels.map((reel, index) => {
              const isHovered = hoveredIndex === index;
              const isMuted = mutedStates[reel.id] ?? true;

              return (
                <div
                  key={reel.id}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={(e) => openModal(reel, e)}
                  className={`relative cursor-pointer transition-all duration-300 ease-out select-none shrink-0 ${
                    isHovered
                      ? 'z-30 scale-[1.14] sm:scale-[1.16] -translate-y-3 sm:-translate-y-4'
                      : 'z-10 scale-100 translate-y-0 opacity-95'
                  }`}
                  style={{
                    width: '215px',
                    minWidth: '170px',
                    maxWidth: '225px',
                  }}
                >
                  {/* Card Container: Comes Visibly Out of the Line on Hover */}
                  <div
                    className={`relative w-full h-[330px] sm:h-[350px] md:h-[370px] rounded-2xl overflow-hidden bg-black transition-all duration-300 ease-out ${
                      isHovered
                        ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] ring-2 ring-amber-400/90'
                        : 'shadow-md border border-stone-200/60'
                    }`}
                  >
                    {/* Cooking Video Element */}
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={reel.video}
                      loop
                      muted={isMuted}
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Gradient Vignette Overlays for Maximum Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                    {/* Top Watermark (SS OIL SINCE 1966) */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                      <div className="flex flex-col">
                        <span className="font-serif text-xs font-bold text-white drop-shadow-md leading-none">
                          ss oil
                        </span>
                        <span className="text-[7px] font-bold tracking-widest text-amber-300 drop-shadow-sm uppercase mt-0.5">
                          SINCE 1966
                        </span>
                      </div>
                    </div>

                    {/* Bottom Info Bar: Creator Handle & Sound Toggle */}
                    <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span className="font-mono text-[10px] sm:text-[11px] font-medium text-white/95 truncate drop-shadow">
                            {reel.creator}
                          </span>
                        </div>

                        {/* Sound Toggle Box (Styled matching reference screenshot) */}
                        <button
                          onClick={(e) => toggleSound(reel.id, index, e)}
                          className="w-7 h-7 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/20"
                          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-stone-300" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] sm:text-[11px] font-medium text-stone-200 line-clamp-1 drop-shadow-sm mt-0.5">
                        {reel.dishName}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Video Reel Lightbox Modal (Full view on click) */}
        {selectedStory && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedStory(null)}
          >
            <div
              className="bg-stone-900 border border-stone-800 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span className="font-mono text-xs font-bold text-amber-200">
                    {selectedStory.creator}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Full Video Player */}
              <div
                className="relative aspect-[9/14] max-h-[500px] bg-black cursor-pointer group"
                onClick={toggleModalPlay}
              >
                <video
                  ref={modalVideoRef}
                  src={selectedStory.video}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Play icon overlay ONLY when paused */}
                {!modalPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-2xl">
                      <Play className="w-8 h-8 fill-stone-950 ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Bottom Info & Purchase CTA */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-bold text-amber-400">
                      ss oil
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                      SINCE 1966
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                      {language === 'ta' ? 'அசல் மரச்செக்கு' : '100% Mara Chekku'}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-white">
                  {selectedStory.title}
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedStory.description}
                </p>

                {/* Featured Oil Badge & Shop Button */}
                <div className="p-3 rounded-2xl bg-forest-950/80 border border-emerald-800/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                      {language === 'ta' ? 'பயன்படுத்திய எண்ணெய்' : 'Featured Oil'}:
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {selectedStory.oilUsed}
                    </span>
                  </div>

                  <a
                    href={`/product/${selectedStory.productSlug}`}
                    onClick={() => setSelectedStory(null)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'வாங்க' : 'Buy Now'}</span>
                  </a>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {language === 'ta' ? 'மூடுக' : 'Close'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
