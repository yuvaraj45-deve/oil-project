import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PromiseOfPurityProps {
  onKnowMore: () => void;
}

export const PromiseOfPurity: React.FC<PromiseOfPurityProps> = ({ onKnowMore }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-cream-50/50 border-b border-cream-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Glass bowl of golden oil with cursive text */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-900 border-4 border-white">
              <div className="relative h-80 sm:h-96 lg:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
                  alt={t('promise.quote')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                
                {/* Handwritten Cursive Overlay */}
                <div className="absolute top-6 left-6 text-white">
                  <span className="font-serif italic text-2xl sm:text-3xl font-light tracking-wide drop-shadow-md block">
                    {language === 'ta' ? 'உண்மையான எண்ணெய்.' : 'Real Oil.'}
                  </span>
                  <span className="font-serif italic text-2xl sm:text-3xl font-light tracking-wide drop-shadow-md block">
                    {language === 'ta' ? 'உண்மையான நலம்.' : 'Real Goodness.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Promise Details & Decorative Leaf */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-block">
              <span className="text-xs font-bold text-forest-800 tracking-[0.18em] uppercase">
                {t('promise.badge')}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight leading-tight">
              {language === 'ta' ? (
                <>
                  எங்கள் தூய்மையின் <br />
                  <span className="text-forest-900">வாக்குறுதி</span>
                </>
              ) : (
                <>
                  Our Promise <br />
                  <span className="text-forest-900">of Purity</span>
                </>
              )}
            </h2>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-lg">
              {t('promise.desc')}
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onKnowMore}
                className="px-8 py-3.5 rounded-full bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-sm transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <span>{t('promise.knowMore')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Decorative Hand-drawn Leaf & Cursive Sketch */}
              <div className="flex flex-col items-center pr-6 sm:pr-10 text-emerald-800 opacity-90 select-none">
                <Leaf className="w-8 h-8 stroke-1 text-emerald-700" />
                <span className="font-serif italic text-sm text-emerald-800 leading-tight mt-1 text-center">
                  {language === 'ta' ? (
                    <>தூய்மை<br />ஆரோக்கியம்<br />மகிழ்ச்சி</>
                  ) : (
                    <>Pure<br />Healthy<br />Happy</>
                  )}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
