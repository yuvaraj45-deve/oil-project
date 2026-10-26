import React from 'react';
import { OilSommelier } from '../components/OilSommelier';
import { Product } from '../types';
import { Flame, Sparkles, ChefHat, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SommelierPageProps {
  onAddToCart: (product: Product, packSize: string) => void;
  onQuickView: (product: Product) => void;
  onExploreShop: () => void;
}

export const SommelierPage: React.FC<SommelierPageProps> = ({
  onAddToCart,
  onQuickView,
  onExploreShop,
}) => {
  const { language } = useLanguage();

  return (
    <div className="bg-cream-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <ChefHat className="w-4 h-4 text-gold-600" />
            <span>{language === 'ta' ? 'மாஸ்டர் சமையல் வழிகாட்டி' : 'Master Culinary Guide'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {language === 'ta' ? 'செஃப்-ன் எண்ணெய் வழிகாட்டி' : "The Chef's Oil Sommelier"}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {language === 'ta'
              ? 'எல்லா சமையல் எண்ணெய்களும் ஒரே மாதிரி செயல்படுவதில்லை. உங்கள் சமையல் முறைக்கு ஏற்ற மரச்செக்கு எண்ணெயை புகைப்புள்ளி, அடர்த்தி மற்றும் நறுமணத்தின் அடிப்படையில் தேர்வு செய்யுங்கள்.'
              : 'Not all edible oils perform the same. Select your cooking style below to match with the ideal Mara Chekku oil based on smoke points, viscosity, and authentic flavor profiles.'}
          </p>
        </div>

        {/* The Interactive Sommelier Widget */}
        <OilSommelier onAddToCart={onAddToCart} onQuickView={onQuickView} />

        {/* Master Cooking Smoke Point Matrix */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
              {language === 'ta' ? 'புகைப்புள்ளி & சமையல் பொருந்தக்கூடிய அட்டவணை' : 'Smoke Point & Culinary Compatibility Chart'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'ta'
                ? 'எண்ணெயை அதன் புகைப்புள்ளிக்கு மேல் சூடாக்குவது அதன் சத்துக்களையும் நன்மைகளையும் சிதைக்கும்.'
                : 'Heating oil past its smoke point creates acrolein and breaks down antioxidants.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                {language === 'ta' ? 'தினசரி சமையல் எண்ணெய்' : 'Everyday Cooking Oil'}
              </span>
              <div className="text-2xl font-serif font-bold text-amber-950">240°C</div>
              <span className="text-[11px] text-amber-800 font-semibold block">
                {language === 'ta' ? 'அதி தீவிர பொரியல் & ரொட்டி' : 'High Heat & Deep Frying'}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'அதிக புகைப்புள்ளி மொறுமொறுப்பான பூரி, ரொட்டி மற்றும் வறுவலுக்கு குறைந்த எண்ணெய் உறிஞ்சுதலை உறுதி செய்கிறது.'
                  : 'High smoke point allows crispy puris, rotis, and sautéing with low absorption and clean flavor.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">
                {language === 'ta' ? 'மரச்செக்கு நல்லெண்ணெய்' : 'Sesame (Gingelly)'}
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-950">210°C</div>
              <span className="text-[11px] text-emerald-800 font-semibold block">
                {language === 'ta' ? 'தாளிப்பு & பொடி கலவை' : 'Tempering & Sauté'}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'கடுகு தாளிப்பு, ரசம், புளியோதரை மற்றும் சூடான இட்லி மிளகாய் பொடிக்கு மிகச் சிறந்தது.'
                  : 'Essential for mustard tadka, rasam, puliyodharai, and raw mixing with hot idli milagai podi.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <span className="text-xs font-bold text-blue-900 block">
                {language === 'ta' ? 'தூய தேங்காய் எண்ணெய்' : 'Virgin Coconut Oil'}
              </span>
              <div className="text-2xl font-serif font-bold text-blue-950">177°C</div>
              <span className="text-[11px] text-blue-800 font-semibold block">
                {language === 'ta' ? 'பாரம்பரிய குழம்பு & அவியல்' : 'Coastal Curries'}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'அவியல், மீன் குழம்பு, மோர் குழம்பு மற்றும் நோய் எதிர்ப்பு சக்தி தரும் லாரிக் அமிலம் நிறைந்தது.'
                  : 'Avial, fish stew, mor kulambu, and raw wellness dressing loaded with immune-boosting Lauric acid.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gold-50/60 border border-gold-200/80 space-y-2">
              <span className="text-xs font-bold text-gold-900 block">
                {language === 'ta' ? 'A2 நாட்டு மாட்டு நெய்' : 'A2 Cow Bilona Ghee'}
              </span>
              <div className="text-2xl font-serif font-bold text-gold-950">250°C</div>
              <span className="text-[11px] text-gold-800 font-semibold block">
                {language === 'ta' ? 'அதிக வெப்பம் & இனிப்புகள்' : 'High Heat & Sweets'}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'பாரம்பரிய பிலோனா முறையில் காய்ச்சப்பட்ட நெய். பரோட்டா மற்றும் இனிப்புகளுக்கு இணையற்ற சுவை.'
                  : 'Zero lactose solids after traditional clarifying. Highest heat tolerance for parathas and roasts.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            onClick={onExploreShop}
            className="px-8 py-4 rounded-2xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{language === 'ta' ? 'அனைத்து பொருட்களையும் பார்க்க' : 'Browse Full Product Collection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
