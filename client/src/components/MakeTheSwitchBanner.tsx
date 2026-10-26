import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MakeTheSwitchBannerProps {
  onShopNow: () => void;
}

export const MakeTheSwitchBanner: React.FC<MakeTheSwitchBannerProps> = ({ onShopNow }) => {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#24432d] text-white py-14 sm:py-18">
      
      {/* Background Panoramic Green Farmland Imagery */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#173020]/90 via-[#203c28]/80 to-[#173020]/90 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Cursive text */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <span className="font-serif italic text-2xl sm:text-3xl text-cream-100/90 font-light tracking-wide block drop-shadow-md">
              {language === 'ta' ? (
                <>
                  ஆரோக்கிய சமையல் <br />
                  ஆனந்த வாழ்க்கை
                </>
              ) : (
                <>
                  Healthy Cooking <br />
                  Happier Living
                </>
              )}
            </span>
          </div>

          {/* Center: Main CTA text & Button */}
          <div className="lg:col-span-6 text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
              {t('switch.title')}
            </h2>
            <p className="text-sm sm:text-base text-stone-200">
              {t('switch.desc')}
            </p>
            <div className="pt-2">
              <button
                onClick={onShopNow}
                className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-forest-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-black/25 inline-flex items-center gap-2 cursor-pointer group"
              >
                <span>{t('switch.shopNow')}</span>
                <ArrowRight className="w-4 h-4 text-forest-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Delicious Food Bowl */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80"
                alt="Delicious healthy cooking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
