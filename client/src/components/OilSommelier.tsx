import React, { useState } from 'react';
import { ChefHat, Flame, Award, Heart, Droplets, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { CULINARY_PAIRINGS_DATA, PRODUCTS_DATA } from '../data/oilData';
import { CulinaryPairing, Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OilSommelierProps {
  onAddToCart: (product: Product, packSize: string) => void;
  onQuickView: (product: Product) => void;
}

export const OilSommelier: React.FC<OilSommelierProps> = ({
  onAddToCart,
  onQuickView,
}) => {
  const { language } = useLanguage();
  const [selectedPairingId, setSelectedPairingId] = useState(CULINARY_PAIRINGS_DATA[0].id);
  const [addedItem, setAddedItem] = useState(false);

  const activePairing: CulinaryPairing =
    CULINARY_PAIRINGS_DATA.find((p) => p.id === selectedPairingId) || CULINARY_PAIRINGS_DATA[0];

  const matchedProduct: Product | undefined = PRODUCTS_DATA.find(
    (p) => p.id === activePairing.productId
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Sparkles':
      case 'Award':
        return <Award className="w-5 h-5 text-gold-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-emerald-600" />;
      default:
        return <Award className="w-5 h-5 text-gold-500" />;
    }
  };

  const handleQuickAdd = () => {
    if (matchedProduct) {
      onAddToCart(matchedProduct, matchedProduct.defaultPack);
      setAddedItem(true);
      setTimeout(() => setAddedItem(false), 1200);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-cream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider mb-3">
            <ChefHat className="w-4 h-4 text-forest-800" />
            <span>{language === 'ta' ? 'ஊடாடும் சமையல் வழிகாட்டி' : 'Interactive Culinary Guide'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 tracking-tight">
            {language === 'ta' ? 'செஃப்-ன் எண்ணெய் வழிகாட்டி' : 'Chef’s Oil Sommelier'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'ta'
              ? 'உங்கள் உணவு வகையைத் தேர்வு செய்து, அதற்குப் பொருத்தமான பாரம்பரிய மரச்செக்கு எண்ணெயைக் கண்டறியுங்கள்.'
              : 'Select your culinary dish to reveal the exact traditional oil formulated for that heat and aroma.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Dish Category Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {CULINARY_PAIRINGS_DATA.map((pairing) => {
            const isSelected = pairing.id === selectedPairingId;
            return (
              <button
                key={pairing.id}
                onClick={() => setSelectedPairingId(pairing.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-forest-900 text-cream-100 border-forest-900 shadow-md scale-102 ring-2 ring-gold-400'
                    : 'bg-white hover:bg-cream-50 text-stone-800 border-cream-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-forest-800' : 'bg-cream-100'}`}>
                    {getIcon(pairing.iconName)}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-forest-950 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base leading-snug">
                    {pairing.dishCategory}
                  </h4>
                  <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-cream-200' : 'text-stone-500'}`}>
                    {pairing.dishes}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sommelier Recommendation Stage Card */}
        {matchedProduct && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Product Visual */}
              <div className="lg:col-span-4 relative">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 p-4 flex items-center justify-center">
                  <img
                    src={matchedProduct.image}
                    alt={matchedProduct.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-6 left-6 bg-forest-900 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {language === 'ta' ? 'சிறந்த பரிந்துரை' : 'Ideal Recommendation'}
                  </div>
                </div>
              </div>

              {/* Recommendation Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full">
                    {activePairing.smokePoint}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {language === 'ta' ? `விலை: ₹${activePairing.price}` : `Sample Starting at ₹${activePairing.price} (${matchedProduct.defaultPack})`}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-forest-950">
                  {language === 'ta' ? (matchedProduct.tamilName || activePairing.recommendedOilName) : activePairing.recommendedOilName}
                </h3>

                <div className="p-3.5 rounded-2xl bg-cream-100 border border-cream-200 text-xs sm:text-sm text-stone-700">
                  <strong className="text-forest-950 block mb-0.5">
                    {language === 'ta' ? 'பொருத்தமான உணவுகள்:' : 'Best For Dishes:'}
                  </strong>
                  <span>{activePairing.dishes}</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  <p>
                    <strong className="text-forest-950">
                      {language === 'ta' ? 'ஏன் இந்த பொருத்தம் சிறந்தது: ' : 'Why This Match Works: '}
                    </strong>
                    {activePairing.whyItWorks}
                  </p>
                  <p>
                    <strong className="text-forest-950">
                      {language === 'ta' ? 'நறுமணம் & சுவை: ' : 'Aroma & Taste: '}
                    </strong>
                    {activePairing.flavorAroma}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleQuickAdd}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      addedItem
                        ? 'bg-emerald-700 text-white'
                        : 'bg-forest-900 hover:bg-forest-800 text-cream-100 shadow-sm'
                    }`}
                  >
                    {addedItem ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{language === 'ta' ? 'கூடையில் சேர்க்கப்பட்டது!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{language === 'ta' ? 'கூடையில் சேர்க்க' : `Add ${matchedProduct.name} to Cart`}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onQuickView(matchedProduct)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-cream-100 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{language === 'ta' ? 'முழு விவரங்கள்' : 'View Nutrition & Specs'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
