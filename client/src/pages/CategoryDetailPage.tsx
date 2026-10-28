import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Droplets,
  Flame,
  Sparkles,
  Award,
  CheckCircle2,
  Plus,
  Minus,
  Check,
  Zap,
  Filter,
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/oilData';

interface CategoryDetailPageProps {
  categorySlug: string;
  onAddToCart: (product: Product, packSize: string, quantity?: number) => void;
  onBuyNow: (product: Product, packSize: string, quantity?: number) => void;
  onViewLabReport: (product: Product) => void;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
}

interface CategoryMeta {
  slug: string;
  name: string;
  tamilName: string;
  tagline: string;
  description: string;
  tamilDescription: string;
  icon: string;
  themeColor: string;
  bgHero: string;
  seedOrigin: string;
  woodType: string;
  smokePoint: string;
  keyNutrients: string[];
}

const CATEGORY_METAS: Record<string, CategoryMeta> = {
  'groundnut-oil': {
    slug: 'groundnut-oil',
    name: 'Wood-Pressed Groundnut Oil',
    tamilName: 'மரச்செக்கு கடலை எண்ணெய்',
    tagline: 'Vaagai wood pestle pressed native peanuts without artificial heat',
    description: 'Crushed slowly at under 38°C in traditional Albizia Lebbeck (Vaagai) wood mortars. Preserves native vitamin E, natural resveratrol, and authentic nutty sweetness with zero solvent extraction.',
    tamilDescription: 'ரசாயனம் மற்றும் பூச்சிக்கொல்லி இல்லாத நாட்டு நிலக்கடலைகளை பாரம்பரிய வாகை மரச்செக்கில் மெதுவாக ஆட்டி எடுக்கப்பட்ட அசல் கடலை எண்ணெய். சுவை, மணம் மற்றும் ஆரோக்கியம் நிறைந்தது.',
    icon: '🥜',
    themeColor: '#B08518',
    bgHero: 'from-amber-100 via-amber-50 to-stone-50',
    seedOrigin: 'Tiruvannamalai & Pollachi Organic Clusters',
    woodType: 'Vaagai (Albizia Lebbeck) Medicinal Mortar',
    smokePoint: '232°C (High Smoke Point - Ideal for Frying)',
    keyNutrients: ['Vitamin E Tocopherols', 'Resveratrol Antioxidant', 'Heart-Healthy MUFA 52%'],
  },
  'sesame-oil': {
    slug: 'sesame-oil',
    name: 'Wood-Pressed Gingelly (Sesame) Oil',
    tamilName: 'மரச்செக்கு நல்லெண்ணெய்',
    tagline: 'Authentic gingelly crushed with organic Karupatti (Palm Jaggery)',
    description: 'Double-sieved black sesame infused with unrefined palm jaggery in traditional wood ghani. Revered for rich sesamol antioxidants, culinary flavour, and holistic wellness.',
    tamilDescription: 'சுத்தமான கருப்பு எள்ளுடன் நாட்டு பனை வெல்லம் (கருப்பட்டி) சேர்த்து வாகை மரச்செக்கில் பிழியப்பட்டது. தாளிப்பு, ரசம், வத்தக்குழம்பு மற்றும் இட்லி பொடிக்கு உன்னதமானது.',
    icon: '🌿',
    themeColor: '#8C6212',
    bgHero: 'from-amber-100/90 via-stone-100 to-stone-50',
    seedOrigin: 'Madurai & Thanjavur Native Black Sesame',
    woodType: 'Ancient Vaagai Wood Mortar with Palm Jaggery',
    smokePoint: '210°C (Tempering & South Indian Tadka)',
    keyNutrients: ['Sesamol & Sesamolin Lignans', 'Natural Calcium & Zinc', 'Zero Hexane Solvents'],
  },
  'coconut-oil': {
    slug: 'coconut-oil',
    name: 'Cold-Pressed Virgin Coconut Oil',
    tamilName: 'மரச்செக்கு தேங்காய் எண்ணெய்',
    tagline: '100% Virgin oil from sulphur-free sun-dried coastal copra',
    description: 'Extracted from naturally sun-dried coastal coconuts without sulphur bleaching or high heat. Loaded with 64% medium-chain fatty acids (Lauric Acid) for cooking, hair, and glowing skin.',
    tamilDescription: 'கந்தகமில்லா இயற்கை கொப்பரையில் இருந்து பிழியப்பட்ட 100% அசல் தேங்காய் எண்ணெய். சமையல், கூந்தல் பராமரிப்பு மற்றும் சருமத்திற்கு இணையற்ற தூய்மை.',
    icon: '🥥',
    themeColor: '#207255',
    bgHero: 'from-emerald-100/80 via-teal-50 to-stone-50',
    seedOrigin: 'Pollachi & Kangeyam Coastal Groves',
    woodType: 'Low-Shear Centrifugal Wood Press',
    smokePoint: '177°C (Gentle Cooking, Raw & Wellness)',
    keyNutrients: ['64% Lauric Acid (MCTs)', 'Natural Monolaurin', 'Zero Added Fragrance'],
  },
  'cooking-oil': {
    slug: 'cooking-oil',
    name: 'Everyday Light & Pure Cooking Oil',
    tamilName: 'தூய ஆரோக்கிய சமையல் எண்ணெய்',
    tagline: 'Physically-refined sunflower & rice bran blends for guilt-free family meals',
    description: 'Engineered for modern Indian cooking: non-greasy, low oil absorption, high thermal stability (245°C), and enriched with natural vitamins without harsh chemical solvents.',
    tamilDescription: 'குறைந்த எண்ணெய் உறிஞ்சும் தன்மை கொண்ட நவீன சமையல் எண்ணெய். பூரி, சப்பாத்தி, வறுவல் மற்றும் அன்றாட சமையலுக்கு ஆரோக்கியமானது.',
    icon: '🌻',
    themeColor: '#D97706',
    bgHero: 'from-yellow-100/90 via-orange-50 to-stone-50',
    seedOrigin: 'Non-GMO Sunflower & Golden Rice Bran',
    woodType: 'Cold Micro-Filtration Gentle Press',
    smokePoint: '245°C (High Heat Frying & Sautéing)',
    keyNutrients: ['10,000+ ppm Gamma Oryzanol', 'Vitamin A & D Fortified', 'Low Oil Absorption Formula'],
  },
  'pooja-special': {
    slug: 'pooja-special',
    name: 'Nithyam & Pancha Deepam Pooja Oils',
    tamilName: 'நித்யம் & பஞ்ச தீப பூஜை எண்ணெய்',
    tagline: 'Sacred 5-oil blend formulated as per Vedic Agamas for divine peace',
    description: 'Traditional blend of sesame, mahua, castor, neem, and pure cow ghee infused with sacred sugandha herbs and camphor. Emits a brighter, long-lasting golden flame without soot.',
    tamilDescription: 'பஞ்ச தீப எண்ணெய் மற்றும் நித்யம் பூஜை எண்ணெய். வீட்டில் நேர்மறை அதிர்வுகளையும், நீண்ட நேரம் சுடர்விட்டு எரியும் தூய தெய்வீக ஜோதியையும் தருகிறது.',
    icon: '🪔',
    themeColor: '#B32D2E',
    bgHero: 'from-red-100/80 via-amber-50 to-stone-50',
    seedOrigin: 'Traditional 5 Sacred Native Oils',
    woodType: 'Sacred Cold Herbal Infusion Mortar',
    smokePoint: '190°C (Temple Lamp Burning Grade)',
    keyNutrients: ['Soot-Free Bright Flame', 'Natural Camphor Aroma', 'Positive Spiritual Energy'],
  },
  'a2-desi-ghee': {
    slug: 'a2-desi-ghee',
    name: 'A2 Cultured Desi Cow Ghee',
    tamilName: 'ஏ2 நாட்டு மாட்டு நெய்',
    tagline: 'Handmade Bilona method from grass-fed native Indian cows',
    description: 'Slow-simmered over firewood from cultured whole curd of native Bos Indicus cows. Granular danedaar texture with captivating nutty aroma and pure A2 beta-casein proteins.',
    tamilDescription: 'பாரம்பரிய பிலோனா முறையில் காய்ச்சப்பட்ட அசல் நாட்டு மாட்டு நெய். தங்க நிற மணல் மணலான பதம் மற்றும் அபாரமான சுவை.',
    icon: '🧈',
    themeColor: '#CA8A04',
    bgHero: 'from-amber-100 via-yellow-50 to-stone-50',
    seedOrigin: 'Native Bos Indicus Cows (Kangayam)',
    woodType: 'Wooden Bilona Hand Churn',
    smokePoint: '252°C (Highest Thermal Stability)',
    keyNutrients: ['100% Pure A2 Beta-Casein', 'Rich Butyric Acid', 'Fat-Soluble Vitamins A, D, E, K2'],
  },
  'palm-jaggery-special': {
    slug: 'palm-jaggery-special',
    name: 'Pure Udangudi Palm Jaggery (Karupatti)',
    tamilName: 'அசல் உடன்குடி பனை கருப்பட்டி',
    tagline: 'Traditional unrefined palm sap boiled without lime or artificial chemicals',
    description: 'Sourced from the heartlands of Udangudi. 100% natural, unbleached, iron-rich sweetener that elevates morning herbal tea, coffee, and authentic traditional cooking.',
    tamilDescription: 'சுண்ணாம்பு மற்றும் ரசாயன கலப்பற்ற அசல் உடன்குடி பனை கருப்பட்டி. இயற்கையான இரும்புச்சத்து மற்றும் கனிமங்கள் நிறைந்தது.',
    icon: '🌴',
    themeColor: '#78350F',
    bgHero: 'from-stone-200/90 via-amber-50 to-stone-50',
    seedOrigin: 'Udangudi Native Palm Cooperatives',
    woodType: 'Traditional Iron Vat Fire Boiling',
    smokePoint: 'Natural Unrefined Sweetener',
    keyNutrients: ['High Natural Iron & Calcium', 'Low Glycemic Index (GI)', 'Zero Chemical Clarifiers'],
  },
};

