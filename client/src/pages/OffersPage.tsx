import React, { useState, useEffect } from 'react';
import {
  Tag,
  Percent,
  Copy,
  Check,
  Clock,
  Calendar,
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  CheckCircle2,
  Info,
  Award,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Scissors,
  Zap,
  Timer,
  Package,
  SlidersHorizontal,
  Box,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCMS } from '../context/CMSContext';
import { useOffers } from '../context/OfferContext';

// ========================================================
// 1. DATA TYPES & INTERFACES
// ========================================================

export interface CouponItem {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // e.g. 10 for 10%, 100 for ₹100
  title: string;
  tamilTitle: string;
  subtitle: string;
  tamilSubtitle: string;
  imageUrl: string;
  applicableProducts: string;
  tamilApplicableProducts: string;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  tamilStartDate: string;
  expiryDate: string;
  tamilExpiryDate: string;
  badge: string;
  tamilBadge: string;
  badgeColor: string;
  category: 'first' | 'cart' | 'bulk' | 'shipping' | 'festive' | 'combo' | 'b2g1';
  percentageTab?: '10' | '15' | '20' | '30' | 'flat' | 'free';
  terms: string[];
  tamilTerms: string[];
}

// 7 Core Verified Offers matching user specifications & TiDB schema
export const AVAILABLE_COUPONS: CouponItem[] = [
  {
    id: 'offer-1',
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    title: '10% OFF on First Order',
    tamilTitle: 'முதல் ஆர்டருக்கு 10% தள்ளுபடி',
    subtitle: 'Welcome offer for new customers on pure cold-pressed native Mara Chekku oils',
    tamilSubtitle: 'புதிய வாடிக்கையாளர்களுக்கு மரச்செக்கு எண்ணெய்கள் மீது சிறப்பு வரவேற்பு தள்ளுபடி',
    imageUrl: '/products/groundnut_oil.jpg',
    applicableProducts: 'All Wood-Pressed Oils (Sesame, Groundnut, Coconut)',
    tamilApplicableProducts: 'அனைத்து மரச்செக்கு நல்லெண்ணெய், கடலை, தேங்காய் எண்ணெய்கள்',
    minOrder: 499,
    maxDiscount: 150,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'NEW CUSTOMER',
    tamilBadge: 'புதிய வாடிக்கையாளர்',
    badgeColor: 'bg-emerald-600',
    category: 'first',
    percentageTab: '10',
    terms: [
      'Valid once per customer on their first oil purchase',
      'Applicable on all 500ml, 1L, and 2L cold-pressed oil bottles',
      'Maximum discount savings capped at ₹150',
      'Cannot be combined or clubbed with other promotional coupons',
    ],
    tamilTerms: [
      'முதல் முறை வாங்கும் வாடிக்கையாளர்களுக்கு ஒரு முறை மட்டுமே பொருந்தும்',
      'அனைத்து 500ml, 1L மற்றும் 2L மரச்செக்கு எண்ணெய் பாட்டில்களுக்கும் பொருந்தும்',
      'அதிகபட்ச தள்ளுபடி வரம்பு ₹150',
      'பிற கூப்பன்களுடன் இணைக்க முடியாது',
    ],
  },
  {
    id: 'offer-2',
    code: 'SAVE15',
    discountType: 'percentage',
    discountValue: 15,
    title: '15% OFF on Orders Above ₹1000',
    tamilTitle: '₹1000 மேல் ஆர்டருக்கு 15% தள்ளுபடி',
    subtitle: 'Stock up your family pantry with authentic wood-pressed oils. Save 15% instantly',
    tamilSubtitle: 'குடும்ப சமையல் பயன்பாட்டிற்கு மொத்தமாக வாங்கும்போது சிறப்புச் சேமிப்பு',
    imageUrl: '/products/sesame_oil.jpg',
    applicableProducts: 'All 1L & 2L Family Pack Oil Bottles',
    tamilApplicableProducts: 'அனைத்து 1L மற்றும் 2L குடும்ப பயன்பாட்டு பாட்டில்கள்',
    minOrder: 1000,
    maxDiscount: 300,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'POPULAR DEAL',
    tamilBadge: 'அதிகம் விரும்பப்படும் சலுகை',
    badgeColor: 'bg-amber-600',
    category: 'cart',
    percentageTab: '15',
    terms: [
      'Minimum order cart value must be ₹1000 or above',
      'Valid across cold-pressed sesame, groundnut, and coconut oils',
      'Maximum discount savings capped at ₹300 per checkout',
      'Unlimited usages per customer throughout the offer period',
    ],
    tamilTerms: [
      'கார்ட் மதிப்பு குறைந்தபட்சம் ₹1000 இருக்க வேண்டும்',
      'நல்லெண்ணெய், கடலை எண்ணெய் மற்றும் தேங்காய் எண்ணெய்களுக்கு பொருந்தும்',
      'அதிகபட்ச சேமிப்பு தொகை ₹300',
      'சலுகை காலத்தில் எத்தனை முறை வேண்டுமானாலும் பயன்படுத்தலாம்',
    ],
  },
  {
    id: 'offer-3',
    code: 'BULK20',
    discountType: 'percentage',
    discountValue: 20,
    title: '20% OFF on Bulk Orders',
    tamilTitle: 'மொத்த ஆர்டருக்கு 20% பெருந்தள்ளுபடி',
    subtitle: 'Flat 20% off on 5 Litre cans, 15 Litre tins, and commercial kitchen supplies',
    tamilSubtitle: '5 லிட்டர் கேன், 15 லிட்டர் டின் மற்றும் காம்போ பேக்கேஜ்களுக்கு பிளாட் 20% தள்ளுபடி',
    imageUrl: '/products/ss_oil_can.jpg',
    applicableProducts: '5L Heavy-Duty Cans & 15L Commercial Tins',
    tamilApplicableProducts: '5 லிட்டர் கேன் & 15 லிட்டர் டின் மொத்த விற்பனை',
    minOrder: 2500,
    maxDiscount: 750,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'MEGA SAVINGS',
    tamilBadge: 'மெகா சேமிப்பு',
    badgeColor: 'bg-forest-900',
    category: 'bulk',
    percentageTab: '20',
    terms: [
      'Minimum cart value must be ₹2500 to qualify',
      'Applies to all 5L food-grade cans and 15L commercial sealed tins',
      'Maximum cash savings capped at ₹750 per order',
      'Includes complimentary heavy-duty cardboard protective parcel packaging',
    ],
    tamilTerms: [
      'கார்ட் மதிப்பு குறைந்தபட்சம் ₹2500 இருக்க வேண்டும்',
      'அனைத்து 5L கேன் மற்றும் 15L டின் தயாரிப்புகளுக்கு பொருந்தும்',
      'ஒரு ஆர்டருக்கு அதிகபட்ச சேமிப்பு ₹750',
      'பாதுகாப்பான கனரக பார்சல் பேக்கிங் இலவசம்',
    ],
  },
  {
    id: 'offer-7',
    code: 'B2G1FREE',
    discountType: 'percentage',
    discountValue: 33,
    title: 'Buy 2 Get 1 Free Mara Chekku Deal',
    tamilTitle: 'பை 2 கெட் 1 இலவச மரச்செக்கு சலுகை',
    subtitle: 'Buy 2 bottles of 1L Sesame Oil and get 1L Coconut Oil Free (33% equivalent combo discount)',
    tamilSubtitle: '2 நல்லெண்ணெய் வாங்கினால் 1 தேங்காய் எண்ணெய் முற்றிலும் இலவசம் (33% காம்போ தள்ளுபடி)',
    imageUrl: '/banners/sesame_sunflower_banner.jpg',
    applicableProducts: 'Mara Chekku Sesame 1L & Coconut Oil 1L',
    tamilApplicableProducts: 'மரச்செக்கு நல்லெண்ணெய் 1L & தேங்காய் எண்ணெய் 1L',
    minOrder: 1100,
    maxDiscount: 360,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'BUY 2 GET 1 FREE',
    tamilBadge: 'பை 2 கெட் 1 இலவசம்',
    badgeColor: 'bg-rose-700',
    category: 'b2g1',
    percentageTab: '30',
    terms: [
      'Add 2 bottles of 1L Sesame Oil to cart to claim 1L Coconut Oil free',
      'Equivalent to 33% instant bundle discount',
      'Valid while festive batch stock lasts',
      'Free oil bottle packed and sealed directly from mill',
    ],
    tamilTerms: [
      '2 பாட்டில் 1L நல்லெண்ணெய் கார்ட்டில் சேர்த்தால் 1L தேங்காய் எண்ணெய் இலவசம்',
      '33% நேரடி காம்போ சேமிப்புக்கு சமம்',
      'பண்டிகை கால ஆலை இருப்பு வரை மட்டுமே',
      'இலவச எண்ணெய் பாட்டில் ஆலையிலிருந்து பாதுகாப்பாக சீலிடப்பட்டு அனுப்பப்படும்',
    ],
  },
  {
    id: 'offer-6',
    code: 'FESTIVECOMBO',
    discountType: 'percentage',
    discountValue: 18,
    title: '18% OFF on Festival Combos',
    tamilTitle: 'பண்டிகை காம்போக்களுக்கு 18% தள்ளுபடி',
    subtitle: 'Special combo savings on Sesame, Groundnut and Coconut pure oils in celebratory box',
    tamilSubtitle: 'நல்லெண்ணெய், கடலை எண்ணெய் மற்றும் தேங்காய் எண்ணெய் காம்போக்களுக்கு சிறப்பு சேமிப்பு',
    imageUrl: '/banners/groundnut_hero_banner.jpg',
    applicableProducts: 'Mara Chekku Heritage Trio (Sesame + Groundnut + Coconut)',
    tamilApplicableProducts: 'மரச்செக்கு மூவர் காம்போ (நல்லெண்ணெய் + கடலை + தேங்காய்)',
    minOrder: 1800,
    maxDiscount: 500,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'FESTIVE SPECIAL',
    tamilBadge: 'பண்டிகை சிறப்பு',
    badgeColor: 'bg-purple-700',
    category: 'festive',
    percentageTab: '15',
    terms: [
      'Includes complimentary authentic pure cotton lamp wicks in the combo box',
      'Valid on festive trio and multi-oil celebration packages',
      'Maximum discount capped at ₹500',
      'Safe doorstep courier delivery guaranteed before festival dates',
    ],
    tamilTerms: [
      'தூய பருத்தி விளக்கு திரிகள் முற்றிலும் இலவசமாக வழங்கப்படும்',
      'பண்டிகை மூவர் காம்போ பாக்ஸ்களுக்கு பொருந்தும்',
      'அதிகபட்ச தள்ளுபடி வரம்பு ₹500',
      'நேரடி வீட்டு டெலிவரி உறுதி செய்யப்படுகிறது',
    ],
  },
  {
    id: 'offer-5',
    code: 'VAAGAI100',
    discountType: 'fixed',
    discountValue: 100,
    title: 'Flat ₹100 OFF Heritage Special',
    tamilTitle: 'பாரம்பரிய சலுகை - பிளாட் ₹100 தள்ளுபடி',
    subtitle: 'Direct mill discount celebrating traditional Vaagai wood ghani pressing',
    tamilSubtitle: 'பாரம்பரிய வாகை மரச்செக்கு தயாரிப்புகளை கொண்டாடும் நேரடி ஆலை தள்ளுபடி',
    imageUrl: '/products/coconut_oil.jpg',
    applicableProducts: 'Heritage Cold-Pressed Ghee & Oils Trio',
    tamilApplicableProducts: 'வாகை மரச்செக்கு எண்ணெய்கள் & தூய நெய்',
    minOrder: 1299,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: '31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை',
    badge: 'MILL HERITAGE',
    tamilBadge: 'ஆலை பாரம்பரியம்',
    badgeColor: 'bg-amber-800',
    category: 'cart',
    percentageTab: 'flat',
    terms: [
      'Flat ₹100 deduction applied instantly at checkout',
      'Requires minimum cart order value of ₹1299',
      'Applicable on all cold-pressed oils and A2 cow ghee',
      'Valid for both existing and new registered customers',
    ],
    tamilTerms: [
      'செக்அவுட்டில் உடனடியாக பிளாட் ₹100 கழிக்கப்படும்',
      'குறைந்தபட்ச ஆர்டர் மதிப்பு ₹1299 தேவை',
      'மரச்செக்கு எண்ணெய்கள் மற்றும் நாட்டு மாட்டு நெய்க்கு பொருந்தும்',
      'அனைத்து வாடிக்கையாளர்களுக்கும் பொருந்தும்',
    ],
  },
  {
    id: 'offer-4',
    code: 'FREEDEL',
    discountType: 'free_shipping',
    discountValue: 50,
    title: '100% Free Express Delivery',
    tamilTitle: '100% இலவச விரைவு டெலிவரி',
    subtitle: 'Zero shipping charge anywhere across Tamil Nadu directly from our Salem mill',
    tamilSubtitle: 'எங்கள் சேலம் ஆலையிலிருந்து உங்கள் வீட்டிற்கு கட்டணமில்லா நேரடி டெலிவரி',
    imageUrl: '/banners/ssoil_bottling_hero_banner.jpg',
    applicableProducts: 'All Store Products (Tamil Nadu Express Delivery)',
    tamilApplicableProducts: 'அனைத்து தயாரிப்புகள் (தமிழகம் முழுவதும் இலவச விரைவு டெலிவரி)',
    minOrder: 0,
    startDate: '01 Jan 2026',
    tamilStartDate: '01 ஜனவரி 2026',
    expiryDate: 'Permanent Mill Offer',
    tamilExpiryDate: 'ஆலையின் நிரந்தர சலுகை',
    badge: 'FREE DELIVERY',
    tamilBadge: 'இலவச டெலிவரி',
    badgeColor: 'bg-[#1e7e34]',
    category: 'shipping',
    percentageTab: 'free',
    terms: [
      'No minimum order purchase required (₹0 minimum order)',
      'Free express doorstep delivery across all pin codes in Tamil Nadu',
      'Dispatched directly from Salem mill within 24 hours of booking',
      'Includes full transit insurance against parcel leakage or damage',
    ],
    tamilTerms: [
      'எந்த குறைந்தபட்ச ஆர்டர் வரம்பும் இல்லை (₹0)',
      'தமிழ்நாடு முழுவதும் கட்டணமில்லா விரைவு வீட்டு டெலிவரி',
      'சேலம் ஆலையிலிருந்து 24 மணி நேரத்திற்குள் அனுப்பப்படும்',
      'பாதுகாப்பான போக்குவரத்து காப்பீடு சேர்க்கப்பட்டுள்ளது',
    ],
  },
];

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

