import React from 'react';
import { Award, CheckCircle2, Droplets, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 sm:py-24 bg-cream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Imagery Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-3xl overflow-hidden shadow-card border border-cream-300 relative group">
                <img
                  src="https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Wood Press Ghani Process"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-cream-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400 bg-forest-900/80 px-2 py-0.5 rounded">
                    {t('about.tradHeritage')}
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mt-1">
                    {t('about.vaagaiTitle')}
                  </h4>
                  <p className="text-xs text-cream-200">
                    {t('about.vaagaiDesc')}
                  </p>
                </div>
              </div>

              {/* Floating pill badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-card border border-cream-300 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 fill-gold-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{t('about.unadulterated')}</div>
                    <div className="text-[11px] text-stone-500">{t('about.noDilution')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-forest-800" />
              <span>{t('about.storyBadge')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 tracking-tight leading-snug">
              {t('about.storyTitle')}
            </h2>

            <p className="text-stone-600 text-base leading-relaxed">
              {t('about.storyP1')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-cream-300/80 shadow-xs">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('about.singleOrigin')}</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t('about.singleOriginDesc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-cream-300/80 shadow-xs">
                <div className="flex items-center gap-2 text-forest-900 font-bold text-sm mb-1">
                  <Award className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>{t('about.zeroPreservatives')}</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t('about.zeroPreservativesDesc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-6 text-sm text-stone-600">
              <div>
                <span className="block text-2xl font-serif font-black text-forest-900">40+</span>
                <span className="text-xs text-stone-500">{t('about.yearsTrust')}</span>
              </div>
              <div className="w-px h-10 bg-cream-300" />
              <div>
                <span className="block text-2xl font-serif font-black text-forest-900">50K+</span>
                <span className="text-xs text-stone-500">{t('about.satisfiedKitchens')}</span>
              </div>
              <div className="w-px h-10 bg-cream-300" />
              <div>
                <span className="block text-2xl font-serif font-black text-forest-900">100%</span>
                <span className="text-xs text-stone-500">{t('about.farmSourced')}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
