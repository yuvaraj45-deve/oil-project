import React, { useState } from 'react';
import {
  Droplet,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Heart,
  Scale,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SmartBottleFeatureProps {
  onShopOils: () => void;
}

export const SmartBottleFeature: React.FC<SmartBottleFeatureProps> = ({ onShopOils }) => {
  const { language } = useLanguage();
  const [selectedDose, setSelectedDose] = useState<number>(20);
  const [isPouring, setIsPouring] = useState<boolean>(false);

  const handleSimulatePour = (dose: number) => {
    setSelectedDose(dose);
    setIsPouring(true);
    setTimeout(() => {
      setIsPouring(false);
    }, 1200);
  };

  const features = [
    {
      title: language === 'ta' ? 'உள்ளமைக்கப்பட்ட அளவீட்டு சேம்பர்' : 'Built-In Measuring Chamber',
      description:
        language === 'ta'
          ? 'துல்லியமான 10ml, 20ml மற்றும் 30ml அளவுகோல்கள் மூலம் சமையலில் அதிகப்படியான எண்ணெய் சேர்வதைத் தடுத்து, உடல் ஆரோக்கியத்தைப் பாதுகாக்கலாம்.'
          : 'Accurate 10ml, 20ml, and 30ml chamber marks allow you to pour exact quantities, track healthy daily intake, and avoid excess oil.',
      badge: '10ml • 20ml • 30ml',
      icon: Scale,
    },
    {
      title: language === 'ta' ? 'சொட்டு சிந்தாத ஆன்டி-டிரிப் மூடி' : 'Anti-Drip Clean Pouring',
      description:
        language === 'ta'
          ? 'பிரத்யேகமாக வடிவமைக்கப்பட்ட ஸ்பவுட் மூலமாக பாட்டிலின் வெளிப்புறத்தில் ஒரு சொட்டு எண்ணெய் கூட வழியாது; உங்கள் சமையலறை மேடை எப்போதும் சுத்தமாக இருக்கும்.'
          : 'Precision engineered pour spout ensures zero oil drips down the bottle, keeping your kitchen shelves clean and stain-free.',
      badge: language === 'ta' ? 'சுத்தமான மேடை' : 'Zero Stain',
      icon: Droplet,
    },
    {
      title: language === 'ta' ? 'UV பாதுகாப்பு வண்ண பாட்டில்' : 'Aroma-Lock UV Protection',
      description:
        language === 'ta'
          ? 'சூரிய ஒளியால் இயற்கை வைட்டமின்கள் மற்றும் ஊட்டச்சத்துக்கள் அழியாமல் பாதுகாக்க, பிரத்யேக உணவுத் தர வண்ண பாட்டிலில் அடைக்கப்படுகிறது.'
          : 'Special food-grade tinted bottles shield natural vitamins and unrefined nutrients from harsh sunlight degradation.',
      badge: language === 'ta' ? 'ஊட்டச்சத்து பாதுகாப்பு' : 'UV Tinted Shield',
      icon: Shield,
    },
    {
      title: language === 'ta' ? 'கைகளால் தொடாத ஆட்டோமேஷன்' : 'Hands-Free Hygienic Bottling',
      description:
        language === 'ta'
          ? 'சேலம் ஆலையில் மனித கைகளின் தொடுதல் இன்றி, தானியங்கி முறையில் நேரடியாக பாட்டிலில் அடைக்கப்பட்டு 100% சுகாதாரத்துடன் கிடைக்கிறது.'
          : 'Automated, untouched filling directly at our Salem mill ensures 100% microbiological purity in every single drop.',
      badge: language === 'ta' ? '100% சுகாதாரம்' : 'Untouched Bottling',
      icon: Sparkles,
    },
  ];

  const doseDetails: Record<number, { cals: string; use: string; benefit: string; height: string }> = {
    10: {
      cals: '88 kcal',
      use: language === 'ta' ? '1 நபர் எளிய பொரியல் அல்லது தோசை வார்த்தல்' : 'Single serving sauté or crisp dosa',
      benefit: language === 'ta' ? '70% குறைவான எண்ணெய் பயன்பாடு' : 'Saves ~70% excess cooking fat',
      height: '33%',
    },
    20: {
      cals: '176 kcal',
      use: language === 'ta' ? 'குடும்ப சாம்பார் / தால் தாளிப்பு' : 'Family dal tadka & vegetable curry',
      benefit: language === 'ta' ? 'மிதமான ஆரோக்கிய சமநிலை' : 'Ideal heart-healthy daily portion',
      height: '66%',
    },
    30: {
      cals: '264 kcal',
      use: language === 'ta' ? 'பாரம்பரிய குருமா, குழம்பு & ஆழ வறுவல்' : 'Rich Sunday gravies & festive feasts',
      benefit: language === 'ta' ? 'செழுமையான மணமும் சுவையும்' : 'Rich aroma without greasy residue',
      height: '100%',
    },
  };

  const activeDoseInfo = doseDetails[selectedDose] || doseDetails[20];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#0e2416] via-[#142e1d] to-[#0c1f13] text-white relative overflow-hidden border-t border-b border-gold-500/20">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-36 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest">
            <Droplet className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ta' ? 'GEM EDIBLE பாணி நவீன பேக்கேஜிங்' : 'Smart Packaging Innovation'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight leading-tight">
            {language === 'ta'
              ? 'சொட்டு சிந்தாத ஸ்மார்ட் பாட்டில் • ஆரோக்கிய அளவீடு'
              : 'Zero Mess, Clean Kitchen & Smart Dosage'}
          </h2>

          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed">
            {language === 'ta'
              ? 'பாரம்பரிய மரச்செக்கு எண்ணெயை, நவீன அளவீட்டு சேம்பர் மற்றும் ஆன்டி-டிரிப் மூடியுடன் கூடிய ஸ்மார்ட் பாட்டிலில் உங்களுக்கு வழங்குகிறோம்.'
              : 'Experience traditional cold-pressed purity packaged in revolutionary smart bottles featuring built-in measuring chambers, anti-drip spouts, and UV light protection.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Interactive Dosage Simulator & Smart Bottle Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-forest-900/90 rounded-3xl p-6 border-2 border-gold-500/30 shadow-2xl relative backdrop-blur-md space-y-6">
              
              <div className="flex items-center justify-between border-b border-forest-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                    Live Demo Simulator
                  </span>
                  <h3 className="text-base font-serif font-bold text-white">
                    {language === 'ta' ? 'அளவீட்டு சேம்பர் செயல்முறை' : 'Smart Chamber Dispenser'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-gold-400" />
                  <span>Patented</span>
                </span>
              </div>

              {/* Animated Chamber Visual */}
              <div className="relative h-64 bg-forest-950 rounded-2xl border border-forest-800 overflow-hidden flex flex-col justify-end p-4">
                
                {/* Background Grid Lines & Volume Markers */}
                <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col justify-between pointer-events-none text-right font-mono text-[11px] text-stone-500 z-10">
                  <div className="border-b border-white/10 pb-1 flex justify-between">
                    <span className="text-gold-400">30 ml (Max)</span>
                    <span>264 kcal</span>
                  </div>
                  <div className="border-b border-white/10 pb-1 flex justify-between">
                    <span className="text-amber-300">20 ml (Standard)</span>
                    <span>176 kcal</span>
                  </div>
                  <div className="border-b border-white/10 pb-1 flex justify-between">
                    <span className="text-yellow-200">10 ml (Light)</span>
                    <span>88 kcal</span>
                  </div>
                </div>

                {/* Simulated Liquid Fill Animation */}
                <div
                  className={`w-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-xl transition-all duration-700 relative shadow-inner ${
                    isPouring ? 'animate-pulse' : ''
                  }`}
                  style={{ height: activeDoseInfo.height }}
                >
                  <div className="absolute inset-x-0 top-0 h-2 bg-white/40 blur-xs rounded-t-xl" />
                  <div className="absolute bottom-2 left-3 font-mono font-black text-forest-950 text-xs">
                    {selectedDose} ml Active Fill
                  </div>
                </div>

                {/* Squeeze / Pour Effect Ripple */}
                {isPouring && (
                  <div className="absolute inset-0 bg-gold-400/10 pointer-events-none flex items-center justify-center animate-fadeIn">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-forest-950 text-xs font-bold shadow-lg">
                      Dispensing {selectedDose} ml...
                    </span>
                  </div>
                )}

              </div>

              {/* Interactive Dose Selector Buttons */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-300">
                  {language === 'ta' ? 'அளவைத் தேர்ந்தெடுக்கவும்:' : 'Select Measurement Dosage:'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map((dose) => (
                    <button
                      key={dose}
                      onClick={() => handleSimulatePour(dose)}
                      className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        selectedDose === dose
                          ? 'bg-gold-500 text-forest-950 shadow-md font-black ring-2 ring-gold-300 scale-102'
                          : 'bg-forest-950 text-stone-300 border border-forest-800 hover:bg-forest-800'
                      }`}
                    >
                      <span className="text-sm font-black">{dose} ml</span>
                      <span className="text-[10px] opacity-80">
                        {dose === 10 ? 'Light' : dose === 20 ? 'Tadka' : 'Gravy'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Live Output Card */}
                <div className="bg-forest-950/80 p-3 rounded-xl border border-forest-800/80 text-xs space-y-1">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>Usage: {activeDoseInfo.use}</span>
                    <span className="font-mono">{activeDoseInfo.cals}</span>
                  </div>
                  <p className="text-[11px] text-stone-400">{activeDoseInfo.benefit}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: 4 Core Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-forest-900/50 hover:bg-forest-900 p-5 rounded-2xl border border-gold-500/20 hover:border-gold-400 transition-all duration-300 shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5 text-gold-400" />
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-forest-950 text-gold-300 border border-gold-500/30">
                        {feat.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {feat.title}
                    </h4>

                    <p className="text-xs text-stone-300 leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="text-sm font-bold text-white">
                  {language === 'ta' ? 'ஸ்மார்ட் பேக்கில் உங்கள் விருப்பமான எண்ணெய்' : 'Get PureVa Oils in Smart Bottle'}
                </h5>
                <p className="text-xs text-stone-300">
                  {language === 'ta' ? 'கடலை, நல்லெண்ணெய் & சூரியகாந்தி - 1 லிட்டர் ஸ்மார்ட் பேக்' : 'Available in 1 Litre Smart Measuring Bottle'}
                </p>
              </div>

              <button
                onClick={onShopOils}
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>{language === 'ta' ? 'ஸ்மார்ட் பேக் வாங்க' : 'Shop Smart Pack'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-forest-950" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