interface OffersPageProps {
  onNavigate: (path: string) => void;
  onOpenCart?: () => void;
}

// ========================================================
// 2. MAIN COMPONENT
// ========================================================

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate, onOpenCart }) => {
  const { language } = useLanguage();
  const { siteContent } = useCMS();
  const { activeOffer, applyOffer, removeOffer } = useOffers();
  const offersCms = siteContent?.offers?.status === 'PUBLISHED' ? siteContent.offers : null;

  const bannerHeadline =
    language === 'ta'
      ? offersCms?.tamilBannerTitle || 'பாரம்பரிய மரச்செக்கு மெகா பண்டிகை சலுகைகள் & தள்ளுபடிகள்'
      : offersCms?.bannerTitle || 'Exclusive Mara Chekku Offers & Festival Discounts';
  const bannerDesc =
    language === 'ta'
      ? offersCms?.tamilDescription ||
        'சேலம் மரச்செக்கு ஆலையிலிருந்து நேரடியாக உங்கள் வீட்டிற்கு வரும் 100% தூய இயற்கை எண்ணெய்களுக்கு 33% வரை நேரடி ஆலை தள்ளுபடி, பை 2 கெட் 1 இலவசம் மற்றும் கட்டணமில்லா விரைவு டெலிவரி!'
      : offersCms?.description ||
        'Enjoy authentic native oils crushed slowly at 14 RPM in traditional Vaagai wood ghani. Unlock up to 33% instant mill savings, Buy 2 Get 1 Free combos, and free express delivery across Tamil Nadu.';

  const [coupons, setCoupons] = useState<CouponItem[]>(AVAILABLE_COUPONS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<string>('all');
  const [percentageSubFilter, setPercentageSubFilter] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<{ [code: string]: boolean }>({});

  // Live Countdown Timer State (Ticking towards end of the week / flash deal)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 2, hours: 14, minutes: 38, seconds: 45 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live active offers from TiDB database
  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/offers?activeOnly=true`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const now = new Date();
          // Filter out expired offers or inactive offers strictly
          const activeList = json.data.filter((item: any) => {
            if (item.isActive === false) return false;
            if (item.endDate && new Date(item.endDate) < now) return false;
            if (item.status === 'EXPIRED') return false;
            return true;
          });

          const dynamicList: CouponItem[] = activeList.map((item: any) => {
            const discountType =
              item.discountType === 'PERCENTAGE'
                ? 'percentage'
                : item.discountType === 'FIXED'
                ? 'fixed'
                : 'free_shipping';

            const formattedStartDate = item.startDate
              ? new Date(item.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '01 Jan 2026';

            const formattedEndDate = item.endDate
              ? new Date(item.endDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '31 Dec 2026';

            const existing = AVAILABLE_COUPONS.find(
              (c) => c.code.toUpperCase() === item.code.toUpperCase()
            );

            let tab: '10' | '15' | '20' | '30' | 'flat' | 'free' = '15';
            if (discountType === 'free_shipping') tab = 'free';
            else if (discountType === 'fixed') tab = 'flat';
            else if (item.discountValue >= 30) tab = '30';
            else if (item.discountValue >= 20) tab = '20';
            else if (item.discountValue >= 15) tab = '15';
            else tab = '10';

            return {
              id: item.id,
              code: item.code,
              discountType,
              discountValue: item.discountValue,
              title: item.title,
              tamilTitle: existing?.tamilTitle || item.title,
              subtitle: item.description || existing?.subtitle || 'Pure wood-pressed oil offer',
              tamilSubtitle:
                existing?.tamilSubtitle || item.description || 'மரச்செக்கு எண்ணெய் சிறப்புச் சலுகை',
              imageUrl: item.imageUrl || existing?.imageUrl || '/products/sesame_oil.jpg',
              applicableProducts:
                item.applicableProducts ||
                existing?.applicableProducts ||
                'All Wood-Pressed Oils (Sesame, Groundnut, Coconut)',
              tamilApplicableProducts:
                existing?.tamilApplicableProducts ||
                'அனைத்து மரச்செக்கு நல்லெண்ணெய், கடலை, தேங்காய் எண்ணெய்கள்',
              minOrder: item.minOrderValue || 0,
              maxDiscount: item.maxDiscount,
              startDate: formattedStartDate,
              tamilStartDate: formattedStartDate,
              expiryDate: formattedEndDate,
              tamilExpiryDate: `${formattedEndDate} வரை`,
              badge:
                existing?.badge ||
                (item.discountType === 'PERCENTAGE'
                  ? `${item.discountValue}% SAVINGS`
                  : item.discountType === 'FIXED'
                  ? `₹${item.discountValue} FLAT OFF`
                  : 'FREE EXPRESS'),
              tamilBadge: existing?.tamilBadge || 'சிறப்புச் சலுகை',
              badgeColor: existing?.badgeColor || 'bg-[#1e7e34]',
              category: existing?.category || (item.minOrderValue >= 2000 ? 'bulk' : 'cart'),
              percentageTab: tab,
              terms: existing?.terms || [
                `Valid on eligible cold-pressed products`,
                item.minOrderValue > 0
                  ? `Minimum order value: ₹${item.minOrderValue}`
                  : `No minimum cart order required`,
                item.maxDiscount ? `Maximum savings capped at ₹${item.maxDiscount}` : `Flat direct deduction`,
                `Valid till ${formattedEndDate}`,
              ],
              tamilTerms: existing?.tamilTerms || [
                'தகுதியுள்ள மரச்செக்கு தயாரிப்புகளுக்கு மட்டுமே பொருந்தும்',
                item.minOrderValue > 0
                  ? `குறைந்தபட்ச ஆர்டர் மதிப்பு: ₹${item.minOrderValue}`
                  : `எந்த குறைந்தபட்ச ஆர்டர் வரம்பும் இல்லை`,
                'பிற கூப்பன்களுடன் இணைக்க இயலாது',
                `${formattedEndDate} வரை செல்லுபடியாகும்`,
              ],
            };
          });

          if (dynamicList.length > 0) {
            setCoupons(dynamicList);
          }
        }
      } catch (e) {
        console.warn('Could not load dynamic offers, using default verified list:', e);
      }
    };

    fetchActiveOffers();
    window.addEventListener('ssoil_coupon_updated', fetchActiveOffers);
    return () => window.removeEventListener('ssoil_coupon_updated', fetchActiveOffers);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2400);
  };

  const toggleTerms = (code: string) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const handleSelectOffer = (coupon: CouponItem) => {
    applyOffer({
      code: coupon.code,
      title: coupon.title,
      tamilTitle: coupon.tamilTitle || coupon.title,
      description: coupon.subtitle || '',
      tamilDescription: coupon.tamilSubtitle || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrder ?? 0,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
      tamilExpiryDate: coupon.tamilExpiryDate,
      badge: coupon.badge,
      tamilBadge: coupon.tamilBadge,
      badgeColor: coupon.badgeColor,
    });
  };

  const handleApplyAndShop = (coupon: CouponItem) => {
    handleSelectOffer(coupon);
    onNavigate('/shop');
  };

  // Filter coupons by selected category tab
  const filteredCoupons = coupons.filter((c) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'festive') return c.category === 'festive' || c.code === 'FESTIVECOMBO';
    if (filterTab === 'combo') return c.category === 'combo' || c.category === 'festive' || c.code === 'B2G1FREE' || c.code === 'FESTIVECOMBO' || c.code === 'VAAGAI100';
    if (filterTab === 'b2g1') return c.category === 'b2g1' || c.code === 'B2G1FREE';
    if (filterTab === 'percentage') {
      if (percentageSubFilter === 'all') return c.discountType === 'percentage';
      if (percentageSubFilter === '10') return c.discountValue === 10;
      if (percentageSubFilter === '15') return c.discountValue === 15 || c.discountValue === 18;
      if (percentageSubFilter === '20') return c.discountValue === 20;
      if (percentageSubFilter === '30') return c.discountValue >= 30;
      return c.discountType === 'percentage';
    }
    if (filterTab === 'coupons') return Boolean(c.code);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24 font-sans">
      
      {/* ======================================================== */}
      {/* 1. HERO PROMOTIONAL BANNER WITH LIVE COUNTDOWN           */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#122E22] via-[#16382A] to-[#122E22] text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#2C5340] shadow-xl">
        {/* Decorative Golden Ambient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top Category Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wider uppercase shadow-inner">
            <span>{language === 'ta' ? 'எஸ் எஸ் ஆயில் சிறப்பு சலுகைகள் & தள்ளுபடிகள்' : 'SS OIL EXCLUSIVE OFFERS & DISCOUNTS'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {bannerHeadline}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {bannerDesc}
          </p>

          {/* LIVE COUNTDOWN TIMER WIDGET */}
          <div className="pt-2 pb-2">
            <div className="inline-block bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-amber-400/30 shadow-2xl">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
                <Timer className="w-4 h-4 animate-spin text-amber-400" />
                <span>{language === 'ta' ? 'வரையறுக்கப்பட்ட சலுகை முடியும் நேரம்:' : 'Limited Time Offer Ends In:'}</span>
              </div>

              {/* Countdown Digits Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-[#1A3D2F] border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 min-w-[62px] sm:min-w-[80px]">
                  <span className="font-mono text-2xl sm:text-4xl font-black text-white block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mt-0.5">
                    {language === 'ta' ? 'நாட்கள்' : 'Days'}
                  </span>
                </div>

                <div className="bg-[#1A3D2F] border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 min-w-[62px] sm:min-w-[80px]">
                  <span className="font-mono text-2xl sm:text-4xl font-black text-white block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mt-0.5">
                    {language === 'ta' ? 'மணி' : 'Hours'}
                  </span>
                </div>

                <div className="bg-[#1A3D2F] border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 min-w-[62px] sm:min-w-[80px]">
                  <span className="font-mono text-2xl sm:text-4xl font-black text-white block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mt-0.5">
                    {language === 'ta' ? 'நிமிடம்' : 'Mins'}
                  </span>
                </div>

                <div className="bg-[#1A3D2F] border border-amber-400/40 rounded-2xl p-2.5 sm:p-3 min-w-[62px] sm:min-w-[80px]">
                  <span className="font-mono text-2xl sm:text-4xl font-black text-amber-300 block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mt-0.5">
                    {language === 'ta' ? 'வினாடி' : 'Secs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleApplyAndShop(coupons[0] || AVAILABLE_COUPONS[0])}
              className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#c29f2f] text-forest-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-forest-950" />
              <span>{language === 'ta' ? 'முதல் ஆர்டர் 10% சலுகையை பெறுக' : 'Claim 10% Welcome Offer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#active-offer-cards"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-amber-400/40 backdrop-blur-md font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Tag className="w-4 h-4 text-amber-300" />
              <span>{language === 'ta' ? 'அனைத்து சலுகைகளையும் காண்க' : 'Explore All Offer Cards'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 flex items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs text-stone-300 font-semibold flex-wrap">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{language === 'ta' ? '100% தூய வாகை மரச்செக்கு' : '100% Vaagai Wood Ghani'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'தமிழ்நாடு முழுவதும் இலவச டெலிவரி' : 'Free Express Delivery in TN'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'ta' ? 'நேரடி ஆலை விலை சேமிப்பு' : 'Direct Mill Pricing'}</span>
            </span>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATEGORY FILTER TABS                                  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-md space-y-3">
          
          <div className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs font-black uppercase tracking-wider text-forest-950 whitespace-nowrap pl-2 hidden sm:inline-flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'வகை வடிகட்டி:' : 'Filter Offers:'}</span>
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: language === 'ta' ? 'அனைத்து சலுகைகள் (7)' : 'All Offers (7)', icon: Tag },
                { id: 'festive', label: language === 'ta' ? 'பண்டிகை சலுகைகள்' : 'Festival Offers', icon: Gift },
                { id: 'combo', label: language === 'ta' ? 'காம்போ சலுகைகள்' : 'Combo Offers', icon: Box },
                { id: 'b2g1', label: language === 'ta' ? 'பை 2 கெட் 1 இலவசம்' : 'Buy 2 Get 1 Free', icon: Gift },
                { id: 'percentage', label: language === 'ta' ? 'சதவீத தள்ளுபடி' : 'Percentage Deals', icon: Percent },
                { id: 'coupons', label: language === 'ta' ? 'கூப்பன் குறியீடுகள்' : 'Coupon Codes', icon: Scissors },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-forest-950 text-gold-300 shadow-sm'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-gold-300' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Filter for Percentage Discounts */}
          {filterTab === 'percentage' && (
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pl-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {language === 'ta' ? 'தள்ளுபடி அளவு:' : 'Discount Value:'}
              </span>
              {[
                { id: 'all', label: 'All Percentages' },
                { id: '10', label: '10% OFF' },
                { id: '15', label: '15% - 18% OFF' },
                { id: '20', label: '20% OFF' },
                { id: '30', label: '33% OFF (B2G1)' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPercentageSubFilter(sub.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    percentageSubFilter === sub.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MAIN SECTION: ACTIVE OFFER CARDS (ALL 10 ITEMS)      */}
      {/* ======================================================== */}
      <section id="active-offer-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        {/* Section Header */}
        <div className="border-b border-stone-200 pb-5 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1e7e34] text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அனைத்து சரிபார்க்கப்பட்ட சலுகைகள்' : 'All Verified Active Offers'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-forest-950 tracking-tight">
            {language === 'ta' ? 'கிடைக்கும் அனைத்து தள்ளுபடி சலுகை அட்டைகள்' : 'SS Oil Verified Discount Offer Cards'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'ஒவ்வொரு சலுகை அட்டையிலும் சலுகை படம், தள்ளுபடி %, பொருந்தும் தயாரிப்புகள், கூப்பன் குறியீடு, தொடக்க-முடிவு தேதிகள் மற்றும் விதிமுறைகள் தெளிவாக கொடுக்கப்பட்டுள்ளன.'
              : 'Each offer card displays banner image, discount %, applicable products, coupon code with copy button, validity dates, minimum order, terms & conditions, and apply action.'}
          </p>
        </div>

        {/* OFFER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            const isOfferActive = activeOffer?.code?.toUpperCase() === coupon.code.toUpperCase();
            const isTermsExpanded = Boolean(expandedTerms[coupon.code]);

            return (
              <div
                key={coupon.code}
                className={`relative bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-md hover:shadow-xl ${
                  isOfferActive
                    ? 'border-emerald-600 ring-2 ring-emerald-400/40 shadow-xl'
                    : 'border-stone-200/90'
                }`}
              >
                
                {/* 1. OFFER BANNER / IMAGE */}
                <div className="relative h-44 w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent overflow-hidden">
                  <img
                    src={coupon.imageUrl}
                    alt={coupon.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', '/banners/sesame_sunflower_banner.jpg');
                    }}
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                  {/* Top Left Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${coupon.badgeColor} shadow-md`}
                    >
                      {language === 'ta' ? coupon.tamilBadge : coupon.badge}
                    </span>
                  </div>

                  {/* 3. DISCOUNT PERCENTAGE BADGE (Top Right) */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-white/95 text-forest-950 shadow-md backdrop-blur-md border border-stone-200 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-emerald-600" />
                      <span>
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : coupon.discountType === 'fixed'
                          ? `₹${coupon.discountValue} OFF`
                          : 'FREE SHIP'}
                      </span>
                    </span>
                  </div>

                  {/* Title overlay on bottom of banner */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <h3 className="font-serif font-black text-lg text-white leading-tight drop-shadow-md">
                      {language === 'ta' ? coupon.tamilTitle : coupon.title}
                    </h3>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    {/* 4. OFFER DESCRIPTION */}
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {language === 'ta' ? coupon.tamilSubtitle : coupon.subtitle}
                    </p>

                    {/* 5. APPLICABLE PRODUCTS BADGE */}
                    <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
                      <Package className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-bold text-amber-900 block mb-0.5">
                          {language === 'ta' ? 'பொருந்தும் தயாரிப்புகள்:' : 'Applicable Products:'}
                        </span>
                        <span className="text-stone-700 font-medium">
                          {language === 'ta' ? coupon.tamilApplicableProducts : coupon.applicableProducts}
                        </span>
                      </div>
                    </div>

                    {/* 7. START DATE & EXPIRY DATE */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {language === 'ta'
                            ? `தொடக்கம்: ${coupon.tamilStartDate}`
                            : `Starts: ${coupon.startDate}`}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-stone-600 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {language === 'ta'
                            ? `முடிவு: ${coupon.tamilExpiryDate}`
                            : `Valid till: ${coupon.expiryDate}`}
                        </span>
                      </span>
                    </div>

                    {/* 8. MINIMUM ORDER VALUE & MAX DISCOUNT */}
                    <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                      <span className="font-semibold text-stone-700">
                        {language === 'ta' ? 'குறைந்தபட்ச ஆர்டர்:' : 'Min Order:'}{' '}
                        <strong className="text-forest-950 font-black">
                          {coupon.minOrder === 0
                            ? (language === 'ta' ? 'எதுவுமில்லை' : 'No Minimum')
                            : `₹${coupon.minOrder}`}
                        </strong>
                      </span>

                      {coupon.maxDiscount ? (
                        <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {language === 'ta' ? `அதிகபட்சம் ₹${coupon.maxDiscount}` : `Max Save: ₹${coupon.maxDiscount}`}
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 font-medium">
                          {language === 'ta' ? 'வரம்பற்ற சேமிப்பு' : 'No Max Limit'}
                        </span>
                      )}
                    </div>

                    {/* 6. COUPON CODE (IF APPLICABLE) & COPY BUTTON */}
                    {coupon.code && (
                      <div className="p-3 rounded-2xl bg-[#FCFAF7] border border-dashed border-stone-300 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Scissors className="w-4 h-4 text-forest-950 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">
                              {language === 'ta' ? 'கூப்பன் குறியீடு' : 'COUPON CODE'}
                            </span>
                            <span className="font-mono font-black text-sm text-forest-950 tracking-wider truncate block">
                              {coupon.code}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(coupon.code)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white hover:bg-stone-100 text-forest-950 border border-stone-300'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>{language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>{language === 'ta' ? 'நகலெடு' : 'Copy Code'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* 9. TERMS & CONDITIONS COLLAPSIBLE ACCORDION */}
                    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => toggleTerms(coupon.code)}
                        className="w-full px-3.5 py-2 text-left text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center justify-between cursor-pointer bg-stone-50/70"
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-700" />
                          <span>{language === 'ta' ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Conditions'}</span>
                        </span>
                        {isTermsExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-500" />
                        )}
                      </button>

                      {isTermsExpanded && (
                        <div className="p-3 pt-2 text-[11px] text-stone-600 space-y-1.5 border-t border-stone-200 bg-[#FAF8F5]">
                          {(language === 'ta' ? coupon.tamilTerms : coupon.terms).map((term, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">•</span>
                              <span className="leading-snug">{term}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 10. APPLY OFFER / SHOP NOW ACTION BUTTONS */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    {/* Apply Offer Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectOffer(coupon)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isOfferActive
                          ? 'bg-emerald-700 text-white shadow-inner'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isOfferActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{language === 'ta' ? 'சேர்க்கப்பட்டது ✓' : 'Applied ✓'}</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'ta' ? 'சலுகை சேர்' : 'Apply Offer'}</span>
                        </>
                      )}
                    </button>

                    {/* Shop Now Button */}
                    <button
                      type="button"
                      onClick={() => handleApplyAndShop(coupon)}
                      className="py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>{language === 'ta' ? 'வாங்க செல்ல' : 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
