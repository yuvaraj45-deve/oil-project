import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Droplets,
  Award,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { CRAFT_STAGES_DATA } from '../data/oilData';
import { CraftStage } from '../types';
import { useLanguage } from '../context/LanguageContext';

const STAGE_HIGHLIGHTS: Record<number, { en: string[]; ta: string[] }> = {
  1: {
    en: [
      'Hand-sorted native pods directly sourced from organic farmer clusters in Salem',
      'Zero moisture, naturally sun-cured on open village mats without artificial heat',
      'Double-sieved to eliminate dust, dirt, and hollow kernels (0.00% foreign impurities)',
    ],
    ta: [
      'சேலம் விவசாயக் குடும்பங்களிடம் இருந்து நேரடியாகப் பெறப்படும் நாட்டு விதைகள்',
      'செயற்கை வெப்பமின்றி இயற்கை வெயிலில் பாய்களில் பரப்பி உலர்த்தப்படுகிறது',
      'தூசிகள் மற்றும் உமிகள் முற்றிலும் நீக்கப்பட்டு 100% தூய்மையான விதைகள் மட்டும் தேர்வு',
    ],
  },
  2: {
    en: [
      'Slowly crushed in ancient Vaagai (Albizia Lebbeck) medicinal wood mortar',
      'Gentle 12–14 RPM rotation keeps extraction temperature strictly below 42°C',
      'Blended with organic palm jaggery (Karupatti) for authentic fragrance and taste',
    ],
    ta: [
      'மருத்துவ குணம் கொண்ட பழமையான வாகை மர உரலில் மெதுவாக சுழற்றப்படுகிறது',
      '12-14 RPM குறைவான வேகத்தில் அரைக்கப்படுவதால் உராய்வு சூடு ஏற்படுவதில்லை (< 42°C)',
      'உடலுக்கு நலம் தரும் இயற்கை பனை கருப்பட்டி சேர்த்து பாரம்பரிய மணம் மாறாமல் பிழியப்படுகிறது',
    ],
  },
  3: {
    en: [
      'Resting 5 full days under natural warm sunlight in covered food-grade glass vessels',
      'Zero chemical bleaching, silica powder, or solvent hexane washing used',
      'Micro seed sediments settle gently down purely by natural Earth gravity',
    ],
    ta: [
      'கண்ணாடிப் பாத்திரங்களில் 5 நாட்கள் இயற்கை வெயிலில் வைத்து தெளிவடைய செய்யப்படுகிறது',
      'எந்தவித ரசாயன வெளுப்போ, சிலிக்கா தூளோ அல்லது ஆசிட் சுத்திகரிப்போ கிடையாது',
      'புவிஈர்ப்பு விசையினால் இயற்கையாகவே அசல் தூய எண்ணெய் மட்டும் மேலே மிதக்கிறது',
    ],
  },
  4: {
    en: [
      'GC-MS tested for authentic fatty acid balance and intact Vitamin E tocopherols',
      '100% Certified free from pesticides, aflatoxins, mineral oils, and adulterants',
      'FSSAI & Agmark Grade I quality clearance verified for every single pressing batch',
    ],
    ta: [
      'இயற்கை வைட்டமின் E மற்றும் ஒமேகா சத்துக்கள் மாறாமல் இருப்பது ஆய்வகத்தில் உறுதி',
      'பூச்சிக்கொல்லி மருந்துகள் மற்றும் கலப்படங்கள் அற்ற தூய்மையான எண்ணெய்',
      'ஒவ்வொரு முறையும் FSSAI மற்றும் அக்மார்க் தரம் I ஆய்வகப் பரிசோதனை சான்றிதழ்',
    ],
  },
  5: {
    en: [
      'Untouched, hands-free hygienic bottling directly at our Salem mill',
      'UV-tinted containers shield delicate unrefined nutrients from harsh sunlight degradation',
      'Airtight hermetic sealing locks in the fresh mill fragrance for 12 months shelf-life',
    ],
    ta: [
      'சேலம் ஆலையிலேயே மனித கைகள் படாமல் தூய முறையில் பாட்டில்களில் அடைக்கப்படுகிறது',
      'UV கதிர்களில் இருந்து காக்கும் சிறப்பு பாட்டில்கள் எண்ணெயின் தரத்தை அப்படியே காக்கும்',
      'இயற்கையான மரச்செக்கு நறுமணம் மாறாமல் 12 மாதங்கள் வரை புத்துணர்ச்சியுடன் இருக்கும்',
    ],
  },
};

