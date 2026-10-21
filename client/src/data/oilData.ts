import { Product, Category, Testimonial, FeatureBlock, FlagshipHeroOil, CraftStage, CulinaryPairing } from '../types';

export const FLAGSHIP_HERO_OILS: FlagshipHeroOil[] = [
  {
    id: 'ss-groundnut-1000',
    name: 'SS Mara Chekku Groundnut Oil',
    botanicalSource: 'Native Saurashtra & Salem Pods',
    tagline: 'Deep Golden Wood-Pressed Oil with Unrivalled Nutty Aroma',
    highlightBadge: 'Signature Vaagai Heritage Press',
    woodPressTree: 'Vaagai Wood Churner (Albizia Lebbeck)',
    rpm: '14 RPM Gentle Rotation',
    temperature: '38°C Natural Cold Extract',
    smokePoint: '232°C (Deep Frying Master)',
    flavorNote: 'Rich, roasted nutty aroma with light culinary finish',
    accentColor: '#D4AF37', // Gold
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=85',
    price: 340,
    originalPrice: 420,
    defaultPack: '1 Litre Bottle',
    batchCode: 'BATCH-GND-2026-H14'
  },
  {
    id: 'ss-sesame-1000',
    name: 'SS Wood-Pressed Gingelly (Sesame) Oil',
    botanicalSource: 'Sun-Drenched Black Sesame & Palm Jaggery',
    tagline: 'Authentic Gingelly Infused with Pure Karupatti (Palm Jaggery)',
    highlightBadge: 'Generational Ancient Formula',
    woodPressTree: 'Traditional Wood Ghani Mortar',
    rpm: '12 RPM Micro-Cold Churn',
    temperature: '36°C Ambient Crushing',
    smokePoint: '210°C (Tempering & Tadka)',
    flavorNote: 'Warm, earthy, subtle caramelized palm sweetness',
    accentColor: '#B08518',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1000&q=85',
    price: 395,
    originalPrice: 480,
    defaultPack: '1 Litre Bottle',
    batchCode: 'BATCH-SES-2026-K08'
  },
  {
    id: 'ss-coconut-1000',
    name: 'SS Pure Cold-Pressed Virgin Coconut Oil',
    botanicalSource: 'Sulphur-Free Sun-Dried Coastal Copra',
    tagline: 'Crystal-Pure Raw Copra Oil Loaded with 64% Lauric Acid',
    highlightBadge: 'Sulphur-Free Sun-Dried Kernels',
    woodPressTree: 'Stone & Wood Centrifugal Cold Churn',
    rpm: '18 RPM Low-Shear Press',
    temperature: '34°C Pure Cold Raw',
    smokePoint: '177°C (Gentle Cooking & Health)',
    flavorNote: 'Fresh, velvety, sweet coastal coconut aroma',
    accentColor: '#248263', // Emerald
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    price: 320,
    originalPrice: 390,
    defaultPack: '1 Litre Glass Jar',
    batchCode: 'BATCH-COC-2026-V21'
  }
];

