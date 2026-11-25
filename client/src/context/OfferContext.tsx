import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ActiveOffer {
  code: string;
  title: string;
  tamilTitle: string;
  description?: string;
  tamilDescription?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate?: string;
  tamilExpiryDate?: string;
  badge?: string;
  tamilBadge?: string;
  badgeColor?: string;
}

export const DEFAULT_OFFERS: ActiveOffer[] = [
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    title: '10% OFF on First Order',
    tamilTitle: 'முதல் ஆர்டருக்கு 10% தள்ளுபடி',
    description: 'Welcome offer for new customers on pure cold-pressed oils',
    tamilDescription: 'புதிய வாடிக்கையாளர்களுக்கு மரச்செக்கு எண்ணெய்கள் மீது சிறப்பு வரவேற்பு தள்ளுபடி',
    minOrderValue: 0,
    maxDiscount: 150,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'NEW CUSTOMER',
    tamilBadge: 'புதிய வாடிக்கையாளர்',
    badgeColor: 'bg-emerald-600',
  },
  {
    code: 'SAVE15',
    discountType: 'percentage',
    discountValue: 15,
    title: '15% OFF Special Deal',
    tamilTitle: '15% சிறப்பு தள்ளுபடி',
    description: 'Authentic wood-pressed oils with special 15% discount',
    tamilDescription: 'சுத்தமான மரச்செக்கு எண்ணெய்கள் மீது 15% சிறப்பு தள்ளுபடி',
    minOrderValue: 0,
    maxDiscount: 300,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'POPULAR DEAL',
    tamilBadge: 'அதிகம் விரும்பப்படும் சலுகை',
    badgeColor: 'bg-amber-600',
  },
  {
    code: 'BULK20',
    discountType: 'percentage',
    discountValue: 20,
    title: '20% OFF on Bulk Orders',
    tamilTitle: 'மொத்த ஆர்டருக்கு 20% பெருந்தள்ளுபடி',
    description: 'Flat 20% off on 5 Litre cans, 15 Litre tins, and combo packages',
    tamilDescription: '5 லிட்டர் கேன், 15 லிட்டர் டின் மற்றும் காம்போ பேக்கேஜ்களுக்கு பிளாட் 20% தள்ளுபடி',
    minOrderValue: 2500,
    maxDiscount: 750,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'MEGA SAVINGS',
    tamilBadge: 'மெகா சேமிப்பு',
    badgeColor: 'bg-forest-900',
  },
  {
    code: 'FREEDEL',
    discountType: 'free_shipping',
    discountValue: 50,
    title: '100% Free Express Delivery',
    tamilTitle: '100% இலவச விரைவு டெலிவரி',
    description: 'Zero shipping charge anywhere across Tamil Nadu directly from our mill',
    tamilDescription: 'எங்கள் சேலம் ஆலையிலிருந்து உங்கள் வீட்டிற்கு கட்டணமில்லா நேரடி டெலிவரி',
    minOrderValue: 0,
    expiryDate: 'Permanent Mill Offer',
    tamilExpiryDate: 'ஆலையின் நிரந்தர சலுகை',
    badge: 'FREE DELIVERY',
    tamilBadge: 'இலவச டெலிவரி',
    badgeColor: 'bg-[#1e7e34]',
  },
  {
    code: 'VAAGAI100',
    discountType: 'fixed',
    discountValue: 100,
    title: 'Flat ₹100 OFF Heritage Special',
    tamilTitle: 'பாரம்பரிய சலுகை - பிளாட் ₹100 தள்ளுபடி',
    description: 'Direct mill discount celebrating traditional Vaagai wood ghani pressing',
    tamilDescription: 'பாரம்பரிய வாகை மரச்செக்கு தயாரிப்புகளை கொண்டாடும் நேரடி ஆலை தள்ளுபடி',
    minOrderValue: 1299,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'MILL HERITAGE',
    tamilBadge: 'ஆலை பாரம்பரியம்',
    badgeColor: 'bg-amber-800',
  },
  {
    code: 'FESTIVECOMBO',
    discountType: 'percentage',
    discountValue: 18,
    title: '18% OFF on Festival Combos',
    tamilTitle: 'பண்டிகை காம்போக்களுக்கு 18% தள்ளுபடி',
    description: 'Special combo savings on Sesame, Groundnut and Coconut pure oils',
    tamilDescription: 'நல்லெண்ணெய், கடலை எண்ணெய் மற்றும் தேங்காய் எண்ணெய் காம்போக்களுக்கு சிறப்பு சேமிப்பு',
    minOrderValue: 1800,
    maxDiscount: 500,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'FESTIVE SPECIAL',
    tamilBadge: 'பண்டிகை சிறப்பு',
    badgeColor: 'bg-rose-700',
  },
  {
    code: 'B2G1FREE',
    discountType: 'percentage',
    discountValue: 33,
    title: 'Buy 2 Get 1 Free Mara Chekku Trio',
    tamilTitle: 'பை 2 கெட் 1 இலவச மரச்செக்கு காம்போ',
    description: 'Buy 2 bottles of 1L Sesame Oil and get 1L Coconut Oil Free (33% equivalent combo discount)',
    tamilDescription: '2 நல்லெண்ணெய் வாங்கினால் 1 தேங்காய் எண்ணெய் முற்றிலும் இலவசம் (33% காம்போ தள்ளுபடி)',
    minOrderValue: 1100,
    maxDiscount: 360,
    expiryDate: 'Valid till 31 Dec 2026',
    tamilExpiryDate: '31 டிசம்பர் 2026 வரை செல்லுபடியாகும்',
    badge: 'BUY 2 GET 1 FREE',
    tamilBadge: 'பை 2 கெட் 1 இலவசம்',
    badgeColor: 'bg-amber-700',
  },
];

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

