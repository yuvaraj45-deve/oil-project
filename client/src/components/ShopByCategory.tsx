import React from 'react';
import { ArrowRight, Droplets } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';

interface ShopByCategoryProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory: string;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const { language } = useLanguage();

  const getCategoryDetails = (slug: string) => {
    if (language !== 'ta') return null;
    switch (slug) {
      case 'cooking-oil':
        return {
          title: 'சமையல் எண்ணெய்',
          subtitle: 'தினசரி ஆரோக்கிய சமையலுக்கு ஏற்ற எண்ணெய்',
          badge: 'தினசரி பயன்பாடு',
          itemCount: '6 வகைகள்',
          highlightText: 'இயற்கை வடித்தல் & அதிக கொதிநிலை',
        };
      case 'sesame-oil':
        return {
          title: 'மரச்செக்கு நல்லெண்ணெய்',
          subtitle: 'கருப்பட்டி சேர்த்து ஆட்டப்பட்ட பாரம்பரிய நல்லெண்ணெய்',
          badge: 'அசல் நல்லெண்ணெய்',
          itemCount: '4 வகைகள்',
          highlightText: 'இயற்கை பனை கருப்பட்டி சேர்த்தது',
        };
      case 'coconut-oil':
        return {
          title: 'மரச்செக்கு தேங்காய் எண்ணெய்',
          subtitle: 'கந்தகமில்லா கொப்பரை தேங்காய் எண்ணெய்',
          badge: '100% அசல் தூய்மை',
          itemCount: '4 வகைகள்',
          highlightText: 'சூரிய ஒளியில் உலர்த்திய கொப்பரை',
        };
      default:
        return null;
    }
  };

  return (
    <section id="categories" className="py-16 sm:py-20 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Droplets className="w-3.5 h-3.5 text-gold-600" />
            <span>{language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட வகைகள்' : 'Curated Collections'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
            {language === 'ta' ? 'வகைகளின்படி எண்ணெய்' : 'Shop by Category'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'ta'
              ? 'எங்கள் மரச்செக்கு மற்றும் தினசரி சமையல் எண்ணெய்களில் இருந்து உங்களுக்கு ஏற்றதை தேர்வு செய்யுங்கள்.'
              : 'Choose from our pure range of authentic cold-pressed and kitchen-essential oils.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Clean Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const taDetails = getCategoryDetails(cat.slug);
            const title = taDetails?.title || cat.title;
            const subtitle = taDetails?.subtitle || cat.subtitle;
            const badge = taDetails?.badge || cat.badge;
            const itemCount = taDetails?.itemCount || cat.itemCount;
            const highlightText = taDetails?.highlightText || cat.highlightText;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group rounded-3xl overflow-hidden bg-cream-50 border cursor-pointer transition-all duration-300 shadow-soft hover:shadow-card hover:-translate-y-1.5 flex flex-col justify-between ${
                  isSelected
                    ? 'border-forest-800 ring-2 ring-forest-800 bg-white'
                    : 'border-cream-300 hover:border-gold-400 hover:bg-white'
                }`}
              >
                {/* Category Image */}
                <div className="relative h-60 overflow-hidden bg-cream-200">
                  <img
                    src={cat.image}
                    alt={title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-forest-900 shadow-sm backdrop-blur-xs">
                      {badge}
                    </span>
                  </div>

                  {/* Variety Count */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <span className="font-medium text-cream-200">{itemCount}</span>
                    <span className="text-[10px] bg-forest-950/80 px-2 py-0.5 rounded text-gold-300">
                      SS OIL
                    </span>
                  </div>
                </div>

                {/* Category Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {subtitle}
                    </p>
                    <p className="text-[11px] text-forest-800 font-semibold mt-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      {highlightText}
                    </p>
                  </div>

                  {/* Category Action CTA Button */}
                  <div className="mt-5 pt-3.5 border-t border-cream-200">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-forest-900 text-stone-800 group-hover:text-cream-100 font-bold text-xs border border-cream-300 group-hover:border-forest-900 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>{language === 'ta' ? `${title} பார்க்க` : `Explore ${title}`}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