export const CRAFT_STAGES_DATA: CraftStage[] = [
  {
    step: 1,
    title: 'Sun-Cured Seed Selection',
    traditionalName: 'Vithai Therivu (விதை தெரிவு)',
    tagline: 'Zero moisture, chemical-free native seeds',
    description: 'We inspect hand-sorted pods directly from organic farmer clusters. Peanuts are deshelled without steam heat; black sesame is double-sieved for dust purity.',
    metricLabel: 'Foreign Impurities',
    metricValue: '0.00%',
    image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: 2,
    title: 'Vaagai Mara Chekku Churn',
    traditionalName: 'Mara Chekku (மரச்செக்கு)',
    tagline: 'Ancient Albizia Lebbeck medicinal wood mortars',
    description: 'Vaagai wood absorbs heat naturally. As the heavy pestle circles at only 12 to 14 revolutions per minute, seeds release their nectar without frictional burning.',
    metricLabel: 'Extraction Heat',
    metricValue: '< 42°C',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: 3,
    title: 'Natural Solar Clarification',
    traditionalName: 'Veyil Thelivu (வெயில் தெளிவு)',
    tagline: '5 Days in natural sunlight; zero chemical bleaching',
    description: 'Instead of aggressive sulfuric acid washing or silica bleaching, freshly pressed SS OIL rests in covered food-grade glass vessels under natural warm sunlight.',
    metricLabel: 'Solvent Hexane Used',
    metricValue: 'Zero (0 ppm)',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: 4,
    title: '24-Point Lab Chromatography',
    traditionalName: 'Parithothanai (பரிசோதனை)',
    tagline: 'Spectrometric analysis for authentic iodine & acid values',
    description: 'Every 500-liter pressing is independently tested for zero aflatoxin, low peroxide value (< 1.5 meq/kg), and rich natural Vitamin E tocopherols.',
    metricLabel: 'Purity Clearance',
    metricValue: '100% Certified',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    step: 5,
    title: 'UV-Protected Airtight Bottling',
    traditionalName: 'Pathukappu (பாதுகாப்பு)',
    tagline: 'Hands-free bottling with airtight safety seal',
    description: 'Sealed immediately into UV-filtered amber glass jars, premium tins, and food-grade BPA-free vessels to lock in fragrant volatile aromatics.',
    metricLabel: 'Shelf Freshness',
    metricValue: '12 Months',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
  }
];

