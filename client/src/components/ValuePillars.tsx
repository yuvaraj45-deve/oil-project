import React from 'react';
import { Leaf, Heart, ShieldCheck, Sprout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ValuePillars: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: <Leaf className="w-7 h-7 text-forest-800" />,
      title: t('pillar.1.title'),
      description: t('pillar.1.desc'),
    },
    {
      icon: <Heart className="w-7 h-7 text-forest-800" />,
      title: t('pillar.2.title'),
      description: t('pillar.2.desc'),
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-forest-800" />,
      title: t('pillar.3.title'),
      description: t('pillar.3.desc'),
    },
    {
      icon: <Sprout className="w-7 h-7 text-forest-800" />,
      title: t('pillar.4.title'),
      description: t('pillar.4.desc'),
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-cream-50/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-forest-900/10 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-forest-950">
                {item.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
