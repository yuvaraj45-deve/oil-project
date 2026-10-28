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
  slug?: string;
  name: string;
  tamilName?: string;
  tagline: string;
  category: 'cooking-oil' | 'sesame-oil' | 'groundnut-oil' | 'coconut-oil' | 'mustard-oil' | 'pooja-special' | 'a2-desi-ghee' | 'palm-jaggery-special' | string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  packSizes: string[];
  defaultPack: string;
  image: string;
  badge?: 'Bestseller' | 'Cold-Pressed' | 'Wood-Pressed' | 'Popular' | '100% Pure' | 'Light & Pure' | 'Heart Care' | 'Temple Pooja' | 'Bilona Pure' | 'Native Pure' | string;
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

export interface OrderItemRecord {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city?: string;
  pincode?: string;
  paymentMethod: 'UPI' | 'CARD' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItemRecord[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'customer' | 'admin';
  memberTier: 'Gold Member' | 'Silver Member' | 'Platinum Member';
  purityPoints: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  announcementText: string;
  announcementSubText: string;
  announcementEnabled: boolean;
  phone: string;
  email: string;
  millAddress: string;
  millHours: string;
  fssaiLicense: string;
  currency: string;
  timeZone: string;
  defaultLanguage: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  gstRate: number;
  razorpayKeyId: string;
  upiVpa: string;
  codEnabled: boolean;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'ss oil',
  tagline: 'Pure & Healthy Mara Chekku Heritage',
  description: 'Pure Mara Chekku oil crafted from chemical-free, pesticide-free native seeds crushed in authentic Vaagai wood pestles without artificial heat, refining, or solvents.',
  logoUrl: '/admin_assets/ss_gold_drop_logo.png',
  announcementText: 'Pure Mara Chekku Oils, Trusted Since 1957',
  announcementSubText: '10,000+ Kitchens Served',
  announcementEnabled: true,
  phone: '+91 98765 43210',
  email: 'care@ssoil.in',
  millAddress: 'SS OIL Mills & Packing Unit, No. 42 Chekku Street, Industrial Estate, Salem, Tamil Nadu – 636004',
  millHours: 'Mon – Sat: 9:00 AM – 7:30 PM IST',
  fssaiLicense: '',
  currency: 'INR (₹)',
  timeZone: 'Asia/Kolkata',
  defaultLanguage: 'English',
  freeDeliveryThreshold: 499,
  deliveryFee: 50,
  gstRate: 5,
  razorpayKeyId: 'rzp_live_9204918234',
  upiVpa: 'ssoil@icici',
  codEnabled: true,
};

export interface HomeFeaturedVideo {
  enabled: boolean;
  title: string;
  tamilTitle?: string;
  subtitle: string;
  tamilSubtitle?: string;
  badge: string;
  videoUrl: string;
  videoType: 'mp4' | 'youtube';
  posterUrl: string;
  autoplay: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface ReelStory {
  id: string;
  video: string;
  creator: string;
  title: string;
  dishName: string;
  oilUsed: string;
  productSlug: string;
  description: string;
  poster?: string;
  enabled?: boolean;
}

export const DEFAULT_HOME_FEATURED_VIDEO: HomeFeaturedVideo = {
  enabled: true,
  title: 'Mara Chekku Heritage: The Live Wood Pressing Experience',
  tamilTitle: 'மரச்செக்கு பாரம்பரியம்: நேரடி வாகை மரச்செக்கு ஆலை தயாரிப்பு முறை',
  subtitle: 'Watch how native seeds are crushed cold in Vaagai wood pestles without artificial heat or chemical solvents.',
  tamilSubtitle: 'பாரம்பரிய முறையில் வாகை மர உரலில் நாட்டு விதைகளை பிழிந்து தூய எண்ணெய் தயாரிக்கும் நேரடி காட்சி.',
  badge: 'Salem Mill Heritage 🎥',
  videoUrl: '/videos/reel_1.mp4',
  videoType: 'mp4',
  posterUrl: '/products/sesame_oil.jpg',
  autoplay: false,
  buttonText: 'Shop Authentic Oils',
  buttonLink: '/shop',
};

export const DEFAULT_REELS_DATA: ReelStory[] = [
  {
    id: 'reel_1',
    video: '/videos/reel_1.mp4',
    creator: '@ssoil_official',
    title: 'Heritage Mill Cooking & Live Crushing Fair',
    dishName: 'Authentic Mara Chekku Cooking',
    oilUsed: 'Pure Wood-Pressed Sesame Oil',
    productSlug: 'ss-gingelly-1000',
    description: 'Traditional Vaagai wood churned oil used in authentic South Indian kitchens. Chemical-free, nutrient-rich liquid gold.',
    enabled: true,
  },
  {
    id: 'reel_2',
    video: '/videos/reel_2.mp4',
    creator: '@neeraj_elango',
    title: 'Hand-Rolled Rotis with Vaagai Groundnut Oil',
    dishName: 'Fluffy Soft Layered Chapatis',
    oilUsed: 'Cold-Pressed Native Groundnut Oil',
    productSlug: 'ss-groundnut-1000',
    description: 'Fluffy, ultra-soft layered chapatis prepared with wholesome cold-pressed native groundnut oil without any heavy greasiness.',
    enabled: true,
  },
  {
    id: 'reel_3',
    video: '/videos/reel_3.mp4',
    creator: '@chef_samayal',
    title: 'Aromatic Curry Leaf Sizzling Tadka',
    dishName: 'Crisp Curry Leaf & Mustard Crackle',
    oilUsed: 'Palm Jaggery Mara Chekku Gingelly Oil',
    productSlug: 'ss-gingelly-1000',
    description: 'Fresh garden curry leaves crackling in authentic wood-pressed gingelly oil infused with natural Karupatti sweetness.',
    enabled: true,
  },
  {
    id: 'reel_4',
    video: '/videos/reel_4.mp4',
    creator: '@south_kitchen',
    title: 'Crispy Spiced Potato Roast & Flavored Rice',
    dishName: 'Chettinad Crispy Potato Fry',
    oilUsed: 'Wood Pressed Groundnut Oil',
    productSlug: 'ss-groundnut-1000',
    description: 'Slow-roasted spicy golden potatoes paired with aromatic seasoned cumin rice in authentic wood-pressed oil.',
    enabled: true,
  },
  {
    id: 'reel_5',
    video: '/videos/reel_5.mp4',
    creator: '@priya_cooking',
    title: 'Healthy Mara Chekku Oil in Modern Kitchens',
    dishName: 'Everyday Wholesome Home Cooking',
    oilUsed: '100% Chemical-Free Mara Chekku Range',
    productSlug: 'ss-coconut-1000',
    description: 'Why switching from chemical-refined solvent oils to SS OIL 100% unrefined cold-pressed oils transformed my family wellness.',
    enabled: true,
  },
];