export const CULINARY_PAIRINGS_DATA: CulinaryPairing[] = [
  {
    id: 'pair-deep-fry',
    dishCategory: 'Deep Frying & Crispy Sauté',
    iconName: 'Flame',
    dishes: 'Puris, Vada, Murukku, Pakodas, Bajjis & Fish Fry',
    recommendedOilName: 'SS Mara Chekku Groundnut Oil',
    productId: 'ss-groundnut-1000',
    whyItWorks: 'High smoke point (232°C) prevents burning. Food absorbs 20% less oil while locking in authentic golden crunch.',
    smokePoint: '232°C Smoke Point',
    flavorAroma: 'Delicate roasted peanut aroma that enhances savory crunch',
    price: 340
  },
  {
    id: 'pair-tempering',
    dishCategory: 'Tempering, Tadka & Podi',
    iconName: 'Sparkles',
    dishes: 'Idli Podi, Sambar Tadka, Rasam, Vatha Kuzhambu & Chutneys',
    recommendedOilName: 'SS Wood-Pressed Gingelly (Sesame) Oil',
    productId: 'ss-sesame-1000',
    whyItWorks: 'Infused with palm jaggery, it blooms mustard seeds and curry leaves into the iconic South Indian temple kitchen fragrance.',
    smokePoint: '210°C Smoke Point',
    flavorAroma: 'Distinct nutty sesame essence with gentle palm jaggery finish',
    price: 395
  },
  {
    id: 'pair-kerala-baking',
    dishCategory: 'Coastal Curries & Raw Health',
    iconName: 'Heart',
    dishes: 'Avial, Coconut Rice, Thoran, Salads, Oil Pulling & Hair Rituals',
    recommendedOilName: 'SS Cold-Pressed Virgin Coconut Oil',
    productId: 'ss-coconut-1000',
    whyItWorks: 'Rich in Lauric Acid and Medium Chain Triglycerides (MCTs). Imparts irresistible coastal authenticity.',
    smokePoint: '177°C Smoke Point',
    flavorAroma: 'Silky, fresh sweet copra aroma that melts on warm rice',
    price: 320
  },
  {
    id: 'pair-everyday',
    dishCategory: 'Everyday Light Healthy Meals',
    iconName: 'Droplets',
    dishes: 'Phulkas, Rotis, Mixed Veg Pulao, Curries & Dal',
    recommendedOilName: 'SS Gold Everyday Pure Cooking Oil',
    productId: 'ss-cooking-daily-1000',
    whyItWorks: 'Light, non-sticky viscosity that lets the spices shine without feeling greasy or heavy on the stomach.',
    smokePoint: '240°C Smoke Point',
    flavorAroma: 'Neutral, clean taste that lets spices and gravies shine',
    price: 210
  }
];

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-cooking',
    slug: 'cooking-oil',
    title: 'Cooking Oil',
    subtitle: 'Everyday Light & Healthy Blends',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    itemCount: '6 Varieties',
    badge: 'Daily Essential',
    highlightText: 'Chemical-Free & High Smoke Point'
  },
  {
    id: 'cat-sesame',
    slug: 'sesame-oil',
    title: 'Sesame Oil',
    subtitle: 'Traditional Gingelly Oil with Palm Jaggery',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
    itemCount: '4 Varieties',
    badge: 'Authentic Gingelly',
    highlightText: 'Wood-Pressed with Palm Jaggery'
  },
  {
    id: 'cat-groundnut',
    slug: 'groundnut-oil',
    title: 'Groundnut Oil',
    subtitle: '100% Mara Chekku Peanut Oil',
    image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80',
    itemCount: '5 Varieties',
    badge: 'Top Seller',
    highlightText: 'Rich Nutty Aroma & Deep Frying Hero'
  },
  {
    id: 'cat-coconut',
    slug: 'coconut-oil',
    title: 'Coconut Oil',
    subtitle: 'Cold-Pressed Virgin Copra Oil',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    itemCount: '4 Varieties',
    badge: '100% Virgin Pure',
    highlightText: 'Sulphur-Free Sun-Dried Copra'
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'ss-groundnut-1000',
    name: 'SS Mara Chekku Groundnut Oil',
    tagline: 'Traditional Wood-Pressed Groundnut Oil with Authentic Aroma',
    category: 'groundnut-oil',
    categoryName: 'Groundnut Oil',
    price: 340,
    originalPrice: 420,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 348,
    packSizes: ['500 ml Bottle', '1 Litre Bottle', '2 Litre Can', '5 Litre Tin'],
    defaultPack: '1 Litre Bottle',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    badge: 'Bestseller',
    description: 'Crafted using hand-picked native groundnuts crushed slowly in traditional Vaagai wood presses (Mara Chekku). Retains natural antioxidants, nutty aroma, and heart-healthy monounsaturated fats.',
    benefits: [
      'Slow crushed in traditional wood mills below 45°C',
      'Zero chemicals, zero liquid paraffin, zero hexane',
      'High smoke point ideal for Indian sautéing and deep frying',
      'Rich in natural Vitamin E and plant phytosterols'
    ],
    smokePoint: '232°C (High Smoke Point)',
    extractionMethod: 'Traditional Vaagai Mara Chekku (Wood-Pressed)',
    inStock: true,
    featured: true,
    aromaProfile: 'Authentic roasted peanut fragrance with deep golden viscosity',
    bestForDish: 'Vadas, Puris, Pakodas, and Everyday Deep Frying',
    labReport: {
      batchNumber: 'SS-GND-2026-H14',
      testedDate: '12-Oct-2026',
      acidValue: '0.34 mg KOH/g (Permissible < 4.0)',
      peroxideValue: '1.18 meq O2/kg (Permissible < 10.0)',
      hexaneResidue: '0.00 ppm (Zero Chemical Solvents)',
      freeFattyAcids: '0.17% (Extra Virgin Grade)',
      iodineValue: '91.2 g I2/100g',
      tocopherolVitaminE: '22.8 mg / 100g (Naturally Intact)',
      certification: 'FSSAI & Agmark Grade I Verified'
    }
  },
  {
    id: 'ss-sesame-1000',
    name: 'SS Premium Wood-Pressed Sesame Oil',
    tagline: 'Gingelly Oil slow-pressed with Natural Palm Jaggery',
    category: 'sesame-oil',
    categoryName: 'Sesame Oil',
    price: 395,
    originalPrice: 480,
    discountPercent: 18,
    rating: 4.9,
    reviewsCount: 289,
    packSizes: ['500 ml Bottle', '1 Litre Bottle', '2 Litre Bottle', '5 Litre Can'],
    defaultPack: '1 Litre Bottle',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
    badge: 'Wood-Pressed',
    description: 'Extracted from clean black sesame seeds blended with organic palm jaggery (Karupatti) to tame bitterness. Celebrated for rich sesamol antioxidants, culinary flavour, and holistic wellness.',
    benefits: [
      'Blend of premium black sesame seeds & palm jaggery',
      'Preserves beneficial lignans (Sesamol & Sesamolin)',
      'Unsurpassed aroma for tempering, rasam, and traditional curries',
      'Zero bleaching and zero refining chemicals'
    ],
    smokePoint: '210°C (Medium-High Smoke Point)',
    extractionMethod: 'Wooden Ghani with Pure Palm Jaggery',
    inStock: true,
    featured: true,
    aromaProfile: 'Deep woody aroma with rich earthy tones and subtle jaggery caramel notes',
    bestForDish: 'Idli Podi, Sambar Tadka, Vatha Kuzhambu, and Authentic Pickling',
    labReport: {
      batchNumber: 'SS-SES-2026-K08',
      testedDate: '14-Oct-2026',
      acidValue: '0.41 mg KOH/g (Permissible < 4.0)',
      peroxideValue: '1.32 meq O2/kg (Permissible < 10.0)',
      hexaneResidue: '0.00 ppm (Zero Chemical Solvents)',
      freeFattyAcids: '0.20% (Traditional Heritage Pure)',
      iodineValue: '106.4 g I2/100g',
      tocopherolVitaminE: '28.4 mg / 100g (Sesamol & Vitamin E)',
      certification: 'FSSAI & Agmark Grade I Verified'
    }
  },
  {
    id: 'ss-coconut-1000',
    name: 'SS Pure Cold-Pressed Coconut Oil',
    tagline: 'Raw Extra-Virgin Oil from Sulphur-Free Sun-Dried Copra',
    category: 'coconut-oil',
    categoryName: 'Coconut Oil',
    price: 320,
    originalPrice: 390,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 215,
    packSizes: ['500 ml Bottle', '1 Litre Glass Jar', '2 Litre Can', '5 Litre Can'],
    defaultPack: '1 Litre Glass Jar',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    badge: '100% Pure',
    description: 'Extracted from naturally sun-dried coconut copra sourced directly from coastal farms. Absolutely chemical-free, transparent with a silky texture and heavenly coconut fragrance.',
    benefits: [
      'Naturally loaded with Lauric Acid and MCTs',
      'Multi-purpose: Ideal for cooking, raw dressing, skin & hair care',
      'Unrefined, unbleached, and non-deodorized',
      'Zero added fragrance or synthetic preservatives'
    ],
    smokePoint: '177°C (Gentle Cooking & Baking)',
    extractionMethod: 'Gentle Cold-Pressed (Below 38°C)',
    inStock: true,
    featured: true,
    aromaProfile: 'Fresh, velvety, floral sweet coconut nectar aroma',
    bestForDish: 'Avial, Coconut Rice, Kerala Fish Curry, and Daily Wellness',
    labReport: {
      batchNumber: 'SS-COC-2026-V21',
      testedDate: '15-Oct-2026',
      acidValue: '0.22 mg KOH/g (Permissible < 4.0)',
      peroxideValue: '0.85 meq O2/kg (Permissible < 10.0)',
      hexaneResidue: '0.00 ppm (Zero Chemical Solvents)',
      freeFattyAcids: '0.11% (Raw Cold Pressed Pure)',
      iodineValue: '8.4 g I2/100g',
      tocopherolVitaminE: '18.1 mg / 100g',
      certification: 'FSSAI Certified Virgin Grade'
    }
  },
  {
    id: 'ss-cooking-daily-1000',
    name: 'SS Gold Everyday Pure Cooking Oil',
    tagline: 'Light, Balanced & Nutrient-Rich Oil for Modern Kitchens',
    category: 'cooking-oil',
    categoryName: 'Cooking Oil',
    price: 210,
    originalPrice: 260,
    discountPercent: 19,
    rating: 4.7,
    reviewsCount: 182,
    packSizes: ['1 Litre Pouch', '1 Litre Bottle', '5 Litre Can', '15 Litre Tin'],
    defaultPack: '1 Litre Bottle',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    description: 'Specially created for modern Indian households looking for non-sticky, heart-friendly everyday cooking. Low oil absorption formula keeps puris, rotis, and vegetables crisp and healthy.',
    benefits: [
      'Low absorption technology for lighter everyday meals',
      'Enriched with natural Vitamin A & D',
      'Neutral aroma lets your spices and food flavours shine',
      'Multi-stage filtration without harsh chemical solvents'
    ],
    smokePoint: '240°C (High Smoke Point for Deep Fry)',
    extractionMethod: 'Physical Cold Refining & Micro-Filtration',
    inStock: true,
    featured: true,
    aromaProfile: 'Clean, light, neutral aroma that preserves native spice flavors',
    bestForDish: 'Rotis, Sabzi, Pulao, and Everyday Sautéing',
    labReport: {
      batchNumber: 'SS-EVR-2026-C03',
      testedDate: '10-Oct-2026',
      acidValue: '0.28 mg KOH/g (Permissible < 4.0)',
      peroxideValue: '1.05 meq O2/kg (Permissible < 10.0)',
      hexaneResidue: '0.00 ppm (Zero Residues)',
      freeFattyAcids: '0.14%',
      iodineValue: '122.0 g I2/100g',
      tocopherolVitaminE: '26.0 mg / 100g (Enriched)',
      certification: 'FSSAI Certified Cooking Grade'
    }
  }
];

