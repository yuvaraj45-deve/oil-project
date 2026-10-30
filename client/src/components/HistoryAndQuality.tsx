import React from 'react';
import {
  History,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Eye,
  Target,
  Sun,
  Droplets,
  PackageCheck,
  Trees,
  HeartHandshake,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HistoryAndQuality: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div id="history-and-quality" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-12">
      
      {/* ============================================================ */}
      {/* 1. OUR HISTORY                                               */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-12 border border-cream-300 shadow-soft hover:shadow-card transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-colors" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/90 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs shrink-0">
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
                {t('about.history.title')}
              </h3>
            </div>
          </div>

          {/* User's Exact Copy */}
          <p className="text-stone-700 text-base sm:text-xl leading-relaxed font-serif italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/40 rounded-r-xl">
            "{t('about.history.desc')}"
          </p>

          {/* 3 Milestone Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Trees className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('about.history.p1.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.history.p1.desc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('about.history.p2.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.history.p2.desc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('about.history.p3.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.history.p3.desc')}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-cream-200 flex items-center gap-2 text-xs font-semibold text-amber-800">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{language === 'ta' ? 'வாடிக்கையாளர் நம்பிக்கையே எங்கள் அடையாளம்' : 'Customer Trust & Generational Tradition'}</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. PRODUCT QUALITY (Placed directly BELOW History)           */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-12 border border-cream-300 shadow-soft hover:shadow-card transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100/90 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
                {t('about.quality.title')}
              </h3>
            </div>
          </div>

          {/* User's Exact Copy */}
          <p className="text-stone-700 text-base sm:text-xl leading-relaxed font-serif italic border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/40 rounded-r-xl">
            "{t('about.quality.desc')}"
          </p>

          {/* 3 Quality Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <Droplets className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('about.quality.p1.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.quality.p1.desc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('about.quality.p2.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.quality.p2.desc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200/80">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('about.quality.p3.title')}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('about.quality.p3.desc')}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-cream-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{language === 'ta' ? 'அன்றாட சமையலுக்கு நம்பகமான தூய தேர்வு' : 'A Reliable Choice for Everyday Cooking'}</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. OUR VISION & MISSION                                      */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
        {/* Vision Card */}
        <div className="rounded-3xl bg-gradient-to-br from-forest-950 to-forest-900 text-cream-100 p-8 sm:p-10 shadow-soft relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-gold-400 border border-white/15 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div className="inline-block">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                {t('about.vision.badge')}
              </span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              {t('about.vision.title')}
            </h4>
            <p className="text-cream-200 text-sm sm:text-base leading-relaxed">
              {t('about.vision.desc')}
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div className="rounded-3xl bg-white p-8 sm:p-10 border border-cream-300 shadow-soft flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-forest-900/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-forest-900/10 text-forest-900 border border-forest-900/20 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div className="inline-block">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                {t('about.mission.badge')}
              </span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
              {t('about.mission.title')}
            </h4>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {t('about.mission.desc')}
            </p>
          </div>
          <div className="pt-6 mt-6 border-t border-cream-200 text-xs text-forest-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === 'ta' ? 'நேர்மையான தூய்மை & நியாயமான விலை' : 'Honest Purity at Fair Prices'}</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE 4 PURITY PILLARS (STANDARDS)                          */}
      {/* ============================================================ */}
      <section className="pt-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            {t('about.pillars.badge')}
          </span>
          <h4 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
            {t('about.pillars.title')}
          </h4>
          <p className="text-stone-600 text-xs sm:text-sm">
            {t('about.pillars.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="rounded-2xl bg-white p-6 border border-cream-300/90 shadow-soft hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-forest-950 text-base mb-1.5">
              {t('about.pill.1.title')}
            </h5>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t('about.pill.1.desc')}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl bg-white p-6 border border-cream-300/90 shadow-soft hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
              <Trees className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-forest-950 text-base mb-1.5">
              {t('about.pill.2.title')}
            </h5>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t('about.pill.2.desc')}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl bg-white p-6 border border-cream-300/90 shadow-soft hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-forest-950 text-base mb-1.5">
              {t('about.pill.3.title')}
            </h5>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t('about.pill.3.desc')}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-2xl bg-white p-6 border border-cream-300/90 shadow-soft hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-forest-950 text-base mb-1.5">
              {t('about.pill.4.title')}
            </h5>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t('about.pill.4.desc')}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
