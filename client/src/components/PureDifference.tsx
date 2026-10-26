import React from 'react';
import { Droplet, FlaskConical, Award, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PureDifference: React.FC = () => {
  const { t } = useLanguage();

  const differences = [
    {
      icon: <Droplet className="w-6 h-6 text-forest-800" />,
      title: t('diff.f1.title'),
      desc: t('diff.f1.desc'),
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-forest-800" />,
      title: t('diff.f2.title'),
      desc: t('diff.f2.desc'),
    },
    {
      icon: <Award className="w-6 h-6 text-forest-800" />,
      title: t('diff.f3.title'),
      desc: t('diff.f3.desc'),
    },
    {
      icon: <Leaf className="w-6 h-6 text-forest-800" />,
      title: t('diff.f4.title'),
      desc: t('diff.f4.desc'),
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-forest-800 tracking-[0.18em] uppercase block mb-1.5">
            {t('diff.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
            {t('diff.title')}
          </h2>
        </div>

        {/* 4 Feature Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {differences.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-cream-50/70 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-forest-900/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-forest-950">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
