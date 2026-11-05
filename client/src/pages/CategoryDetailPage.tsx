import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Droplets,
  Flame,
  Award,
  CheckCircle2,
  Plus,
  Minus,
  Check,
  Zap,
  Filter,
  Heart,
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage, getLocalizedProductName, getLocalizedProductTagline } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/oilData';
import { getFavorites, toggleFavorite } from '../utils/favorites';

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
    seedOrigin: '100% Native Organic Peanuts',
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
    seedOrigin: '100% Native Black Sesame',
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
    seedOrigin: 'Sun-Dried Natural Farm Copra',
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
    seedOrigin: '100% Grass-Fed Native Desi Cow Milk',
    woodType: 'Wooden Bilona Hand Churn',
    smokePoint: '252°C (Highest Thermal Stability)',
    keyNutrients: ['100% Pure A2 Beta-Casein', 'Rich Butyric Acid', 'Fat-Soluble Vitamins A, D, E, K2'],
  },
  'palm-jaggery-special': {
    slug: 'palm-jaggery-special',
    name: 'Pure Palm Jaggery (Karupatti)',
    tamilName: 'அசல் பனை கருப்பட்டி',
    tagline: 'Traditional unrefined palm sap boiled without lime or artificial chemicals',
    description: '100% natural, unbleached, iron-rich sweetener that elevates morning herbal tea, coffee, and authentic traditional cooking.',
    tamilDescription: 'சுண்ணாம்பு மற்றும் ரசாயன கலப்பற்ற அசல் பனை கருப்பட்டி. இயற்கையான இரும்புச்சத்து மற்றும் கனிமங்கள் நிறைந்தது.',
    icon: '🌴',
    themeColor: '#78350F',
    bgHero: 'from-stone-200/90 via-amber-50 to-stone-50',
    seedOrigin: 'Traditional Native Palm Cooperatives',
    woodType: 'Traditional Iron Vat Fire Boiling',
    smokePoint: 'Natural Unrefined Sweetener',
    keyNutrients: ['High Natural Iron & Calcium', 'Low Glycemic Index (GI)', 'Zero Chemical Clarifiers'],
  },
  'ricebran-oil': {
    slug: 'ricebran-oil',
    name: 'Pure Golden Rice Bran Oil',
    tamilName: 'தூய ரைஸ் பிரான் எண்ணெய்',
    tagline: 'Heart-healthy cooking oil packed with natural Gamma Oryzanol',
    description: 'Extracted from the golden outer bran layer of brown rice. Naturally light, non-greasy, and boasts a very high smoke point of 250°C, making it the healthiest choice for daily Indian family cooking.',
    tamilDescription: 'கைக்குத்தல் பழுப்பு அரிசியின் தவிட்டு அடுக்கிலிருந்து எடுக்கப்படும் தூய எண்ணெய். இயற்கையான காமா ஒரிசானால் சத்து நிறைந்தது; கொலஸ்ட்ராலை சமநிலைப்படுத்தவும், பூரி, தோசை மற்றும் அன்றாட சமையலுக்கும் சிறந்தது.',
    icon: '🌾',
    themeColor: '#D97706',
    bgHero: 'from-amber-100/90 via-orange-50 to-stone-50',
    seedOrigin: '100% Golden Brown Rice Bran',
    woodType: 'Natural Cold Micro-Filtration',
    smokePoint: '250°C (High Smoke Point - Ideal for Frying)',
    keyNutrients: ['10,000+ ppm Gamma Oryzanol', 'Heart-Healthy Balance', '15% Less Oil Absorption'],
  },
  'mustard-oil': {
    slug: 'mustard-oil',
    name: 'Cold-Pressed Mustard Oil',
    tamilName: 'தூய கடுகு எண்ணெய்',
    tagline: 'Traditional pungent cold-pressed mustard oil with natural warmth',
    description: 'Pressed from select black and yellow mustard seeds without high heat. Celebrated for its bold, pungent aroma and high smoke point for authentic regional curries and pickling.',
    tamilDescription: 'முதல் தர கடுகு விதைகளிலிருந்து இயற்கை முறையில் பிழியப்பட்ட அசல் கடுகு எண்ணெய். தனித்துவமான கார மணம், ஊறுகாய் மற்றும் வறுவல் சமையலுக்கு இணையற்றது.',
    icon: '🌱',
    themeColor: '#CA8A04',
    bgHero: 'from-yellow-100 via-amber-50 to-stone-50',
    seedOrigin: '100% Native Mustard Seeds',
    woodType: 'Traditional Cold Mechanical Press',
    smokePoint: '250°C (High Heat Frying & Pickling)',
    keyNutrients: ['Natural Allyl Isothiocyanate', 'Rich in Omega-3 (ALA)', 'Zero Synthetic Preservatives'],
  },
  'sunflower-oil': {
    slug: 'sunflower-oil',
    name: 'Pure Cold-Pressed Sunflower Oil',
    tamilName: 'தூய சூரியகாந்தி எண்ணெய்',
    tagline: 'Light, golden, and rich in natural Vitamin E for active family health',
    description: 'Pressed gently from sun-ripened native sunflower seeds without chemical solvents. Naturally high smoke point (232°C), non-greasy, and ideal for everyday frying and gravies.',
    tamilDescription: 'இயற்கை சூரியகாந்தி விதைகளிலிருந்து மெதுவாக பிழியப்பட்ட லேசான ஆரோக்கிய சமையல் எண்ணெய். இயற்கை வைட்டமின் E நிறைந்தது; எண்ணெய் பிசுபிசுப்பு இல்லாதது.',
    icon: '🌻',
    themeColor: '#D97706',
    bgHero: 'from-amber-100 via-yellow-50 to-stone-50',
    seedOrigin: '100% Native Sun-Ripened Seeds',
    woodType: 'Natural Gentle Press',
    smokePoint: '232°C (Ideal for Daily Frying)',
    keyNutrients: ['Natural Vitamin E', 'Zero Hexane Chemical', 'Light & Digestible'],
  },
};

