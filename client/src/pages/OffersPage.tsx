import React, { useState, useEffect } from 'react';
import {
  Tag,
  Percent,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  Coins,
  CheckCircle2,
  Info,
  Flame,
  Award,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Scissors,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCMS } from '../context/CMSContext';

export interface CouponItem {
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // e.g. 10 for 10%, 100 for ₹100
  title: string;
  tamilTitle: string;
  subtitle: string;
  tamilSubtitle: string;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  tamilExpiryDate: string;
  badge: string;
  tamilBadge: string;
  badgeColor: string;
  category: 'first' | 'cart' | 'bulk' | 'shipping' | 'festive';
}

export const AVAILABLE_COUPONS: CouponItem[] = [
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    title: '10% OFF on First Order',
    tamilTitle: 'முதல் ஆர்டருக்கு 10% தள்ளுபடி',
    subtitle: 'Welcome offer for new customers on pure cold-pressed oils',
    tamilSubtitle: 'புதிய வாடிக்கையாளர்களுக்கு மரச்செக்கு எண்ணெய்கள் மீது சிறப்பு வரவேற்பு தள்ளுபடி',
    minOrder: 499,
    maxDiscount: 150,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'NEW CUSTOMER',
    tamilBadge: 'புதிய வாடிக்கையாளர்',
    badgeColor: 'bg-emerald-600',
    category: 'first',
  },
  {
    code: 'SAVE15',
    discountType: 'percentage',
    discountValue: 15,
    title: '15% OFF on Orders Above ₹1000',
    tamilTitle: '₹1000 மேல் ஆர்டருக்கு 15% தள்ளுபடி',
    subtitle: 'Stock up your family pantry with authentic wood-pressed oils',
    tamilSubtitle: 'குடும்ப சமையல் பயன்பாட்டிற்கு மொத்தமாக வாங்கும்போது சிறப்புச் சேமிப்பு',
    minOrder: 1000,
    maxDiscount: 300,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'POPULAR DEAL',
    tamilBadge: 'அதிகம் விரும்பப்படும் சலுகை',
    badgeColor: 'bg-amber-600',
    category: 'cart',
  },
  {
    code: 'BULK20',
    discountType: 'percentage',
    discountValue: 20,
    title: '20% OFF on Bulk Orders',
    tamilTitle: 'மொத்த ஆர்டருக்கு 20% பெருந்தள்ளுபடி',
    subtitle: 'Flat 20% off on 5 Litre cans, 15 Litre tins, and combo packages',
    tamilSubtitle: '5 லிட்டர் கேன், 15 லிட்டர் டின் மற்றும் காம்போ பேக்கேஜ்களுக்கு பிளாட் 20% தள்ளுபடி',
    minOrder: 2500,
    maxDiscount: 750,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'MEGA SAVINGS',
    tamilBadge: 'மெகா சேமிப்பு',
    badgeColor: 'bg-forest-900',
    category: 'bulk',
  },
  {
    code: 'FREEDEL',
    discountType: 'free_shipping',
    discountValue: 50,
    title: '100% Free Express Delivery',
    tamilTitle: '100% இலவச விரைவு டெலிவரி',
    subtitle: 'Zero shipping charge anywhere across Tamil Nadu directly from our mill',
    tamilSubtitle: 'எங்கள் சேலம் ஆலையிலிருந்து உங்கள் வீட்டிற்கு கட்டணமில்லா நேரடி டெலிவரி',
    minOrder: 0,
    expiryDate: 'Permanent Mill Offer',
    tamilExpiryDate: 'ஆலையின் நிரந்தர சலுகை',
    badge: 'FREE DELIVERY',
    tamilBadge: 'இலவச டெலிவரி',
    badgeColor: 'bg-[#1e7e34]',
    category: 'shipping',
  },
  {
    code: 'VAAGAI100',
    discountType: 'fixed',
    discountValue: 100,
    title: 'Flat ₹100 OFF Heritage Special',
    tamilTitle: 'பாரம்பரிய சலுகை - பிளாட் ₹100 தள்ளுபடி',
    subtitle: 'Direct mill discount celebrating traditional Vaagai wood ghani pressing',
    tamilSubtitle: 'பாரம்பரிய வாகை மரச்செக்கு தயாரிப்புகளை கொண்டாடும் நேரடி ஆலை தள்ளுபடி',
    minOrder: 1299,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'MILL HERITAGE',
    tamilBadge: 'ஆலை பாரம்பரியம்',
    badgeColor: 'bg-amber-800',
    category: 'cart',
  },
  {
    code: 'FESTIVECOMBO',
    discountType: 'percentage',
    discountValue: 18,
    title: '18% OFF on Festival Combos',
    tamilTitle: 'பண்டிகை காம்போக்களுக்கு 18% தள்ளுபடி',
    subtitle: 'Special combo savings on Sesame, Groundnut and Coconut pure oils',
    tamilSubtitle: 'நல்லெண்ணெய், கடலை எண்ணெய் மற்றும் தேங்காய் எண்ணெய் காம்போக்களுக்கு சிறப்பு சேமிப்பு',
    minOrder: 1800,
    maxDiscount: 500,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'FESTIVE SPECIAL',
    tamilBadge: 'பண்டிகை சிறப்பு',
    badgeColor: 'bg-rose-700',
    category: 'festive',
  },
];

