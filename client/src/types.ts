export interface LabReport {
  batchNumber: string;
  testedDate: string;
  acidValue: string;
  peroxideValue: string;
  hexaneResidue: string;
  freeFattyAcids: string;
  iodineValue: string;
  tocopherolVitaminE: string;
  certification: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'cooking-oil' | 'sesame-oil' | 'groundnut-oil' | 'coconut-oil' | 'mustard-oil';
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  packSizes: string[];
  defaultPack: string;
  image: string;
  badge?: 'Bestseller' | 'Cold-Pressed' | 'Wood-Pressed' | 'Popular' | '100% Pure';
  description: string;
  benefits: string[];
  smokePoint: string;
  extractionMethod: string;
  inStock: boolean;
  featured?: boolean;
  labReport?: LabReport;
  aromaProfile?: string;
  bestForDish?: string;
}

export interface FlagshipHeroOil {
  id: string;
  name: string;
  botanicalSource: string;
  tagline: string;
  highlightBadge: string;
  woodPressTree: string;
  rpm: string;
  temperature: string;
  smokePoint: string;
  flavorNote: string;
  accentColor: string;
  image: string;
  price: number;
  originalPrice: number;
  defaultPack: string;
  batchCode: string;
}

export interface CraftStage {
  step: number;
  title: string;
  traditionalName: string;
  tagline: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  image: string;
}

export interface CulinaryPairing {
  id: string;
  dishCategory: string;
  iconName: string;
  dishes: string;
  recommendedOilName: string;
  productId: string;
  whyItWorks: string;
  smokePoint: string;
  flavorAroma: string;
  price: number;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  itemCount: string;
  badge: string;
  highlightText: string;
}

export interface CartItem {
  product: Product;
  packSize: string;
  quantity: number;
  price: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  verified: boolean;
  productPurchased: string;
  avatar: string;
}

export interface FeatureBlock {
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'Sparkles' | 'Lock' | 'Headphones' | 'Heart' | 'Flame';
  badge: string;
}
