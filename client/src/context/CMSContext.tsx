import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface HomeContent {
  heroTitle: string;
  heroTamilTitle?: string;
  heroSubtitle: string;
  heroTamilSubtitle?: string;
  heroDescription: string;
  heroTamilDescription?: string;
  heroBgImage: string;
  buttonText: string;
  buttonTamilText?: string;
  featuredTitle: string;
  featuredTamilTitle?: string;
  featuredSubtitle?: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface AboutContent {
  title: string;
  tamilTitle?: string;
  companyIntro: string;
  tamilCompanyIntro?: string;
  ourHistory: string;
  tamilOurHistory?: string;
  ourMission: string;
  tamilOurMission?: string;
  ourVision: string;
  tamilOurVision?: string;
  productQualityDesc: string;
  tamilProductQualityDesc?: string;
  aboutImage?: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface ProductPageContent {
  sectionTitle: string;
  tamilSectionTitle?: string;
  description: string;
  tamilDescription?: string;
  benefits: string;
  tamilBenefits?: string;
  images: { id: string; url: string; alt: string; title: string }[];
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface OffersContent {
  bannerTitle: string;
  tamilBannerTitle?: string;
  description: string;
  tamilDescription?: string;
  discountInfo: string;
  tamilDiscountInfo?: string;
  couponSectionDesc: string;
  tamilCouponSectionDesc?: string;
  bannerImage?: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface ContactContent {
  title: string;
  tamilTitle?: string;
  description: string;
  tamilDescription?: string;
  address: string;
  phone: string;
  email: string;
  millHours?: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface FooterContent {
  description: string;
  tamilDescription?: string;
  copyrightText: string;
  quickLinks: { label: string; url: string }[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

export interface CmsSiteContent {
  home: HomeContent;
  about: AboutContent;
  product: ProductPageContent;
  offers: OffersContent;
  contact: ContactContent;
  footer: FooterContent;
}

export const DEFAULT_SITE_CONTENT: CmsSiteContent = {
  home: {
    heroTitle: 'Pure Mara Chekku Cold-Pressed Oils',
    heroTamilTitle: 'பாரம்பரிய வாகை மரச்செக்கு தூய எண்ணெய்கள்',
    heroSubtitle: 'Timeless Purity, Modern Convenience',
    heroTamilSubtitle: 'காலமற்ற தூய்மை, நவீன வசதி',
    heroDescription: "Crafted from pesticide-free native seeds crushed at 14 RPM in traditional Vaagai wood mortars without heat or chemicals. Salem's heritage since 1966.",
    heroTamilDescription: 'ரசாயனம் இல்லாத பாரம்பரிய வாகை மரச்செக்கில் இயற்கை முறையில் ஆட்டப்பட்ட 100% தூய சமையல் எண்ணெய்கள்.',
    heroBgImage: '/banners/ssoil_bottling_hero_banner.jpg',
    buttonText: 'SHOP NOW',
    buttonTamilText: 'இப்போதே வாங்க',
    featuredTitle: 'Handcrafted Heritage Oils',
    featuredTamilTitle: 'கைவினை பாரம்பரிய எண்ணெய்கள்',
    featuredSubtitle: 'Extracted with cold-pressing below 42°C preserving native nutrients & taste',
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
  about: {
    title: '58 Years of Mara Chekku Mill Heritage',
    tamilTitle: '58 வருட மரச்செக்கு ஆலை பாரம்பரியம்',
    companyIntro: 'SS OIL was founded with a single mission: to bring unadulterated, wholesome wood-pressed oils from our Salem mill directly to healthy South Indian kitchens.',
    tamilCompanyIntro: 'சேலம் மாநகரில் தூய, ரசாயனமற்ற மரச்செக்கு எண்ணெய்களை குடும்பங்களுக்கு நேரடியாக வழங்குவதே எங்கள் முதன்மை நோக்கம்.',
    ourHistory: 'Founded in 1966 by our grandfather with a pair of native Kangeyam bullocks and seasoned Vaagai wood pestles. Today, three generations later, we uphold the exact same ambient cold-crushing temperature.',
    tamilOurHistory: '1966-ஆம் ஆண்டு தொடங்கப்பட்டு, மூன்று தலைமுறைகளாக 42°C வெப்பத்திற்குள் மரச்செக்கில் ஆட்டும் பாரம்பரியத்தைக் கட்டிக்காத்து வருகிறோம்.',
    ourMission: 'To replace industrially refined and chemically solvent-extracted oils with clean, cold-pressed native nutrition that nurtures hearts and longevity.',
    tamilOurMission: 'தொழிற்சாலை ரசாயன எண்ணெய்களுக்கு மாற்றாக இதயத்திற்கு நலம் சேர்க்கும் இயற்கை மரச்செக்கு எண்ணெய்களை ஒவ்வொரு வீட்டிற்கும் கொண்டு சேர்ப்பதே எங்களின் லட்சியம்.',
    ourVision: "To be India's most trusted cold-pressed edible oil house, championing regenerative agriculture, fair farmer wages, and uncompromised lab transparency.",
    tamilOurVision: 'பாரம்பரிய விவசாயம் மற்றும் கலப்படமற்ற உணவுப் பொருட்களின் மூலம் இந்தியாவின் மிக நம்பகமான மரச்செக்கு பிராண்டாக விளங்குவது.',
    productQualityDesc: 'Agmark Grade-1 certified, 100% zero hexane residue, laboratory tested for acid values, peroxide values, and high Vitamin E retention.',
    tamilProductQualityDesc: 'அக்மார்க் முதல் தரம், பூஜ்ஜிய ரசாயனம், மற்றும் இயற்கை வைட்டமின் E சத்துக்கள் நிறைந்தது.',
    aboutImage: '/craft_stage_churn.jpg',
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
  product: {
    sectionTitle: 'Our Artisanal Wood-Pressed Oil Collection',
    tamilSectionTitle: 'எங்கள் மரச்செக்கு எண்ணெய் வகைகள்',
    description: 'Explore 100% virgin cold-pressed Sesame, Groundnut, Coconut, and specialty cooking oils crafted for authentic aroma, high smoke point, and wholesome wellness.',
    tamilDescription: 'பாரம்பரிய மணம், சுவை மற்றும் ஆரோக்கியம் நிறைந்த வாகை மரச்செக்கு நல்லெண்ணெய், கடலை எண்ணெய், தேங்காய் எண்ணெய் தயாரிப்புகள்.',
    benefits: '• Cold-pressed below 42°C in Vaagai wood pestles\n• 100% Natural, zero mineral oil, paraffin or hexane\n• Rich in native antioxidants & active Vitamin E\n• Agmark Grade-1 & FSSAI certified purity standard\n• Authentic aroma that enriches traditional dishes',
    tamilBenefits: '• 42°C-க்கு கீழ் வாகை மரச்செக்கில் ஆட்டப்பட்டது\n• 100% இயற்கை, ரசாயனக் கலப்பற்றது\n• இயற்கை ஆன்டிஆக்ஸிடன்ட்கள் & வைட்டமின் E நிறைந்தது\n• அக்மார்க் முதல் தரச் சான்றிதழ் பெற்றது\n• பாரம்பரிய மணமும் சுவையும் கொண்டது',
    images: [
      { id: 'img-coconut', url: '/products/coconut_oil.jpg?v=ssoil', alt: 'Coconut Oil', title: 'Mara Chekku Coconut Oil' },
      { id: 'img-sesame', url: '/products/sesame_oil.jpg?v=ssoil', alt: 'Sesame Oil', title: 'Traditional Gingelly Oil' },
      { id: 'img-groundnut', url: '/products/groundnut_oil.jpg?v=ssoil', alt: 'Groundnut Oil', title: 'Pure Mara Chekku Groundnut Oil' },
      { id: 'img-sunflower', url: '/products/sunflower_oil.jpg?v=ssoil', alt: 'Sunflower Oil', title: 'Natural Sunflower Cooking Oil' },
    ],
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
  offers: {
    bannerTitle: 'Festive Mill Celebration & Bulk Discounts',
    tamilBannerTitle: 'பண்டிகை கால ஆலை தள்ளுபடி மற்றும் சலுகைகள்',
    description: 'Save up to 20% on fresh cold-pressed oils straight from our Salem mill with free express home delivery across Tamil Nadu.',
    tamilDescription: 'உங்கள் இல்லங்களுக்கே இலவச விரைவு டெலிவரியுடன் மரச்செக்கு எண்ணெய்களுக்கு 20% வரை சிறப்புத் தள்ளுபடி பெறுங்கள்.',
    discountInfo: '10% OFF on First Order (Code: FIRST10) • 15% OFF Above ₹1000 (Code: SAVE15) • 20% OFF on Bulk Cans (Code: BULK20)',
    tamilDiscountInfo: 'முதல் ஆர்டருக்கு 10% தள்ளுபடி • ₹1000-க்கு மேல் 15% தள்ளுபடி • 5L/15L மொத்த ஆர்டருக்கு 20% தள்ளுபடி',
    couponSectionDesc: 'Copy any coupon code below and apply during checkout to claim your instant direct mill discount.',
    tamilCouponSectionDesc: 'கீழே உள்ள கூப்பன் குறியீட்டை காப்பி செய்து செக்அவுட் பக்கத்தில் தள்ளுபடியைப் பெறுங்கள்.',
    bannerImage: '/banners/ssoil_bottling_hero_banner.jpg',
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
  contact: {
    title: 'Get in Touch with SS OIL Mill Desk',
    tamilTitle: 'எங்கள் ஆலை அலுவலகத்தைத் தொடர்பு கொள்ள',
    description: 'Have questions regarding mill batch certificates, doorstep deliveries, wholesale dealership, or custom gift tins? Our family team is glad to assist you.',
    tamilDescription: 'ஆலை தயாரிப்புகள், மொத்த விற்பனை அல்லது டோர் டெலிவரி குறித்த கேள்விகளுக்கு எங்கள் குழுவைத் தொடர்பு கொள்ளுங்கள்.',
    address: 'SS OIL Mills & Packing Unit, No. 42 Chekku Street, Industrial Estate, Tamil Nadu – 636004',
    phone: '+91 98765 43210 / 1800-425-SSOIL',
    email: 'care@ssoil.in',
    millHours: 'Mon – Sat: 9:00 AM – 7:30 PM IST',
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
  footer: {
    description: 'SS OIL is dedicated to preserving the ancient South Indian heritage of Vaagai wood-pressing, providing wholesome cold-pressed oils with zero chemicals since 1966.',
    tamilDescription: '1966 முதல் ரசாயனக் கலப்பில்லாத தூய வாகை மரச்செக்கு எண்ணெய்களை பாரம்பரிய முறையில் தயாரித்து வழங்கி வருகிறோம்.',
    copyrightText: 'SS OIL Mills Private Limited. All Rights Reserved. Traditional Mara Chekku Heritage.',
    quickLinks: [
      { label: 'Home', url: '/' },
      { label: 'About Us', url: '/about' },
      { label: 'Shop Oils', url: '/shop' },
      { label: 'Our Journey', url: '/mill-journey' },
      { label: 'Offers & Coupons', url: '/offers' },
      { label: 'Contact Mill', url: '/contact' },
      { label: 'Shipping & Returns', url: '/shipping-returns' },
      { label: 'Privacy Policy', url: '/privacy-policy' },
    ],
    socialLinks: {
      facebook: 'https://facebook.com/ssoilheritage',
      instagram: 'https://instagram.com/ssoilheritage',
      youtube: 'https://youtube.com/@ssoilheritage',
      whatsapp: 'https://wa.me/919876543210',
    },
    status: 'PUBLISHED',
    updatedAt: new Date().toISOString(),
  },
};

const getStoredContent = (): CmsSiteContent => {
  try {
    const raw = localStorage.getItem('ssoil_cms_site_content');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SITE_CONTENT,
        ...parsed,
        home: { ...DEFAULT_SITE_CONTENT.home, ...(parsed.home || {}) },
        about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
        product: { ...DEFAULT_SITE_CONTENT.product, ...(parsed.product || {}) },
        offers: { ...DEFAULT_SITE_CONTENT.offers, ...(parsed.offers || {}) },
        contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
        footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
      };
    }
  } catch (e) {}
  return DEFAULT_SITE_CONTENT;
};

interface CMSContextType {
  siteContent: CmsSiteContent;
  isLoading: boolean;
  refreshSiteContent: () => Promise<void>;
  updateTabContent: (tab: keyof CmsSiteContent, updates: any) => Promise<boolean>;
  publishTabContent: (tab: keyof CmsSiteContent) => Promise<boolean>;
  draftTabContent: (tab: keyof CmsSiteContent) => Promise<boolean>;
  resetTabContent: (tab?: keyof CmsSiteContent) => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | null>(null);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<CmsSiteContent>(getStoredContent);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSiteContent = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/site-content');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.siteContent) {
          const merged: CmsSiteContent = {
            home: { ...DEFAULT_SITE_CONTENT.home, ...json.siteContent.home },
            about: { ...DEFAULT_SITE_CONTENT.about, ...json.siteContent.about },
            product: { ...DEFAULT_SITE_CONTENT.product, ...json.siteContent.product },
            offers: { ...DEFAULT_SITE_CONTENT.offers, ...json.siteContent.offers },
            contact: { ...DEFAULT_SITE_CONTENT.contact, ...json.siteContent.contact },
            footer: { ...DEFAULT_SITE_CONTENT.footer, ...json.siteContent.footer },
          };
          setSiteContent(merged);
          try {
            localStorage.setItem('ssoil_cms_site_content', JSON.stringify(merged));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('CMS API fetch fallback to local:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteContent();

    const handleCmsUpdate = () => {
      setSiteContent(getStoredContent());
    };
    window.addEventListener('ssoil_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('ssoil_cms_updated', handleCmsUpdate);
  }, [fetchSiteContent]);

  const updateTabContent = useCallback(
    async (tab: keyof CmsSiteContent, updates: any): Promise<boolean> => {
      // Optimistic client update
      setSiteContent((prev) => {
        const next = {
          ...prev,
          [tab]: {
            ...prev[tab],
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        };
        try {
          localStorage.setItem('ssoil_cms_site_content', JSON.stringify(next));
          window.dispatchEvent(new Event('ssoil_cms_updated'));
        } catch (e) {}
        return next;
      });

      try {
        const res = await fetch(`/api/cms/site-content/${tab}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.tabContent) {
            setSiteContent((prev) => ({ ...prev, [tab]: json.tabContent }));
          }
          return true;
        }
      } catch (e) {
        console.warn('CMS API update failed, local cached:', e);
      }
      return true;
    },
    []
  );

  const publishTabContent = useCallback(
    async (tab: keyof CmsSiteContent): Promise<boolean> => {
      return updateTabContent(tab, { status: 'PUBLISHED' });
    },
    [updateTabContent]
  );

  const draftTabContent = useCallback(
    async (tab: keyof CmsSiteContent): Promise<boolean> => {
      return updateTabContent(tab, { status: 'DRAFT' });
    },
    [updateTabContent]
  );

  const resetTabContent = useCallback(async (tab?: keyof CmsSiteContent): Promise<boolean> => {
    try {
      const res = await fetch('/api/cms/site-content/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tab }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.siteContent) {
          setSiteContent(json.siteContent);
          try {
            localStorage.setItem('ssoil_cms_site_content', JSON.stringify(json.siteContent));
            window.dispatchEvent(new Event('ssoil_cms_updated'));
          } catch (e) {}
          return true;
        }
      }
    } catch (e) {}

    // Fallback
    setSiteContent((prev) => {
      const next = tab
        ? { ...prev, [tab]: { ...DEFAULT_SITE_CONTENT[tab], updatedAt: new Date().toISOString() } }
        : { ...DEFAULT_SITE_CONTENT };
      try {
        localStorage.setItem('ssoil_cms_site_content', JSON.stringify(next));
        window.dispatchEvent(new Event('ssoil_cms_updated'));
      } catch (e) {}
      return next;
    });
    return true;
  }, []);

  return (
    <CMSContext.Provider
      value={{
        siteContent,
        isLoading,
        refreshSiteContent: fetchSiteContent,
        updateTabContent,
        publishTabContent,
        draftTabContent,
        resetTabContent,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = (): CMSContextType => {
  const ctx = useContext(CMSContext);
  if (!ctx) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return ctx;
};

