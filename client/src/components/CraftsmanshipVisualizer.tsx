import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Droplets,
  Award,
  Sprout,
} from 'lucide-react';
import { CRAFT_STAGES_DATA } from '../data/oilData';
import { CraftStage } from '../types';
import { useLanguage } from '../context/LanguageContext';

const STAGE_HIGHLIGHTS: Record<number, { en: string[]; ta: string[] }> = {
  1: {
    en: [
      'We buy whole, clean native seeds directly from trusted local farmers, never from bulk dealers',
      'Naturally sun-dried on open village mats under breezy skies — zero artificial steam or kiln heat',
      'Hand-sieved patiently to remove dust, stones, and hollow pods so only plump seeds enter the mortar',
    ],
    ta: [
      'நம்பகமான உள்ளூர் விவசாயிகளிடம் இருந்து நேரில் பார்த்து வாங்கும் தரமான நாட்டு விதைகள்',
      'கிராமத்து தென்றல் காற்றிலும் இயற்கை வெயிலிலும் பாயில் உலர்த்தி ஈரப்பதத்தை போக்குகிறோம்',
      'தூசி, கல், உமி எதுவும் இல்லாதவாறு கையால் சலித்து நல்ல விதைகளை மட்டும் உரலுக்குள் போடுகிறோம்',
    ],
  },
  2: {
    en: [
      'Crushed slowly inside hand-carved Vaagai wood mortars, rotating at just 12 to 14 RPM',
      'The seasoned wood naturally absorbs any warmth, so the fresh oil stays cool and never burns',
      'We fold in a touch of authentic native Karupatti (palm jaggery) for that unforgettable aroma and taste',
    ],
    ta: [
      'வாகை மர உரலில் ஒரு நிமிடத்திற்கு 14 முறை மட்டுமே சுழலும் பொறுமையான பாரம்பரிய ஆட்டுதல்',
      'மரமே சூட்டை உறிஞ்சி விடுவதால், கையில் தொட்டால் எண்ணெய் இயல்பான குளிர்ச்சியோடு இருக்கும்',
      'சுவையும் நறுமணமும் தூக்கலாக இருக்க அசல் நாட்டு பனை கருப்பட்டியைச் சேர்த்து பிழிகிறோம்',
    ],
  },
  3: {
    en: [
      'We never use chemical bleaching powders, acid baths, or high-speed industrial filter machines',
      'Fresh golden oil is poured into clean glass jars and left to rest under the warm sun for 5 days',
      'Micro seed sediments settle gently down to the bottom on their own through natural Earth gravity',
    ],
    ta: [
      'ரசாயன வெளுப்போ, சிலிக்கா பவுடரோ அல்லது அவசர மிஷின் பில்டரோ நாங்கள் போடுவதில்லை',
      'சுத்தமான பாத்திரங்களில் ஊற்றி 5 நாட்கள் வெயிலில் வைத்து இயற்கையாகவே தெளிய வைக்கிறோம்',
      'எண்ணெயில் உள்ள சிறு கசடுகள் புவிஈர்ப்பினால் தானாகவே அடியில் போய் தங்கிவிடும்',
    ],
  },
  4: {
    en: [
      'Clear golden oil is drawn from the top and strained through layers of pure unbleached cotton cloth',
      'Preserves all the natural plant nutrients, thick viscosity, and rich native fragrance',
      'Every single press is tested and certified under government FSSAI food safety standards',
    ],
    ta: [
      'மேலே நிற்கும் தெளிவான எண்ணெயை எடுத்து மெல்லிய பருத்தி துணியில் பொறுமையாக வடிகட்டுகிறோம்',
      'இயற்கையான வைட்டமின்கள், கெட்டியான பதம் மற்றும் நறுமணம் துளியும் குறையாமல் பாதுகாக்கப்படுகிறது',
      'அரசு FSSAI உணவுத் தர விதிகளின்படி ஒவ்வொரு பேட்சும் முறையாக பரிசோதிக்கப்படுகிறது',
    ],
  },
  5: {
    en: [
      'Bottled fresh right here at our mill — no sitting in dusty distribution warehouses for months',
      'UV-shielded food-grade containers protect the living aroma and nutrients from heat and light',
      'When you uncap the bottle in your kitchen, you get that vibrant fresh smell of a real village mill',
    ],
    ta: [
      'மாதக்கணக்கில் குடோனில் வைக்காமல், ஆலையிலேயே புத்தம் புதியதாக பாட்டிலில் அடைக்கிறோம்',
      'வெப்பம் மற்றும் வெளிச்சம் படாமல் மணத்தை அப்படியே காக்கும் பாதுகாப்பான பாட்டில்கள்',
      'பாட்டிலைத் திறந்தாலே மில்லில் நேரில் நின்று வாங்குவது போன்ற அசல் நறுமணத்தை உணரலாம்',
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#261E16] tracking-tight">
            {language === 'ta' ? 'பாரம்பரிய மரச்செக்கு பயணம்' : 'The Sacred Mara Chekku Journey'}
          </h2>

          <p className="mt-3 text-stone-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            {language === 'ta'
              ? 'எங்கள் ஆலையில், உள்ளூர் விவசாயிகளிடம் வாங்கிய நாட்டு விதைகளை வாகை மரச்செக்கில் மெதுவாக ஆட்டி, வெயிலில் தெளிய வைத்து உங்கள் வீட்டிற்குத் தருகிறோம். எந்திர வேகமோ, ரசாயன கலப்போ, தேவையில்லாத சூடோ துளியும் கிடையாது — அசல் கைவினைத் தூய்மை மட்டுமே.'
              : 'At our traditional family mill, we take no shortcuts. Here is the honest, unhurried 5-step journey of how whole native seeds become fresh, aromatic oil in your kitchen — untouched by machines, high heat, or chemicals.'}
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
                <div className="absolute top-3.5 left-3.5 bg-amber-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-200 border border-amber-700/50 shadow-xs">
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

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm font-semibold text-amber-950">
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