export const WHY_CHOOSE_US_DATA: FeatureBlock[] = [
  {
    title: 'Quality Ingredients',
    description: 'Single-origin, non-GMO seeds sourced directly from certified organic farmers across India.',
    iconName: 'Sparkles',
    badge: 'Farm Fresh'
  },
  {
    title: 'Carefully Selected Products',
    description: 'Every batch undergoes 24 rigorous lab checks for iodine value, acidity, and zero pesticide residues.',
    iconName: 'ShieldCheck',
    badge: 'Lab Certified'
  },
  {
    title: 'Secure Shopping',
    description: 'End-to-end encrypted checkout with UPI, Card, NetBanking and Cash on Delivery options.',
    iconName: 'Lock',
    badge: '100% Safe'
  },
  {
    title: 'Reliable Customer Support',
    description: 'Friendly customer assistance ready to assist you via WhatsApp, phone, and direct email.',
    iconName: 'Headphones',
    badge: 'Always Here'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Priya Sundaram',
    role: 'Home Chef & Nutritionist',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    comment: 'The aroma of SS Groundnut Oil reminds me of the traditional oils my grandmother pressed in our village. There is zero foam while deep frying and the food feels so light!',
    verified: true,
    productPurchased: 'SS Mara Chekku Groundnut Oil (5L Can)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-2',
    author: 'Rajesh Kulkarni',
    role: 'Fitness Coach',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    comment: 'Switching to SS Sesame Oil and Cold-Pressed Coconut Oil has made a noticeable difference in our family’s health and digestion. Truly unadulterated pure quality in every drop.',
    verified: true,
    productPurchased: 'SS Premium Wood-Pressed Sesame Oil (1L)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-3',
    author: 'Meenakshi Ramanathan',
    role: 'Culinary Blogger',
    location: 'Madurai, Tamil Nadu',
    rating: 5,
    comment: 'I run a traditional South Indian recipe blog and pure gingelly oil is non-negotiable. SS OIL provides genuine wood-pressed oil with zero chemical aroma. Highly recommended!',
    verified: true,
    productPurchased: 'SS Cold-Pressed Virgin Coconut Oil (1L Jar)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
];