interface CartDiscountResult {
  discountAmount: number;
  isEligible: boolean;
  minOrderShortage: number;
  isFreeShipping: boolean;
  shippingFee: number;
  finalTotal: number;
  savingsSummary: string;
  savingsSummaryTa: string;
}

interface ProductOfferResult {
  hasOffer: boolean;
  offerPrice: number;
  savings: number;
  discountPercentText: string;
  offerCode: string;
}

interface OfferContextType {
  activeOffer: ActiveOffer | null;
  availableOffers: ActiveOffer[];
  applyOffer: (offerOrCode: ActiveOffer | string) => { success: boolean; message: string; messageTa: string };
  removeOffer: () => void;
  calculateCartDiscount: (subtotal: number) => CartDiscountResult;
  calculateProductOffer: (basePrice: number) => ProductOfferResult;
  refreshOffers: () => Promise<void>;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableOffers, setAvailableOffers] = useState<ActiveOffer[]>(DEFAULT_OFFERS);

  // Active applied offer (persisted across pages in localStorage)
  const [activeOffer, setActiveOffer] = useState<ActiveOffer | null>(() => {
    try {
      const saved = localStorage.getItem('ssoil_active_offer');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Fetch live active offers from database
  const refreshOffers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/offers?activeOnly=true`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const dynamicList: ActiveOffer[] = json.data.map((item: any) => {
          const discountType =
            item.discountType === 'PERCENTAGE'
              ? 'percentage'
              : item.discountType === 'FIXED'
              ? 'fixed'
              : 'free_shipping';

          const formattedDate = item.endDate
            ? new Date(item.endDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Valid till 31 Dec 2026';

          const existing = DEFAULT_OFFERS.find(
            (c) => c.code.toUpperCase() === item.code.toUpperCase()
          );

          return {
            code: item.code.toUpperCase(),
            discountType,
            discountValue: item.discountValue,
            title: item.title,
            tamilTitle: existing?.tamilTitle || item.title,
            description: item.description || existing?.description || 'Wood-pressed oil offer',
            tamilDescription: existing?.tamilDescription || item.description || 'மரச்செக்கு எண்ணெய் சிறப்புச் சலுகை',
            minOrderValue: item.minOrderValue || 0,
            maxDiscount: item.maxDiscount,
            expiryDate: `Valid till ${formattedDate}`,
            tamilExpiryDate: `${formattedDate} வரை செல்லுபடியாகும்`,
            badge:
              item.discountType === 'PERCENTAGE'
                ? `${item.discountValue}% SAVINGS`
                : item.discountType === 'FIXED'
                ? `₹${item.discountValue} FLAT OFF`
                : 'FREE EXPRESS',
            tamilBadge: existing?.tamilBadge || 'சிறப்புச் சலுகை',
            badgeColor: existing?.badgeColor || 'bg-[#1e7e34]',
          };
        });

        // Merge any locally created coupons from admin
        try {
          const savedLocal = localStorage.getItem('ssoil_custom_offers');
          if (savedLocal) {
            const localList = JSON.parse(savedLocal);
            if (Array.isArray(localList)) {
              for (const item of localList) {
                if (!item || !item.code || !item.isActive) continue;
                const formattedDate = item.endDate
                  ? new Date(item.endDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Valid till 31 Dec 2026';

                const existingIdx = dynamicList.findIndex((o) => o.code === item.code.toUpperCase());
                const formattedCustom: ActiveOffer = {
                  code: item.code.toUpperCase(),
                  discountType:
                    item.discountType === 'PERCENTAGE'
                      ? 'percentage'
                      : item.discountType === 'FIXED'
                      ? 'fixed'
                      : 'free_shipping',
                  discountValue: Number(item.discountValue) || 0,
                  title: item.title,
                  tamilTitle: item.title,
                  description: item.description || 'Special promotional coupon',
                  tamilDescription: item.description || 'சிறப்பு சலுகைக் கூப்பன்',
                  minOrderValue: Number(item.minOrderValue) || 0,
                  maxDiscount: item.maxDiscount ? Number(item.maxDiscount) : undefined,
                  expiryDate: `Valid till ${formattedDate}`,
                  tamilExpiryDate: `${formattedDate} வரை செல்லுபடியாகும்`,
                  badge:
                    item.discountType === 'PERCENTAGE'
                      ? `${item.discountValue}% SAVINGS`
                      : item.discountType === 'FIXED'
                      ? `₹${item.discountValue} FLAT OFF`
                      : 'FREE EXPRESS',
                  tamilBadge: 'சிறப்புச் சலுகை',
                  badgeColor: 'bg-[#1e7e34]',
                };

                if (existingIdx >= 0) {
                  dynamicList[existingIdx] = formattedCustom;
                } else {
                  dynamicList.unshift(formattedCustom);
                }
              }
            }
          }
        } catch (e) {}

        setAvailableOffers(dynamicList);

        // If current activeOffer matches a database offer, sync it
        if (activeOffer) {
          const updatedActive = dynamicList.find((o) => o.code === activeOffer.code);
          if (updatedActive) {
            setActiveOffer(updatedActive);
            localStorage.setItem('ssoil_active_offer', JSON.stringify(updatedActive));
          }
        }
      }
    } catch (e) {
      console.warn('Could not load remote offers, using local defaults:', e);
    }
  };

  useEffect(() => {
    refreshOffers();

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('ssoil_active_offer');
        if (saved) setActiveOffer(JSON.parse(saved));
        else setActiveOffer(null);
      } catch (e) {}
    };

    window.addEventListener('ssoil_offer_updated', handleStorageChange);
    window.addEventListener('ssoil_coupon_updated', refreshOffers);
    return () => {
      window.removeEventListener('ssoil_offer_updated', handleStorageChange);
      window.removeEventListener('ssoil_coupon_updated', refreshOffers);
    };
  }, []);

  const applyOffer = (offerOrCode: ActiveOffer | string) => {
    const code = typeof offerOrCode === 'string' ? offerOrCode.trim().toUpperCase() : offerOrCode.code.trim().toUpperCase();
    const found = availableOffers.find((o) => o.code.toUpperCase() === code);

    if (!found) {
      return {
        success: false,
        message: `Invalid coupon code. Please enter a valid code.`,
        messageTa: `தவறான கூப்பன் குறியீடு. சரியான குறியீட்டை உள்ளிடவும்.`,
      };
    }

    setActiveOffer(found);
    try {
      localStorage.setItem('ssoil_active_offer', JSON.stringify(found));
      window.dispatchEvent(new Event('ssoil_offer_updated'));
    } catch (e) {}

    const discountSummary =
      found.discountType === 'percentage'
        ? `${found.discountValue}% OFF`
        : found.discountType === 'fixed'
        ? `₹${found.discountValue} FLAT OFF`
        : 'Free Delivery';

    return {
      success: true,
      message: `Coupon applied successfully! You get ${discountSummary}.`,
      messageTa: `கூப்பன் தள்ளுபடி வெற்றிகரமாக சேர்க்கப்பட்டது! (${discountSummary}).`,
    };
  };

  const removeOffer = () => {
    setActiveOffer(null);
    try {
      localStorage.removeItem('ssoil_active_offer');
      window.dispatchEvent(new Event('ssoil_offer_updated'));
    } catch (e) {}
  };

  const calculateCartDiscount = (subtotal: number): CartDiscountResult => {
    if (subtotal <= 0) {
      return {
        discountAmount: 0,
        isEligible: true,
        minOrderShortage: 0,
        isFreeShipping: false,
        shippingFee: 0,
        finalTotal: 0,
        savingsSummary: '',
        savingsSummaryTa: '',
      };
    }

    if (!activeOffer) {
      const shippingFee = subtotal >= 499 ? 0 : 50;
      return {
        discountAmount: 0,
        isEligible: true,
        minOrderShortage: 0,
        isFreeShipping: subtotal >= 499,
        shippingFee,
        finalTotal: subtotal + shippingFee,
        savingsSummary: '',
        savingsSummaryTa: '',
      };
    }

    // Check min order value requirement
    // Regular promotional coupon codes (like SAVE15, FIRST10, KANNAN, etc.) apply even to single bottle orders
    // Only enforce minOrderValue if explicitly a bulk offer (like BULK20)
    const effectiveMinOrder = activeOffer.code === 'BULK20'
      ? Math.max(activeOffer.minOrderValue || 2000, 2000)
      : 0;

    const isEligible = subtotal >= effectiveMinOrder;
    const minOrderShortage = isEligible ? 0 : effectiveMinOrder - subtotal;

    let discountAmount = 0;
    // When any coupon/offer is applied, OR when subtotal >= 499, express delivery is 100% FREE!
    const isFreeShipping = Boolean(activeOffer) || activeOffer.code === 'FREEDEL' || activeOffer.discountType === 'free_shipping' || subtotal >= 499;
    const shippingFee = isFreeShipping ? 0 : 50;

    if (isEligible) {
      if (activeOffer.discountType === 'percentage') {
        const calculated = Math.round((subtotal * activeOffer.discountValue) / 100);
        discountAmount = activeOffer.maxDiscount ? Math.min(calculated, activeOffer.maxDiscount) : calculated;
      } else if (activeOffer.discountType === 'fixed') {
        discountAmount = Math.min(subtotal, activeOffer.discountValue);
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    const savingsSummary = discountAmount > 0
      ? `You save ₹${discountAmount} with this offer!`
      : isFreeShipping && subtotal < 499
      ? `You save ₹50 on free express delivery!`
      : '';

    const savingsSummaryTa = discountAmount > 0
      ? `சிறப்பு சலுகை மூலம் ₹${discountAmount} மிச்சப்படுத்துகிறீர்கள்!`
      : isFreeShipping && subtotal < 499
      ? `இலவச டெலிவரி மூலம் ₹50 மிச்சப்படுத்துகிறீர்கள்!`
      : '';

    return {
      discountAmount,
      isEligible,
      minOrderShortage,
      isFreeShipping,
      shippingFee,
      finalTotal,
      savingsSummary,
      savingsSummaryTa,
    };
  };

  const calculateProductOffer = (basePrice: number): ProductOfferResult => {
    // If an active offer is percentage-based, show the active offer discount
    if (activeOffer && activeOffer.discountType === 'percentage') {
      const savings = Math.round((basePrice * activeOffer.discountValue) / 100);
      const offerPrice = Math.max(0, basePrice - savings);
      return {
        hasOffer: true,
        offerPrice,
        savings,
        discountPercentText: `${activeOffer.discountValue}% OFF`,
        offerCode: activeOffer.code,
      };
    }

    // If an active offer is fixed-amount (and basePrice > discount)
    if (activeOffer && activeOffer.discountType === 'fixed' && basePrice >= activeOffer.minOrderValue) {
      const savings = activeOffer.discountValue;
      const offerPrice = Math.max(0, basePrice - savings);
      return {
        hasOffer: true,
        offerPrice,
        savings,
        discountPercentText: `₹${savings} OFF`,
        offerCode: activeOffer.code,
      };
    }

    // Default: Show the popular FIRST10 offer preview (10% OFF)
    const previewSavings = Math.round(basePrice * 0.10);
    return {
      hasOffer: false,
      offerPrice: basePrice - previewSavings,
      savings: previewSavings,
      discountPercentText: '10% OFF',
      offerCode: 'FIRST10',
    };
  };

  return (
    <OfferContext.Provider
      value={{
        activeOffer,
        availableOffers,
        applyOffer,
        removeOffer,
        calculateCartDiscount,
        calculateProductOffer,
        refreshOffers,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export const useOffers = () => {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error('useOffers must be used within an OfferProvider');
  }
  return context;
};

