import React from 'react';
import { Quote, CheckCircle, Heart } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';

export const Testimonials: React.FC = () => {
  const { language, t } = useLanguage();

  const tamilComments: Record<string, string> = {
    'test-1': 'SS மரச்செக்கு நல்லெண்ணெயில் இட்லி பொடி தொட்டு சாப்பிடும் போது கிராமத்து அசல் சுவையும் மணமும் கிடைக்கிறது. குடும்ப ஆரோக்கியத்திற்கு மிகச் சிறந்தது.',
    'test-2': 'தேங்காய் எண்ணெய் சுத்தமாகவும் சல்ஃபர் வாடை இன்றியும் உள்ளது. சமையலுக்கும் குடும்பத்தினரின் தலைமுடிக்கும் இதை மட்டுமே தொடர்ந்து பயன்படுத்துகிறோம்.',
    'test-3': 'சுத்திகரிக்கப்பட்ட எண்ணெய்களை விட இந்த எண்ணெய் மிகக் குறைந்த அளவே சமையலுக்கு தேவைப்படுகிறது. செரிமானத்திற்கும் உடலுக்கும் மிகவும் இதமாக உள்ளது.',
  };

  return (
    <section className="py-16 sm:py-24 bg-cream-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-gold-600 fill-gold-600" />
            <span>{t('testim.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 tracking-tight">
            {t('testim.title')}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {t('testim.subtitle')}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-cream-300/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Quote icon background decoration */}
              <div className="absolute top-6 right-6 text-cream-300 group-hover:text-gold-200 transition-colors">
                <Quote className="w-10 h-10 opacity-60" />
              </div>

              <div>
                {/* Verified Customer Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-950 text-xs font-bold mb-4">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('testim.verified')}</span>
                </div>

                {/* Comment quote */}
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic relative z-10">
                  "{language === 'ta' && tamilComments[item.id] ? tamilComments[item.id] : item.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-cream-200">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-400/60 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-forest-950 text-base">
                        {item.author}
                      </h4>
                      {item.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{item.role} • {item.location}</p>
                    <p className="text-[11px] text-forest-700 font-medium mt-0.5">
                      {language === 'ta' ? 'வாங்கிய பொருள்:' : 'Bought:'} {item.productPurchased}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Aggregate Ratings Callout */}
        <div className="mt-12 bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-6 border border-cream-300 max-w-xl mx-auto flex items-center justify-around text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">4.9/5</div>
            <div className="text-xs text-stone-500">{language === 'ta' ? 'ஒட்டுமொத்த மதிப்பீடு' : 'Overall Rating'}</div>
          </div>
          <div className="h-8 w-px bg-cream-300" />
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">98.4%</div>
            <div className="text-xs text-stone-500">{language === 'ta' ? 'பரிந்துரைப்பவர்கள்' : 'Would Recommend'}</div>
          </div>
          <div className="h-8 w-px bg-cream-300" />
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">100%</div>
            <div className="text-xs text-stone-500">{language === 'ta' ? 'தூய்மை உத்தரவாதம்' : 'Purity Guarantee'}</div>
          </div>
        </div>

      </div>
    </section>
  );
};