interface OffersPageProps {
  onNavigate: (path: string) => void;
  onOpenCart?: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate, onOpenCart }) => {
  const { language } = useLanguage();
  const { siteContent } = useCMS();
  const offersCms = siteContent?.offers?.status === 'PUBLISHED' ? siteContent.offers : null;

  const bannerHeadline =
    language === 'ta'
      ? offersCms?.tamilBannerTitle || 'பாரம்பரிய மரச்செக்கு சிறப்பு சலுகைகள் & கூப்பன்கள்'
      : offersCms?.bannerTitle || 'Mega Mara Chekku Offers & Discount Coupons';
  const bannerDesc =
    language === 'ta'
      ? offersCms?.tamilDescription ||
        'சேலம் மரச்செக்கு ஆலையிலிருந்து நேரடியாக உங்கள் வீட்டிற்கு வரும் 100% தூய இயற்கை எண்ணெய்களுக்கு 20% வரை நேரடி தள்ளுபடி மற்றும் இலவச டெலிவரி கூப்பன்களைப் பயன்படுத்துங்கள்.'
      : offersCms?.description ||
        'Enjoy authentic native oils crushed slowly at 14 RPM in traditional Vaagai wood ghani. Unlock up to 20% instant savings, free express delivery, and festive discounts.';

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('ssoil_applied_coupon');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.code || null;
      }
    } catch {}
    return null;
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [cartAmountInput, setCartAmountInput] = useState<number>(1500);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Festive Countdown Timer (Static reference to end of 2026 or festive batch)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 4,
    hours: 18,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2400);
  };

  const handleApplyCoupon = (coupon: CouponItem) => {
    try {
      localStorage.setItem(
        'ssoil_applied_coupon',
        JSON.stringify({
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrder: coupon.minOrder,
          maxDiscount: coupon.maxDiscount,
          title: coupon.title,
        })
      );
      setAppliedCoupon(coupon.code);
      window.dispatchEvent(new Event('ssoil_coupon_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCoupons =
    filterCategory === 'all'
      ? AVAILABLE_COUPONS
      : AVAILABLE_COUPONS.filter((c) => c.category === filterCategory);

  // Calculator logic: find best savings
  const calculateDiscountForCoupon = (coupon: CouponItem, amount: number) => {
    if (amount < coupon.minOrder) return 0;
    if (coupon.discountType === 'percentage') {
      const calculated = (amount * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    }
    if (coupon.discountType === 'fixed') {
      return coupon.discountValue;
    }
    if (coupon.discountType === 'free_shipping') {
      return 50; // free standard express delivery savings
    }
    return 0;
  };

  const bestSavings = AVAILABLE_COUPONS.reduce((best, c) => {
    const savings = calculateDiscountForCoupon(c, cartAmountInput);
    return savings > best.savings ? { coupon: c, savings } : best;
  }, { coupon: AVAILABLE_COUPONS[0], savings: calculateDiscountForCoupon(AVAILABLE_COUPONS[0], cartAmountInput) });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24">
      {/* ======================================================== */}
      {/* 1. HERO FESTIVAL OFFERS BANNER                            */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#122E22] via-[#183B2C] to-[#0A1A13] text-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#2C5340]">
        {/* Subtle Background Golden Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>
                  {language === 'ta'
                    ? 'தீபாவளி & திருவிழா சிறப்பு ஆலை தள்ளுபடிகள்'
                    : 'LIVE MILL FESTIVAL & SEASONAL OFFERS'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                {bannerHeadline}
              </h1>

              <p className="text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                {bannerDesc}
              </p>

              {/* 3 Quick Pill Highlights */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-stone-200">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {language === 'ta' ? 'அக்மார்க் கிரேடு I தரம்' : 'Agmark Grade I Certified'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  {language === 'ta' ? 'தமிழ்நாடு முழுவதும் விரைவு டெலிவரி' : 'Express Doorstep Delivery'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  <Gift className="w-3.5 h-3.5 text-gold-300" />
                  {language === 'ta' ? 'கூடுதல் ஆலை பரிசுகள்' : 'Free Mill Sample Pack'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                <a
                  href="#coupon-cards"
                  className="px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#bfa035] text-forest-950 font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  <span>{language === 'ta' ? 'கூப்பன்களைப் பார்க்க' : 'View All Coupons'}</span>
                </a>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ta' ? 'எண்ணெய் வாங்க' : 'Shop Pure Oils'}</span>
                </button>
              </div>
            </div>

            {/* Right Countdown & Featured Voucher Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#1C4232] to-[#143226] p-6 sm:p-7 rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl space-y-5 text-center relative overflow-hidden group">
                {/* Decorative Gold Ribbon */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300 block">
                    {language === 'ta' ? 'வரையறுக்கப்பட்ட ஆலை ஆஃபர்' : 'LIMITED FESTIVE BATCH OFFER'}
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                    {language === 'ta' ? 'மெகா 20% தள்ளுபடி வவுச்சர்' : 'Mega 20% Super Saver'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {language === 'ta'
                      ? 'அனைத்து மரச்செக்கு நல்லெண்ணெய், கடலை எண்ணெய் மற்றும் தேங்காய் எண்ணெய்களுக்கு பொருந்தும்'
                      : 'Applicable across Sesame, Groundnut, Coconut & Everyday Cooking Oils'}
                  </p>
                </div>

                {/* Live Countdown Timer */}
                <div className="bg-[#0B1E16] p-3.5 rounded-2xl border border-white/10 flex items-center justify-around text-center">
                  <div>
                    <span className="block font-mono font-black text-xl sm:text-2xl text-amber-400">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                      {language === 'ta' ? 'நாட்கள்' : 'Days'}
                    </span>
                  </div>
                  <span className="text-stone-500 font-bold">:</span>
                  <div>
                    <span className="block font-mono font-black text-xl sm:text-2xl text-amber-400">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                      {language === 'ta' ? 'மணி' : 'Hours'}
                    </span>
                  </div>
                  <span className="text-stone-500 font-bold">:</span>
                  <div>
                    <span className="block font-mono font-black text-xl sm:text-2xl text-amber-400">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                      {language === 'ta' ? 'நிமிடம்' : 'Mins'}
                    </span>
                  </div>
                  <span className="text-stone-500 font-bold">:</span>
                  <div>
                    <span className="block font-mono font-black text-xl sm:text-2xl text-amber-400">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                      {language === 'ta' ? 'வினாடி' : 'Secs'}
                    </span>
                  </div>
                </div>

                {/* Highlight Featured Coupon Box */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-dashed border-amber-400/50 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] text-amber-300 font-semibold uppercase block">
                      {language === 'ta' ? 'கூப்பன் குறியீடு:' : 'Use Coupon Code:'}
                    </span>
                    <span className="font-mono text-lg sm:text-xl font-black text-white tracking-wider">
                      BULK20
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode('BULK20')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-forest-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    {copiedCode === 'BULK20' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-forest-950" />
                        <span>{language === 'ta' ? 'நகலானது!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'நகல் செய்' : 'Copy Code'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-stone-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {language === 'ta'
                      ? '₹2500 மேல் ஆர்டர் செய்தால் ₹750 வரை சேமிக்கலாம்'
                      : 'Min Order: ₹2500 • Max Savings: ₹750'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATEGORY FILTER TABS & SEARCH PILLS                   */}
      {/* ======================================================== */}
      <section id="coupon-cards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-forest-950 tracking-tight">
              {language === 'ta' ? 'கிடைக்கும் அனைத்து தள்ளுபடி கூப்பன்கள்' : 'Active Discount Coupons & Vouchers'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {language === 'ta'
                ? 'உங்கள் ஆர்டருக்கு ஏற்ற கூப்பனைத் தேர்ந்தெடுத்து நகலெடுத்து கார்ட்டில் பயன்படுத்தவும்'
                : 'Select the best coupon for your cart and apply at checkout for instant savings'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: language === 'ta' ? 'அனைத்தும் (6)' : 'All Offers (6)' },
              { id: 'first', label: language === 'ta' ? 'முதல் ஆர்டர்' : 'First Order' },
              { id: 'cart', label: language === 'ta' ? 'கார்ட் தள்ளுபடி' : 'Cart Value' },
              { id: 'bulk', label: language === 'ta' ? 'மொத்த ஆர்டர்' : 'Bulk Orders' },
              { id: 'shipping', label: language === 'ta' ? 'இலவச டெலிவரி' : 'Free Delivery' },
            ].map((tab) => {
              const isActive = filterCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-forest-950 text-gold-300 shadow-sm'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. COUPON CARDS GRID (Ticket Design with Cutout Notches) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            const isApplied = appliedCoupon === coupon.code;

            return (
              <div
                key={coupon.code}
                className="relative bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Badge & Discount Banner */}
                <div className="p-5 sm:p-6 pb-4 border-b border-dashed border-stone-200 relative">
                  
                  {/* Left & Right Ticket Cutout Notches */}
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#FAF8F5] rounded-full border-r border-stone-200/90 shadow-inner z-10" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#FAF8F5] rounded-full border-l border-stone-200/90 shadow-inner z-10" />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${coupon.badgeColor} shadow-2xs`}
                    >
                      {language === 'ta' ? coupon.tamilBadge : coupon.badge}
                    </span>

                    <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{language === 'ta' ? coupon.tamilExpiryDate : coupon.expiryDate}</span>
                    </span>
                  </div>

                  {/* Big Discount Value Display */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-serif font-black text-forest-950">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : coupon.discountType === 'fixed'
                        ? `₹${coupon.discountValue} OFF`
                        : 'FREE DELIVERY'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-forest-900 mt-1">
                    {language === 'ta' ? coupon.tamilTitle : coupon.title}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {language === 'ta' ? coupon.tamilSubtitle : coupon.subtitle}
                  </p>
                </div>

                {/* Bottom Ticket Body: Code, Min Order & Apply Actions */}
                <div className="p-5 sm:p-6 pt-5 bg-[#FCFAF7] space-y-4">
                  
                  {/* Min Order & Maximum Savings Details */}
                  <div className="flex items-center justify-between text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/70">
                    <span className="font-semibold text-stone-700">
                      {language === 'ta' ? 'குறைந்தபட்ச ஆர்டர்:' : 'Min Order:'}{' '}
                      <strong className="text-forest-950">
                        {coupon.minOrder === 0 ? (language === 'ta' ? 'எதுவுமில்லை' : 'No Minimum') : `₹${coupon.minOrder}`}
                      </strong>
                    </span>

                    {coupon.maxDiscount && (
                      <span className="text-[11px] text-amber-800 font-bold">
                        {language === 'ta' ? `அதிகபட்சம் ₹${coupon.maxDiscount}` : `Max: ₹${coupon.maxDiscount}`}
                      </span>
                    )}
                  </div>

                  {/* Coupon Code Ticket Box */}
                  <div className="p-3 rounded-2xl bg-white border-2 border-dashed border-amber-500/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-700 -rotate-45" />
                      <div>
                        <span className="text-[9px] uppercase font-bold text-stone-400 block -mb-0.5">
                          {language === 'ta' ? 'கூப்பன் குறியீடு' : 'COUPON CODE'}
                        </span>
                        <span className="font-mono text-base font-black text-forest-950 tracking-wider">
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
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                      title="Copy Coupon Code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{language === 'ta' ? 'நகலானது!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-600" />
                          <span>{language === 'ta' ? 'நகல்' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons: Apply Coupon & Shop Now */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(coupon)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isApplied
                          ? 'bg-emerald-700 text-white shadow-emerald-200'
                          : 'bg-forest-950 hover:bg-forest-900 text-gold-300'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{language === 'ta' ? 'கூப்பன் சேர்க்கப்பட்டது ✓' : 'Coupon Applied ✓'}</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-3.5 h-3.5 text-gold-300" />
                          <span>{language === 'ta' ? 'கூப்பனைப் பயன்படுத்து' : 'Apply Coupon'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleApplyCoupon(coupon);
                        onNavigate('/shop');
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-forest-900 text-stone-700 hover:text-forest-950 text-xs font-bold bg-white transition-all cursor-pointer"
                      title="Apply & Go to Shop"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE SAVINGS CALCULATOR / SIMULATOR            */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="bg-gradient-to-br from-white to-[#F7F4EE] rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-10 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ta' ? 'சேமிப்பு கணக்கீட்டுக் கருவி' : 'Instant Savings Calculator'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-forest-950">
                {language === 'ta'
                  ? 'உங்கள் கார்ட்டிற்கு அதிகபட்ச சேமிப்பை அறிந்து கொள்ளுங்கள்'
                  : 'Find the Best Coupon for Your Order Value'}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'உங்கள் திட்டமிடப்பட்ட கார்ட் தொகையை உள்ளிட்டு, எந்த கூப்பன் உங்களுக்கு அதிகபட்ச பணத்தை சேமிக்கிறது என்பதை உடனே தெரிந்து கொள்ளுங்கள்.'
                  : 'Enter your planned order amount below and see which coupon code delivers the maximum savings on your authentic cold-pressed oils.'}
              </p>

              {/* Order Amount Input & Quick Buttons */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ta' ? 'ஆர்டர் தொகை (ரூபாயில்):' : 'Estimated Cart Amount (in ₹):'}
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative max-w-xs flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-stone-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={cartAmountInput}
                      onChange={(e) => setCartAmountInput(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 text-base font-bold text-forest-950 focus:outline-none focus:border-forest-900 bg-white"
                    />
                  </div>

                  {/* Quick Select Presets */}
                  <div className="flex items-center gap-1.5">
                    {[500, 1000, 1500, 2500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCartAmountInput(amt)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cartAmountInput === amt
                            ? 'bg-forest-950 text-gold-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#122E22] text-white p-6 sm:p-8 rounded-3xl border border-[#2C5340] shadow-xl text-center space-y-4 relative overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  {language === 'ta' ? 'பரிந்துரைக்கப்படும் சிறந்த கூப்பன்' : 'RECOMMENDED BEST SAVINGS'}
                </span>

                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-serif font-black text-white">
                    ₹{Math.round(bestSavings.savings)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold block">
                    {language === 'ta' ? 'நேரடி சேமிப்பு!' : 'Instant Cash Savings!'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-dashed border-amber-400/40 space-y-1">
                  <span className="text-[10px] text-stone-300 block">
                    {language === 'ta' ? 'சிறந்த கூப்பன் குறியீடு:' : 'Best Coupon Code:'}
                  </span>
                  <span className="font-mono text-xl font-black text-amber-300 tracking-widest block">
                    {bestSavings.coupon.code}
                  </span>
                  <p className="text-[11px] text-stone-200 font-medium">
                    {language === 'ta' ? bestSavings.coupon.tamilTitle : bestSavings.coupon.title}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      handleApplyCoupon(bestSavings.coupon);
                      if (onOpenCart) onOpenCart();
                      else onNavigate('/cart');
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#bfa035] text-forest-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ta' ? 'கூப்பனைப் பயன்படுத்து' : 'Apply & View Cart'}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 cursor-pointer"
                    title="Shop Oils"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW TO REDEEM (3 SIMPLE STEPS)                        */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {language === 'ta' ? 'எளிய வழிகாட்டி' : 'SIMPLE 3-STEP PROCESS'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-forest-950">
            {language === 'ta' ? 'கூப்பனை எவ்வாறு பயன்படுத்துவது?' : 'How to Redeem Your Discount Coupon'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
            {language === 'ta'
              ? 'எங்கள் பாரம்பரிய மரச்செக்கு எண்ணெய்களை வாங்கும்போது கூப்பனை சுலபமாக சேர்க்கலாம்.'
              : 'Follow these quick steps to get direct discounts on your wood-pressed oils.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto font-serif font-black text-lg">
              1
            </div>
            <h4 className="font-serif font-bold text-base text-forest-950">
              {language === 'ta' ? 'கூப்பனைத் தேர்ந்தெடுக்கவும்' : 'Copy Coupon Code'}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் ஆர்டர் தொகைக்கு ஏற்ற கூப்பனை இந்த பக்கத்தில் இருந்து "Copy Code" கிளிக் செய்து நகலெடுக்கவும்.'
                : 'Browse our list of verified offers above and click "Copy Code" or "Apply Coupon" directly.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto font-serif font-black text-lg">
              2
            </div>
            <h4 className="font-serif font-bold text-base text-forest-950">
              {language === 'ta' ? 'எண்ணெய்களை கார்ட்டில் சேர்க்கவும்' : 'Add Oils to Cart'}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'எங்கள் கடைப் பக்கத்திற்குச் சென்று நல்லெண்ணெய், கடலை எண்ணெய் அல்லது தேங்காய் எண்ணெய்களைத் தேர்வு செய்யவும்.'
                : 'Select your preferred pack sizes (500ml, 1L, 2L, 5L, or 15L tins) and add them to your shopping cart.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-950 border border-forest-200 flex items-center justify-center mx-auto font-serif font-black text-lg">
              3
            </div>
            <h4 className="font-serif font-bold text-base text-forest-950">
              {language === 'ta' ? 'செக்அவுட்டில் சேமிக்கவும்' : 'Save at Checkout'}
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'கார்ட் அல்லது செக்அவுட்டில் கூப்பன் குறியீட்டைப் பயன்படுத்தி உடனடி விலைக் குறைப்பைப் பெறுங்கள்.'
                : 'Apply your coupon code in the cart drawer or order summary to instantly watch the total amount drop.'}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TERMS & CONDITIONS SECTION                            */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 sm:p-10 space-y-6">
          
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-5 h-5 text-amber-700" />
              <h3 className="font-serif font-black text-xl sm:text-2xl text-forest-950">
                {language === 'ta' ? 'கூப்பன் விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Conditions of Coupon Codes'}
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'அனைத்து SS Oil தள்ளுபடி கூப்பன்களுக்கான பொதுவான விதிமுறைகள்'
                : 'Important terms governing promotional discount vouchers and coupon redemption'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-stone-200/80 space-y-1.5">
              <span className="font-bold text-forest-950 block">
                {language === 'ta' ? '1. ஒரு ஆர்டருக்கு ஒரு கூப்பன்' : '1. Single Coupon per Order'}
              </span>
              <p>
                {language === 'ta'
                  ? 'ஒவ்வொரு பரிவர்த்தனையிலும் ஒரு தள்ளுபடி கூப்பனை மட்டுமே பயன்படுத்த முடியும். பல கூப்பன்களை ஒன்றாக இணைக்க முடியாது.'
                  : 'Only one promotional discount code can be applied per checkout. Coupons cannot be clubbed together.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-stone-200/80 space-y-1.5">
              <span className="font-bold text-forest-950 block">
                {language === 'ta' ? '2. குறைந்தபட்ச ஆர்டர் தொகை' : '2. Minimum Order Calculation'}
              </span>
              <p>
                {language === 'ta'
                  ? 'குறைந்தபட்ச ஆர்டர் வரம்பு என்பது வரிகள் மற்றும் டெலிவரி கட்டணங்களுக்கு முந்தைய தயாரிப்புகளின் மொத்த மதிப்பை மட்டுமே குறிக்கும்.'
                  : 'Minimum purchase value excludes shipping fees, taxes, or packaging costs. It is calculated solely on oil products subtotal.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-stone-200/80 space-y-1.5">
              <span className="font-bold text-forest-950 block">
                {language === 'ta' ? '3. பணமாக மாற்ற இயலாது' : '3. Non-Transferable & Non-Refundable'}
              </span>
              <p>
                {language === 'ta'
                  ? 'தள்ளுபடி கூப்பன்கள் ரொக்கமாக மாற்றப்பட மாட்டாது அல்லது பணமாக திரும்பப் பெறப்பட மாட்டாது.'
                  : 'Discount vouchers hold zero cash exchange value and cannot be redeemed for physical currency or bank transfers.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-stone-200/80 space-y-1.5">
              <span className="font-bold text-forest-950 block">
                {language === 'ta' ? '4. ஆலை நேரடி இருப்பு நிபந்தனை' : '4. Mill Batch Availability'}
              </span>
              <p>
                {language === 'ta'
                  ? 'அனைத்து எண்ணெய் தயாரிப்புகளும் வாகை மரச்செக்கில் புதிய ஆலை பேட்சாக ஆட்டப்படுவதால், ஆர்டர்கள் இருப்பு அடிப்படையில் பூர்த்தி செய்யப்படும்.'
                  : 'Promotions apply strictly to genuine mill-crushed stocks. SS Oil reserves rights to modify terms during high festive demand.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <span>
              {language === 'ta'
                ? 'கூப்பன் தொடர்பான ஏதேனும் சந்தேகங்களுக்கு எங்கள் ஆலை உதவி மையத்தை அழைக்கவும்:'
                : 'Need assistance with applying a coupon code? Contact our mill customer desk:'}
            </span>
            <span className="font-bold text-forest-950 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              📞 +91 94432 10855 • care@ssoil.com
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};

