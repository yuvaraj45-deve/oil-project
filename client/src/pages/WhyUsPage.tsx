import React from 'react';
import { PurityComparison } from '../components/PurityComparison';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WhyUsPageProps {
  onShopOils: () => void;
  onOpenLabModal: () => void;
}

export const WhyUsPage: React.FC<WhyUsPageProps> = ({ onShopOils, onOpenLabModal }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-cream-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <span>{t('whyus.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {t('whyus.title')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('whyus.subtitle')}
          </p>
        </div>

        {/* Side-by-side Truth Comparison */}
        <PurityComparison />

        {/* 4 Pillars Component */}
        <WhyChooseUs />

        {/* Official Lab Certificate CTA Banner */}
        <div className="bg-forest-950 rounded-3xl p-8 sm:p-12 text-cream-100 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gold-400 text-forest-950">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('whyus.certBadge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white">
              {t('whyus.certTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              {t('whyus.certDesc')}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenLabModal}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                {t('whyus.inspectCert')}
              </button>
              <button
                onClick={onShopOils}
                className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold text-xs transition-colors border border-forest-800 cursor-pointer"
              >
                {t('whyus.shopVerified')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