const ALL_CATEGORY_PILLS = [
  { slug: 'groundnut-oil', label: 'Groundnut Oil', labelTa: 'கடலை எண்ணெய்', icon: '🥜' },
  { slug: 'sesame-oil', label: 'Sesame Oil', labelTa: 'நல்லெண்ணெய்', icon: '🌿' },
  { slug: 'coconut-oil', label: 'Coconut Oil', labelTa: 'தேங்காய் எண்ணெய்', icon: '🥥' },
  { slug: 'cooking-oil', label: 'Cooking Oil', labelTa: 'சமையல் எண்ணெய்', icon: '🌻' },
  { slug: 'pooja-special', label: 'Pooja Oil', labelTa: 'தீப எண்ணெய்', icon: '🪔' },
  { slug: 'a2-desi-ghee', label: 'A2 Desi Ghee', labelTa: 'நாட்டு மாட்டு நெய்', icon: '🧈' },
  { slug: 'palm-jaggery-special', label: 'Palm Jaggery', labelTa: 'பனை கருப்பட்டி', icon: '🌴' },
];

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categorySlug,
  onAddToCart,
  onBuyNow,
  onViewLabReport,
  onNavigate,
  onSelectProduct,
}) => {
  const { language } = useLanguage();
  const [selectedPackMap, setSelectedPackMap] = useState<Record<string, string>>({});
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  // Resolve category metadata or fallback
  const meta: CategoryMeta =
    CATEGORY_METAS[categorySlug] || {
      slug: categorySlug,
      name: categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      tamilName: 'மரச்செக்கு இயற்கை எண்ணெய்',
      tagline: '100% Traditional Mara Chekku Pure Extraction',
      description: 'Handcrafted with zero chemical additives, zero solvent hexane, and authentic wood pestle pressing.',
      tamilDescription: 'பாரம்பரிய முறையில் ஆட்டப்பட்ட 100% தூய இயற்கை எண்ணெய்.',
      icon: '🌿',
      themeColor: '#B08518',
      bgHero: 'from-amber-100 via-stone-50 to-white',
      seedOrigin: 'Certified Native Farmer Clusters',
      woodType: 'Vaagai Mara Chekku',
      smokePoint: '220°C',
      keyNutrients: ['100% Mara Chekku', 'Zero Chemical Solvent', 'FSSAI Certified'],
    };

  const { products } = useStore();
  const sourceProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Find all products matching this category slug
  const matchingProducts = sourceProducts.filter(
    (p) =>
      p.category === categorySlug ||
      (categorySlug === 'cooking-oil' && (p.category === 'cooking-oil' || p.name.includes('Sunflower') || p.name.includes('Rice Bran'))) ||
      (categorySlug === 'pooja-special' && (p.category === 'pooja-special' || p.name.includes('Deepam') || p.name.includes('Lamp')))
  );

  // If there are other popular products, show them as related
  const otherProducts = sourceProducts.filter((p) => p.category !== categorySlug).slice(0, 4);

  // Pack price calculator
  const getPackPrice = (basePrice: number, pack: string): number => {
    if (pack.includes('500 ml') || pack.includes('500ml') || pack.includes('500g')) {
      return Math.round(basePrice * 0.55);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can') || pack.includes('2 Litre Bottle')) {
      return Math.round(basePrice * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L') || pack.includes('5 Litre Can') || pack.includes('5 Litre Tin')) {
      return Math.round(basePrice * 4.8);
    }
    if (pack.includes('15 Litre') || pack.includes('15L') || pack.includes('15 Litre Tin')) {
      return Math.round(basePrice * 14);
    }
    if (pack.includes('1 kg') || pack.includes('1kg')) {
      return Math.round(basePrice * 1.9);
    }
    return basePrice;
  };

  const handlePackChange = (productId: string, pack: string) => {
    setSelectedPackMap((prev) => ({ ...prev, [productId]: pack }));
  };

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantityMap((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddClick = (product: Product) => {
    const pack = selectedPackMap[product.id] || product.defaultPack || product.packSizes[0] || '1 Litre Bottle';
    const qty = quantityMap[product.id] || 1;
    onAddToCart(product, pack, qty);

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleBuyClick = (product: Product) => {
    const pack = selectedPackMap[product.id] || product.defaultPack || product.packSizes[0] || '1 Litre Bottle';
    const qty = quantityMap[product.id] || 1;
    onBuyNow(product, pack, qty);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20 select-none">
      
      {/* 1. Breadcrumbs Top Bar */}
      <div className="bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-stone-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#b32d2e] font-medium transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <button
              onClick={() => onNavigate('/categories')}
              className="hover:text-[#b32d2e] font-medium transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'வகைகள்' : 'Categories'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <span className="font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
              {language === 'ta' ? meta.tamilName : meta.name}
            </span>
          </nav>

          <button
            onClick={() => onNavigate('/shop')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-800 text-stone-700 hover:text-stone-950 font-bold transition-all text-xs cursor-pointer bg-stone-50 hover:bg-white shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'View All Oils'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Category Header Banner */}
      <div className={`bg-gradient-to-b ${meta.bgHero} border-b border-stone-200/60 py-10 sm:py-16 relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl space-y-4">
            
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-stone-200 text-stone-800 text-xs font-bold shadow-2xs backdrop-blur-xs">
              <span className="text-base">{meta.icon}</span>
              <span>
                {language === 'ta' ? 'அசல் மரச்செக்கு தயாரிப்பு' : '100% Cold-Pressed Organic Heritage'}
              </span>
            </div>

            {/* Category Main Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-950 tracking-tight leading-tight">
                {language === 'ta' ? meta.tamilName : meta.name}
              </h1>
              <p className="text-sm sm:text-base font-serif font-bold text-[#b32d2e] mt-1">
                {language === 'ta' ? meta.name : meta.tamilName}
              </p>
            </div>

            {/* Category Description */}
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {language === 'ta' ? meta.tamilDescription : meta.description}
            </p>

            {/* Quality Seals Badges Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{meta.smokePoint}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{meta.woodType}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-stone-700 text-xs font-semibold border border-stone-200">
                <Award className="w-3.5 h-3.5 text-gold-600" />
                <span>{meta.seedOrigin}</span>
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Horizontal Category Navigation Switcher Pills */}
      <div className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto scrollbar-none flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            {language === 'ta' ? 'பிற வகைகள்:' : 'Categories:'}
          </span>
          {ALL_CATEGORY_PILLS.map((pill) => {
            const isActive = pill.slug === categorySlug;
            return (
              <button
                key={pill.slug}
                onClick={() => onNavigate(`/category/${pill.slug}`)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-[#b32d2e] text-white border-[#b32d2e] shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{pill.icon}</span>
                <span>{language === 'ta' ? pill.labelTa : pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Products Inside this Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-stone-200/80">
          <div>
            <span className="text-[11px] font-bold text-[#b32d2e] uppercase tracking-widest block mb-1">
              {language === 'ta' ? 'அனைத்து அளவுகள் & பேக்குகள்' : 'Pack Sizes & Varieties'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
              {language === 'ta'
                ? `${meta.tamilName} தயாரிப்புகள் (${matchingProducts.length})`
                : `${meta.name} Products (${matchingProducts.length})`}
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-medium hidden sm:block">
            {language === 'ta' ? 'நேரடியாக மரச்செக்கில் இருந்து உங்கள் வீட்டிற்கு' : 'Directly from Mara Chekku to Your Doorstep'}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {matchingProducts.map((product) => {
            const selectedPack =
              selectedPackMap[product.id] || product.defaultPack || product.packSizes[0] || '1 Litre Bottle';
            const quantity = quantityMap[product.id] || 1;
            const currentPrice = getPackPrice(product.price, selectedPack);
            const currentOriginalPrice = getPackPrice(product.originalPrice || product.price, selectedPack);
            const isAdded = addedMap[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 hover:border-amber-400 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Badge & Lab Link */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF3EA] text-[#8B2522] border border-[#8B2522]/20">
                    {product.badge || '100% Mara Chekku'}
                  </span>
                  {product.labReport && (
                    <button
                      onClick={() => onViewLabReport(product)}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      title="View Lab Analysis Certificate"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'ta' ? 'ஆய்வக சான்றிதழ்' : 'Lab Certificate'}</span>
                    </button>
                  )}
                </div>

                {/* Clickable Product Image */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="aspect-square bg-stone-50 rounded-2xl overflow-hidden p-4 flex items-center justify-center cursor-pointer relative group/img mb-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/img:scale-108 transition-transform duration-500 drop-shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {language === 'ta' ? 'முழு விவரங்கள்' : 'View Details'}
                    </span>
                  </div>
                </div>

                {/* Product Title & Tagline */}
                <div className="space-y-1 mb-4">
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif font-bold text-lg sm:text-xl text-stone-950 group-hover:text-[#b32d2e] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>
                </div>

                {/* Pack Size Selector with Live Price Update */}
                <div className="mb-4 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-stone-500 block">
                    {language === 'ta' ? 'அளவைத் தேர்ந்தெடுக்கவும்:' : 'Choose Pack Size:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.packSizes.map((pack) => {
                      const isSelected = selectedPack === pack;
                      return (
                        <button
                          key={pack}
                          onClick={() => handlePackChange(product.id, pack)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {pack}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Calculated Price & Quantity Stepper */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-black text-2xl text-stone-950">
                        ₹{currentPrice * quantity}
                      </span>
                      {currentOriginalPrice > currentPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{currentOriginalPrice * quantity}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 block">
                      {quantity > 1 ? `₹${currentPrice} / pack` : 'Inclusive of all taxes'}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5">
                    <button
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="w-7 h-7 rounded-lg hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleAddClick(product)}
                    className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-900 border-stone-300/80 shadow-2xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'சேர்க்கப்பட்டது!' : 'Added!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'கார்ட்டில் சேர்' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleBuyClick(product)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#b32d2e] hover:bg-[#942021] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>{language === 'ta' ? 'உடனே வாங்கு' : 'Buy Now'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* 5. Rich Traditional Craftsmanship Feature Card for this Category */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#b32d2e] tracking-widest block">
                {language === 'ta' ? 'பாரம்பரிய உத்தரவாதம்' : 'Vaagai Craftsmanship'}
              </span>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-950">
                {language === 'ta' ? 'மரச்செக்கு தனிச்சிறப்பு' : 'Why Vaagai Mara Chekku?'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'மரச்செக்கில் அதிக வெப்பம் உண்டாகாது என்பதால் எண்ணெயின் இயற்கை சத்துக்கள், ஆன்டி-ஆக்சிடன்ட்கள் மற்றும் தனித்துவ மணம் அப்படியே பாதுகாக்கப்படுகிறது.'
                  : 'Vaagai wood absorbs heat naturally during crushing. At under 14 RPM, the cold nectar retains natural tocopherols, pleasant aroma, and rich nutrients.'}
              </p>
            </div>

            <div className="space-y-2.5 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {meta.keyNutrients.map((nut, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1">
                  <div className="w-6 h-6 rounded-lg bg-[#b32d2e]/10 text-[#b32d2e] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-stone-900">{nut}</h4>
                  <p className="text-[11px] text-stone-500">
                    {language === 'ta' ? '100% இயற்கை பரிசோதனை' : 'Pure lab-certified'}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 6. Explore Other Categories Section */}
        {otherProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-stone-200/80">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
                  {language === 'ta' ? 'பிற மரச்செக்கு ரகங்கள்' : 'Explore More Oils'}
                </span>
                <h3 className="font-serif font-black text-2xl text-stone-950">
                  {language === 'ta' ? 'பிற பிரபல வகைகள்' : 'Other Popular Mara Chekku Varieties'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/shop')}
                className="text-xs font-bold text-[#b32d2e] hover:underline cursor-pointer"
              >
                {language === 'ta' ? 'அனைத்தும் காண்க →' : 'View All Oils →'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {otherProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-3xl p-4 border border-stone-200/80 hover:border-gold-400 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden p-3 flex items-center justify-center mb-3">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                      {rel.categoryName || rel.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1 group-hover:text-[#b32d2e] transition-colors">
                      {rel.name}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-serif font-black text-sm text-stone-900">₹{rel.price}</span>
                      <span className="text-[11px] text-stone-400 line-through">₹{rel.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

