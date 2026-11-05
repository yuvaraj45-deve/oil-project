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
  const { t, language } = useLanguage();

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

        {/* Heritage Purity Guarantee Banner */}
        <div className="bg-forest-950 rounded-3xl p-8 sm:p-12 text-cream-100 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gold-400 text-forest-950">
              <ShieldCheck className="w-3.5 h-3.5" /> {language === 'ta' ? '100% மரச்செக்கு தூய்மை' : '100% Mara Chekku Purity'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white">
              {language === 'ta' ? 'அசல் மரச்செக்கு எண்ணெய் உத்தரவாதம்' : 'Authentic Mara Chekku Heritage Guarantee'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              {language === 'ta'
                ? 'பூச்சிக்கொல்லி மற்றும் ரசாயன கலப்பற்ற நாட்டு விதைகளை வாகை மரச்செக்கில் மெதுவாக பிழிந்து எடுக்கப்படும் 100% இயற்கை எண்ணெய்.'
                : 'Cold wood-pressed under 38°C in traditional Vaagai mortars with zero chemicals, zero hexane, and zero artificial heat.'}
            </p>
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={onShopOils}
                className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                {language === 'ta' ? 'எண்ணெய் வகைகளை வாங்குக →' : 'Shop 100% Pure Oils →'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