export const CraftsmanshipVisualizer: React.FC = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);

  const currentStage: CraftStage =
    CRAFT_STAGES_DATA.find((s) => s.step === activeStep) || CRAFT_STAGES_DATA[0];

  const stageIcons = [
    <Sprout className="w-4 h-4" />,
    <Droplets className="w-4 h-4" />,
    <Sun className="w-4 h-4" />,
    <ShieldCheck className="w-4 h-4" />,
    <Award className="w-4 h-4" />,
  ];

  const highlights =
    STAGE_HIGHLIGHTS[activeStep]?.[language === 'ta' ? 'ta' : 'en'] ||
    STAGE_HIGHLIGHTS[1].en;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#F9F6F0] via-[#FDFBF7] to-[#F7F3EA] text-stone-900 relative overflow-hidden border-y border-amber-900/10">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-36 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'ta'
                ? '58 ஆண்டுகால மரச்செக்கு நெறிமுறை • 1966 முதல்'
                : 'Authentic Salem Mill Heritage • Since 1966'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#261E16] tracking-tight">
            {language === 'ta' ? 'பாரம்பரிய மரச்செக்கு பயணம்' : 'The Sacred Mara Chekku Journey'}
          </h2>

          <p className="mt-3 text-stone-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            {language === 'ta'
              ? 'வெயிலில் உலர்ந்த இயற்கை நாட்டு விதைகள் வாகை மரச்செக்கில் அரைக்கப்பட்டு, எந்தவித சூடோ ரசாயனமோ இன்றி தூய திரவத் தங்கமாக மாறும் 5 புனித நிலைகள்.'
              : 'From sun-cured native seeds to pure liquid gold — discover how our ancient Vaagai wood cold-press extracts living nutrition with zero heat and zero chemicals.'}
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3.5 mb-8">
          {CRAFT_STAGES_DATA.map((stage) => {
            const isActive = stage.step === activeStep;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStep(stage.step)}
                className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer relative ${
                  isActive
                    ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                    : 'bg-white/70 hover:bg-white border-stone-200/90 text-stone-600 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-amber-900 text-gold-300 shadow-xs'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    0{stage.step}
                  </span>
                  <span
                    className={`p-1.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {stageIcons[stage.step - 1]}
                  </span>
                </div>

                <div>
                  <h4
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? 'text-[#261E16] font-serif' : 'text-stone-700'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <span className="text-[11px] text-amber-800/80 font-medium block truncate mt-0.5">
                    {stage.traditionalName.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Stage Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-900/10 h-72 sm:h-96 bg-stone-100 group shadow-md">
                <img
                  key={currentStage.step}
                  src={currentStage.image}
                  alt={currentStage.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 left-3.5 bg-amber-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-200 border border-amber-700/50 shadow-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>100% Traditional Mara Chekku</span>
                </div>

                {/* Metric Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-amber-200 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 block tracking-wider">
                      {currentStage.metricLabel}
                    </span>
                    <span className="text-base sm:text-lg font-bold font-serif text-amber-900">
                      {currentStage.metricValue}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stage Detail & Narrative */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {language === 'ta' ? `நிலை 0${currentStage.step} / 05` : `Stage 0${currentStage.step} of 05`}
                </span>
                <span className="text-xs font-serif italic text-stone-500 font-semibold">
                  {currentStage.traditionalName}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#261E16] tracking-tight">
                {currentStage.title}
              </h3>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm font-semibold text-amber-950 flex items-center gap-2">
                <span>✨</span>
                <span>{currentStage.tagline}</span>
              </div>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                {currentStage.description}
              </p>

              {/* 3 Authentic Highlights */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {language === 'ta' ? 'பாரம்பரிய உறுதிமொழி:' : 'Artisanal Highlights:'}
                </span>
                <div className="space-y-2">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress control buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'முந்தைய நிலை' : 'Previous Step'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {CRAFT_STAGES_DATA.map((s) => (
                    <button
                      key={s.step}
                      onClick={() => setActiveStep(s.step)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        s.step === activeStep ? 'w-7 bg-amber-600' : 'w-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                      title={`Go to step ${s.step}`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === CRAFT_STAGES_DATA.length}
                  onClick={() => setActiveStep(Math.min(CRAFT_STAGES_DATA.length, activeStep + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-gold-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>{language === 'ta' ? 'அடுத்த நிலை' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