const ALL_CATEGORY_PILLS = [
  { slug: 'groundnut-oil', label: 'Groundnut Oil', labelTa: 'கடலை எண்ணெய்', icon: '🥜' },
  { slug: 'sesame-oil', label: 'Sesame Oil', labelTa: 'நல்லெண்ணெய்', icon: '🌿' },
  { slug: 'coconut-oil', label: 'Coconut Oil', labelTa: 'தேங்காய் எண்ணெய்', icon: '🥥' },
  { slug: 'sunflower-oil', label: 'Sunflower Oil', labelTa: 'சூரியகாந்தி', icon: '🌻' },
  { slug: 'ricebran-oil', label: 'Rice Bran Oil', labelTa: 'ரைஸ் பிரான்', icon: '🌾' },
  { slug: 'cooking-oil', label: 'Cooking Oil', labelTa: 'சமையல் எண்ணெய்', icon: '🍳' },
  { slug: 'mustard-oil', label: 'Mustard Oil', labelTa: 'கடுகு எண்ணெய்', icon: '🌱' },
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
  const [favoritesList, setFavoritesList] = useState<string[]>(getFavorites);

  React.useEffect(() => {
    const handleFavUpdate = () => setFavoritesList(getFavorites());
    window.addEventListener('ssoil_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('ssoil_favorites_updated', handleFavUpdate);
  }, []);

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

  // Strict 1:1 category matcher (Guarantees zero cross-category product leakage)
  const isProductInCategory = (p: Product, slug: string): boolean => {
    const target = slug.toLowerCase().trim();
    const pCat = (p.category || '').toLowerCase().trim();
    if (pCat === target) return true;
    if (pCat.replace(/-oil$/, '') === target.replace(/-oil$/, '')) return true;
    return false;
  };

  // Find all products matching this category slug
  const matchingProducts = sourceProducts.filter((p) => isProductInCategory(p, categorySlug));

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-[#b32d2e] text-stone-700 hover:text-stone-950 font-bold transition-all text-xs cursor-pointer bg-stone-50 hover:bg-white shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முந்தைய பக்கம்' : 'Back to Store'}</span>
            </button>

            <nav className="flex items-center gap-2 text-stone-500 whitespace-nowrap">
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
          </div>
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
                {language === 'ta' ? meta.tamilName : meta.name}
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
        {matchingProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200/80 shadow-xs space-y-4 max-w-xl mx-auto my-6">
            <Droplets className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {language === 'ta'
                ? 'இந்த வகையில் புதிய ஆலை பேட்ச் தயாரிப்பில் உள்ளது'
                : 'Fresh Mill Batch is in Extraction for this Category'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'எங்கள் சேலம் ஆலை தயாரிப்பில் உள்ள பிற தூய மரச்செக்கு எண்ணெய்களை கீழே பார்வையிடலாம்.'
                : 'Explore our other pure cold-pressed varieties directly from our Salem Mara Chekku mill.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-950 text-gold-300 font-bold text-xs hover:bg-forest-900 transition-colors cursor-pointer shadow-sm mx-auto"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அனைத்து எண்ணெய்களையும் பார்க்க' : 'View All Mara Chekku Oils'}</span>
            </button>
          </div>
        ) : (
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

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                      setFavoritesList(getFavorites());
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer shadow-md z-10 ${
                      favoritesList.includes(product.id)
                        ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                        : 'bg-white/95 text-stone-500 hover:text-red-500 hover:bg-white'
                    }`}
                    title={favoritesList.includes(product.id) ? 'In Favorites' : 'Add to Favorites'}
                  >
                    <Heart className={`w-4 h-4 ${favoritesList.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

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
                    {getLocalizedProductName(product, language)}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {getLocalizedProductTagline(product, language)}
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

                {/* Action Button: Add to Cart */}
                <div>
                  <button
                    onClick={() => handleAddClick(product)}
                    className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-forest-950 hover:bg-forest-900 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'சேர்க்கப்பட்டது!' : 'Added!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                        <span>{language === 'ta' ? 'கார்ட்டில் சேர்' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
        )}

        {/* 5. Authentic Kitchen & Culinary Guide for this Category */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#b32d2e] tracking-widest block">
                {language === 'ta' ? 'அன்றாட சமையல் வழிகாட்டி' : 'Authentic Kitchen Guide'}
              </span>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-950">
                {language === 'ta' ? 'சமையல் முறை & ஆரோக்கிய பயன்கள்' : 'Cooking Style & Health Benefits'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ta'
                  ? 'எங்கள் எண்ணெய்கள் இயற்கை முறையில் பாரம்பரியமாக தயாரிக்கப்படுவதால், சமையலில் குறைந்த அளவே போதுமானது. உங்கள் உணவுகளுக்கு தனித்துவமான சுவையையும் ஊட்டச்சத்தையும் தரும்.'
                  : 'Because our products are crafted without harsh chemicals, a little goes a long way. Ideal for enhancing natural flavors while keeping daily family meals wholesome and light.'}
              </p>
            </div>

            <div className="space-y-2.5 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  🍳
                </div>
                <h4 className="font-serif font-bold text-xs text-stone-900">
                  {language === 'ta' ? 'பொருத்தமான சமையல்' : 'Ideal Cooking'}
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {language === 'ta' ? 'தாளிப்பு, பொரியல், குழம்பு மற்றும் சிற்றுண்டிகளுக்கு சிறந்தது' : 'Tadka, stir-fry, curries & traditional breakfast dishes'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  💚
                </div>
                <h4 className="font-serif font-bold text-xs text-stone-900">
                  {language === 'ta' ? 'இயற்கை நன்மைகள்' : 'Natural Wellness'}
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {language === 'ta' ? 'இயற்கை ஆன்டி-ஆக்சிடன்ட்கள் மற்றும் ஊட்டச்சத்துக்கள் நிறைந்தது' : 'Retains unrefined vitamins, polyphenols & vital fatty acids'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  🏡
                </div>
                <h4 className="font-serif font-bold text-xs text-stone-900">
                  {language === 'ta' ? 'வீட்டுப் பராமரிப்பு' : 'Kitchen Storage'}
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {language === 'ta' ? 'குளிர்ந்த, உலர்ந்த இடத்தில் மூடி வைக்கவும்; 12 மாதம் புத்துணர்ச்சி' : 'Store away from direct stove heat; stays mill-fresh for 12 months'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

