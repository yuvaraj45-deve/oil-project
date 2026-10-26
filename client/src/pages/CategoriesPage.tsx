import React from 'react';
import { ShopByCategory } from '../components/ShopByCategory';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesPageProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { language } = useLanguage();

  return (
    <div className="bg-cream-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <span>{language === 'ta' ? 'பாரம்பரிய பிரிவுகள்' : 'Harvest Taxonomies'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {language === 'ta' ? 'வகைகளின்படி எண்ணெய் தேடவும்' : 'Explore Oils by Category'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? 'பாரம்பரிய வாகை மரச்செக்கு நல்லெண்ணெய், கடலை எண்ணெய் முதல் அசல் தேங்காய் எண்ணெய் வரை, இயற்கை விவசாயிகளிடம் இருந்து பெறப்படும் சமையல் எண்ணெய்களைக் கண்டறியுங்கள்.'
              : 'From traditional stone-ground mara chekku to cultured bilona cow ghee, discover genuine culinary oils sourced directly from regional organic farmers.'}
          </p>
        </div>

        {/* Categories Component */}
        <ShopByCategory onSelectCategory={onSelectCategory} selectedCategory="all" />

        {/* Detailed Category Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
              {language === 'ta' ? 'பிரிவு 01' : 'Category 01'}
            </span>
            <h3 className="font-serif font-bold text-xl text-forest-950">
              {language === 'ta' ? 'பாரம்பரிய நல்லெண்ணெய்' : 'Traditional Sesame (Gingelly) Oils'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'இயற்கை பனை கருப்பட்டி சேர்த்து வாகை மரச்செக்கில் மெதுவாக ஆட்டப்பட்டது. இயற்கையான செசமால் ஆன்டி-ஆக்சிடன்ட்கள் நிறைந்தது.'
                : "Infused with organic palm jaggery (Karupatti) to counter sesame's natural pungency. Rich in natural Sesamol, calcium, and hearth-side taste."}
            </p>
            <button
              onClick={() => onSelectCategory('sesame-oil')}
              className="text-xs font-bold text-forest-900 hover:text-gold-700 flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>{language === 'ta' ? 'நல்லெண்ணெய் பார்க்க' : 'Explore Sesame Oils'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              {language === 'ta' ? 'பிரிவு 02' : 'Category 02'}
            </span>
            <h3 className="font-serif font-bold text-xl text-forest-950">
              {language === 'ta' ? 'தூய மரச்செக்கு தேங்காய் எண்ணெய்' : 'Cold-Pressed Virgin Coconut Oils'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'கந்தகமில்லா இயற்கை கொப்பரையில் இருந்து பிழியப்பட்டது. சமையல் மற்றும் தலைமுடிக்கு ஏற்ற 64% லாரிக் அமிலம் நிறைந்தது.'
                : 'Extracted from sulphur-free coastal sun-dried copra. 100% raw, transparent, velvety texture loaded with natural Lauric Acid.'}
            </p>
            <button
              onClick={() => onSelectCategory('coconut-oil')}
              className="text-xs font-bold text-forest-900 hover:text-gold-700 flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>{language === 'ta' ? 'தேங்காய் எண்ணெய் பார்க்க' : 'Explore Coconut Oils'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
