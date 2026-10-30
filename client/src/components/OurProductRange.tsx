import React, { useState } from 'react';
import { ArrowRight, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_DATA } from '../data/oilData';

interface CategoryItem {
  id: string;
  name: string;
  tamilName: string;
  slug: string;
  image: string;
  badge: string;
  badgeTa: string;
  benefit: string;
  startingPrice: string;
  group: 'all' | 'wood-pressed' | 'cooking' | 'pooja' | 'ghee-jaggery';
}

interface OurProductRangeProps {
  onShopProduct: (slug: string) => void;
}

export const OurProductRange: React.FC<OurProductRangeProps> = ({ onShopProduct }) => {
  const { language, t } = useLanguage();
  const { products, categories: storeCategories } = useStore();
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const getStartingPrice = (slug: string, fallback: string) => {
    if (!products || products.length === 0) return fallback;
    const prods = products.filter((p) => p.category === slug || (slug === 'cooking-oil' && (p.category === 'cooking-oil' || p.name.includes('Sunflower'))));
    if (prods.length === 0) return fallback;
    const minPrice = Math.min(...prods.map((p) => p.price));
    return `₹${minPrice}`;
  };

  const rawCategories = storeCategories && storeCategories.length > 0 ? storeCategories : CATEGORIES_DATA;

  const PRESET_METADATA: Record<string, Partial<CategoryItem>> = {
    'groundnut-oil': {
      tamilName: 'மரச்செக்கு கடலை எண்ணெய்',
      badge: 'Wood-Pressed',
      badgeTa: 'மரச்செக்கு',
      benefit: 'Rich in natural Vitamin E, heart-healthy MUFA & authentic aroma',
      startingPrice: '₹180',
      group: 'wood-pressed',
    },
    'sesame-oil': {
      tamilName: 'மரச்செக்கு நல்லெண்ணெய்',
      badge: 'Bestseller',
      badgeTa: 'அதிக விற்பனை',
      benefit: 'Slow-pressed with palm jaggery, high in calcium & sesamol antioxidants',
      startingPrice: '₹210',
      group: 'wood-pressed',
    },
    'coconut-oil': {
      tamilName: 'பாரம்பரிய தேங்காய் எண்ணெய்',
      badge: 'Raw Cold-Pressed',
      badgeTa: 'மரச்செக்கு',
      benefit: 'Sulphur-free sun-dried copra, 64% Lauric Acid for cooking, hair & skin',
      startingPrice: '₹170',
      group: 'wood-pressed',
    },
    'cooking-oil': {
      tamilName: 'தூய சமையல் எண்ணெய்',
      badge: 'Light & Pure',
      badgeTa: 'லேசானது & தூயது',
      benefit: 'Light non-sticky texture, rich in Vitamin E with high smoke point',
      startingPrice: '₹115',
      group: 'cooking',
    },
    'pooja-special': {
      tamilName: 'பஞ்ச தீப பூஜை எண்ணெய்',
      badge: 'Temple Pooja',
      badgeTa: 'பூஜை சிறப்பு',
      benefit: 'Traditional 5 sacred oils blend for divine prosperity and positive aura',
      startingPrice: '₹140',
      group: 'pooja',
    },
    'a2-desi-ghee': {
      tamilName: 'நாட்டு மாட்டு நெய் (பிலோனா)',
      badge: 'Bilona Churned',
      badgeTa: 'பிலோனா நெய்',
      benefit: 'Made from cultured A2 curd churned with traditional wooden bilona',
      startingPrice: '₹450',
      group: 'ghee-jaggery',
    },
    'palm-jaggery-special': {
      tamilName: 'உடன்குடி பனை கருப்பட்டி',
      badge: 'Native Pure',
      badgeTa: 'இயற்கை தூய்மை',
      benefit: '100% natural unrefined palm nectar rich in plant iron & minerals',
      startingPrice: '₹160',
      group: 'ghee-jaggery',
    },
  };

  // Dynamically map all categories so newly added categories in Admin appear live on the homepage
  const categories: CategoryItem[] = rawCategories.map((c) => {
    const meta = PRESET_METADATA[c.slug] || {};
    return {
      id: c.id || c.slug,
      name: c.title,
      tamilName: c.tamilTitle || meta.tamilName || c.title,
      slug: c.slug,
      image: c.image || '/products/sesame_oil.jpg',
      badge: c.badge || meta.badge || '100% Pure',
      badgeTa: c.badgeTa || meta.badgeTa || c.badge || '100% தூய்மை',
      benefit: c.subtitle || meta.benefit || 'Traditional cold-pressed authentic extraction',
      startingPrice: meta.startingPrice || '₹150',
      group: (meta.group as any) || 'all',
    };
  });

  const filterTabs = [
    { id: 'all', label: t('range.tab.all'), count: categories.length },
    { id: 'wood-pressed', label: t('range.tab.woodPressed'), count: categories.filter(c => c.group === 'wood-pressed').length },
    { id: 'cooking', label: t('range.tab.cooking'), count: categories.filter(c => c.group === 'cooking').length },
    { id: 'pooja', label: t('range.tab.pooja'), count: categories.filter(c => c.group === 'pooja').length },
    { id: 'ghee-jaggery', label: t('range.tab.gheeJaggery'), count: categories.filter(c => c.group === 'ghee-jaggery').length },
  ];

  const filteredCategories = categories.filter((cat) => {
    if (activeGroup === 'all') return true;
    return cat.group === activeGroup;
  });

  return (
    <section id="our-products" className="py-14 sm:py-20 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {t('range.title')}
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('range.subtitle')}
          </p>
        </div>

        {/* Filter Tabs for Product Categories (Single Clean Selector) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGroup(tab.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeGroup === tab.id
                  ? 'bg-forest-950 text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Product Categories Grid (Clean Single Presentation) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredCategories.map((item) => {
            const displayName =
              language === 'ta' && (item.tamilName || t(`cat.${item.id}.name`))
                ? (item.tamilName || t(`cat.${item.id}.name`))
                : item.name;
            const displayBenefit = (language === 'ta' && t(`cat.${item.id}.benefit`)) || item.benefit;
            const displayBadge = language === 'ta' ? (item.badgeTa || item.badge) : item.badge;

            return (
              <div
                key={item.id}
                onClick={() => onShopProduct(item.slug)}
                className="group bg-[#fbfaf7] hover:bg-white rounded-3xl p-5 sm:p-6 border border-cream-200 hover:border-gold-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Product Category Visual */}
                <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 bg-white p-2 flex items-center justify-center shadow-xs">
                  <img
                    src={item.image}
                    alt={displayName}
                    className="w-full h-full object-cover object-center rounded-xl group-hover:scale-108 transition-transform duration-500"
                  />
                  
                  {/* Badge Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-forest-950 shadow-sm backdrop-blur-xs">
                      {displayBadge}
                    </span>
                  </div>

                  {/* Price Pill */}
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-forest-950/90 text-gold-300 shadow-sm">
                      {t('range.from')} {getStartingPrice(item.slug, item.startingPrice)}
                    </span>
                  </div>
                </div>

                {/* Title & Benefit */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-forest-950 group-hover:text-forest-800 transition-colors">
                      {displayName}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed mt-2 line-clamp-2">
                      {displayBenefit}
                    </p>
                  </div>

                  {/* Shop Now CTA Button */}
                  <div className="pt-4 border-t border-cream-200 mt-4">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-forest-950 text-forest-950 group-hover:text-white font-bold text-xs border border-cream-300 group-hover:border-forest-950 transition-all flex items-center justify-center gap-2 shadow-xs">
                      <span>
                        {language === 'ta'
                          ? `${displayName} ${t('range.shop')}`
                          : `${t('range.shop')} ${displayName}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
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
