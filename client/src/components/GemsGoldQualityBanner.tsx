import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const GemsGoldQualityBanner: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="bg-[#FFF9D5] py-10 sm:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Features 1 & 2 */}
          <div className="lg:col-span-4 flex flex-col justify-around space-y-8 sm:space-y-12 text-center">
            
            {/* Feature 1: Quality You Can Count On */}
            <div className="flex flex-col items-center">
              <img
                src="/showcase/icon_quality_clean.png"
                alt="Quality You Can Count On"
                className="w-14 h-14 object-contain mb-3"
              />
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 mb-2 tracking-tight">
                {language === 'ta' ? 'நம்பகமான தரம்' : 'Quality You Can Count On'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xs mx-auto">
                {language === 'ta'
                  ? 'ஒவ்வொரு முறையும் கவனமாக தயாரிக்கப்பட்டு தரப் பரிசோதனை செய்யப்படுகிறது.'
                  : 'Each batch is carefully processed and consistently tested.'}
              </p>
            </div>

            {/* Feature 2: Honest Processing */}
            <div className="flex flex-col items-center">
              <img
                src="/showcase/icon_honest_clean.png"
                alt="Honest Processing"
                className="w-14 h-12 object-contain mb-3"
              />
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 mb-2 tracking-tight">
                {language === 'ta' ? 'நேர்மையான முறை' : 'Honest Processing'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xs mx-auto">
                {language === 'ta'
                  ? 'ரசாயனங்களோ, கலப்படங்களோ இன்றி பெறப்படும் அசல் தூய எண்ணெய்.'
                  : 'No additives. No chemicals. Just pure, simple oils.'}
              </p>
            </div>

          </div>

          {/* Center Column: SS OIL Authentic Cold-Pressed Bottles Presentation */}
          <div className="lg:col-span-4 flex justify-center order-first lg:order-none">
            <div className="relative rounded-3xl overflow-hidden shadow-sm max-w-[340px] w-full border border-amber-300/50 bg-gradient-to-b from-amber-50/80 via-white/40 to-amber-100/50 p-6 flex flex-col items-center justify-center group">
              <div className="relative flex items-center justify-center h-64 sm:h-72 w-full">
                {/* Bottle 1: Sesame (left, angled) */}
                <img
                  src="/products/sesame_oil.png"
                  alt="SS OIL Pure Sesame Oil"
                  className="absolute left-3 bottom-2 h-48 sm:h-56 object-contain drop-shadow-xl -rotate-6 group-hover:-rotate-3 transition-transform duration-500 z-10"
                />
                {/* Bottle 2: Groundnut (center, prominent) */}
                <img
                  src="/products/groundnut_oil.png"
                  alt="SS OIL Pure Groundnut Oil"
                  className="relative h-56 sm:h-64 object-contain drop-shadow-2xl z-20 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Bottle 3: Coconut (right, angled) */}
                <img
                  src="/products/coconut_oil.png"
                  alt="SS OIL Pure Coconut Oil"
                  className="absolute right-3 bottom-2 h-48 sm:h-56 object-contain drop-shadow-xl rotate-6 group-hover:rotate-3 transition-transform duration-500 z-10"
                />
              </div>

              {/* Quality Seal Badge */}
              <div className="mt-3 px-3.5 py-1.5 rounded-full bg-forest-950 text-gold-300 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>100% Mara Chekku • SS OIL Heritage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Features 3 & 4 */}
          <div className="lg:col-span-4 flex flex-col justify-around space-y-8 sm:space-y-12 text-center">
            
            {/* Feature 3: Single-Origin Sourcing */}
            <div className="flex flex-col items-center">
              <img
                src="/showcase/icon_sourcing_clean.png"
                alt="Single-Origin Sourcing"
                className="w-14 h-14 object-contain mb-3"
              />
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 mb-2 tracking-tight">
                {language === 'ta' ? 'நேரடி விவசாய உற்பத்தி' : 'Single-Origin Sourcing'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xs mx-auto">
                {language === 'ta'
                  ? 'நம்பகமான உள்ளூர் விவசாயிகளிடம் இருந்து பெறப்படும் கலப்படமற்ற தூய விதைகள்.'
                  : 'We work with trusted local growers to ensure pure, unblended oils with nothing hidden.'}
              </p>
            </div>

            {/* Feature 4: Versatile for Indian Cooking */}
            <div className="flex flex-col items-center">
              <img
                src="/showcase/icon_cooking_clean.png"
                alt="Versatile for Indian Cooking"
                className="w-14 h-12 object-contain mb-3"
              />
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-stone-900 mb-2 tracking-tight">
                {language === 'ta' ? 'இந்திய சமையலுக்கு ஏற்றது' : 'Versatile for Indian Cooking'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xs mx-auto">
                {language === 'ta'
                  ? 'பொரித்தல், தாளித்தல் என அனைத்து வகை இந்திய சமையலுக்கும் சுவையும் மணமும் தரும்.'
                  : 'Whether you’re frying, seasoning, or sauteing, our oils deliver.'}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

