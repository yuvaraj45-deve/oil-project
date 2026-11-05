import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const CMS_FILE = path.join(DATA_DIR, 'cms_data.json');

export const cmsRouter = Router();

export interface CmsSectionItem {
  id: string;
  pageSlug: string; // 'home' | 'about' | 'mill-journey' | 'why-us' | 'contact' | 'offers'
  sectionKey: string; // 'hero' | 'story' | 'craft' | 'pillars' | 'quality' | 'banner' | 'faq'
  title: string;
  tamilTitle?: string;
  subtitle?: string;
  tamilSubtitle?: string;
  body?: string;
  tamilBody?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  status: 'PUBLISHED' | 'DRAFT';
  sortOrder: number;
  updatedAt: string;
}

export interface CmsPageMeta {
  slug: string;
  name: string;
  tamilName?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  updatedAt: string;
}

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

export interface CmsDatabase {
  pages: CmsPageMeta[];
  sections: CmsSectionItem[];
  siteContent?: CmsSiteContent;
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

const DEFAULT_CMS_DATA: CmsDatabase = {
  pages: [
    {
      slug: 'home',
      name: 'Home Page',
      tamilName: 'முகப்புப் பக்கம்',
      metaTitle: 'SS OIL • Traditional Mara Chekku Cold-Pressed Oils Salem',
      metaDescription: 'Authentic wood-pressed Sesame, Groundnut, Coconut, and Cooking oils crushed at 14 RPM in traditional Vaagai trees. Since 1966.',
      metaKeywords: 'mara chekku oil, cold pressed gingelly oil, pure groundnut oil, wood ghani, salem mill, sulphur free coconut oil',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'about',
      name: 'About Us Page',
      tamilName: 'எங்கள் கதை',
      metaTitle: 'Our Heritage & Story • 58 Years of Mara Chekku Pressing | SS OIL',
      metaDescription: 'Learn about SS OIL legacy since 1966. Three generations of pure oil extraction using traditional Vaagai wood mortar pressing.',
      metaKeywords: 'ss oil heritage, salem oil mill history, vaagai chekku tradition, 1966 cold press mill',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'mill-journey',
      name: 'Our History (Mill Journey)',
      tamilName: 'மரச்செக்கு பயணம்',
      metaTitle: 'The Mill Journey • Traditional Cold Pressing Process | SS OIL',
      metaDescription: 'From handpicked sun-dried seeds to gentle gravity filtration. Experience our 5-stage native cold-pressing craft.',
      metaKeywords: 'cold press process, wood mortar oil extraction, unrefined virgin oil steps, salem heritage mill',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'why-us',
      name: 'Product Quality (Why Us)',
      tamilName: 'ஆலை தரம் & சான்றிதழ்',
      metaTitle: 'Why Choose SS OIL • 100% Zero Hexane & Agmark Certified Pure Oils',
      metaDescription: 'Compare refined cooking oils with native Mara Chekku oils. Lab-tested, zero chemical solvents, and high vitamin retention.',
      metaKeywords: 'agmark grade 1 oil, zero chemical oil, chekku vs refined oil, pure wood pressed health benefits',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'contact',
      name: 'Contact Page',
      tamilName: 'தொடர்பு & ஆலை அலுவலகம்',
      metaTitle: 'Contact SS OIL • Mill Customer Care & Salem Factory Desk',
      metaDescription: 'Get in touch with our customer care desk. Visit our traditional wood mill in Salem or order fresh batches online.',
      metaKeywords: 'ss oil contact, salem mill address, customer care number, bulk oil inquiry',
      updatedAt: new Date().toISOString(),
    },
    {
      slug: 'offers',
      name: 'Offers & Discounts',
      tamilName: 'சிறப்பு சலுகைகள் & கூப்பன்கள்',
      metaTitle: 'Exclusive Offers & Discount Coupons • Up to 20% OFF | SS OIL',
      metaDescription: 'Save on pure cold-pressed native oils. Welcome discounts, free delivery coupons, and festive bulk offers.',
      metaKeywords: 'oil discounts, ss oil coupon code, mara chekku offers, free shipping coupon',
      updatedAt: new Date().toISOString(),
    },
  ],
  sections: [
    {
      id: 'sec-home-hero',
      pageSlug: 'home',
      sectionKey: 'hero',
      title: 'Pure Traditional Vaagai Mara Chekku Oils',
      tamilTitle: 'பாரம்பரிய வாகை மரச்செக்கில் ஆட்டப்பட்ட தூய எண்ணெய்கள்',
      subtitle: 'Cold-pressed below 42°C with unrefined raw sesame, groundnut, and coconut goodness.',
      tamilSubtitle: 'இயற்கை வெப்பம் மாறாமல் 42°C-க்கு கீழ் பிழியப்பட்ட அசல் மரச்செக்கு தயாரிப்புகள்.',
      body: 'Our family wood ghani in Salem operates at an ambient 14 RPM. Zero chemical solvents, zero hexane, and zero artificial heat, retaining 100% vital Vitamin E and heart-healthy phytosterols.',
      image: '/banners/ssoil_bottling_hero_banner.jpg',
      ctaLabel: 'Shop Fresh Mill Batch',
      ctaUrl: '/shop',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sec-about-story',
      pageSlug: 'about',
      sectionKey: 'story',
      title: 'Preserving Tamil Nadu’s Cold-Press Heritage',
      tamilTitle: 'தமிழ்நாட்டின் மரச்செக்கு பாரம்பரியத்தைப் பாதுகாத்தல்',
      subtitle: '58 years of unbroken dedication to authentic stone and wood-pestle crushing.',
      body: 'Every drop is pressed using slow-growth Vaagai logs. Our cold-press is completely free of chemical preservatives, paraffin, synthetic coloring, and hexane residues.',
      image: '/products/coconut_oil.jpg?v=ssoil',
      ctaLabel: 'Explore Product Range',
      ctaUrl: '/shop',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sec-history-founding',
      pageSlug: 'mill-journey',
      sectionKey: 'craft',
      title: '1966: The Founding Stone Chekku',
      tamilTitle: '1966: பாரம்பரிய மரச்செக்கின் தொடக்கம்',
      subtitle: 'Started with two traditional Vaagai tree mortars powered by native oxen, crushing native groundnuts for the local town.',
      body: 'Over the past six decades, while keeping modern food-grade bottling and Agmark Grade-1 certifications, our core cold-crushing temperature has never exceeded 42°C.',
      image: '/products/sesame_oil.jpg?v=ssoil',
      ctaLabel: 'Learn More',
      ctaUrl: '/mill-journey',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sec-whyus-comparison',
      pageSlug: 'why-us',
      sectionKey: 'quality',
      title: 'Refined Oils vs SS OIL Mara Chekku',
      tamilTitle: 'சுத்திகரிக்கப்பட்ட எண்ணெய் vs SS OIL மரச்செக்கு',
      subtitle: 'Understanding the clear science between industrial refined oils and ambient wood ghani extraction.',
      body: 'Commercial refined oils use 200°C solvent extraction with caustic soda and bleach. SS OIL uses low-shear wood pestles under 42°C, preserving active Vitamin E and native phytosterols.',
      image: '/products/sunflower_oil.jpg?v=ssoil',
      ctaLabel: 'View Lab Certification',
      ctaUrl: '/why-us',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sec-contact-desk',
      pageSlug: 'contact',
      sectionKey: 'desk',
      title: 'Central Mill Dispatch & Customer Care',
      tamilTitle: 'மத்திய ஆலை விநியோக மையம் & வாடிக்கையாளர் உதவி',
      subtitle: 'We are here to answer questions regarding batch codes, pack sizes, bulk corporate orders, or farm sourcing.',
      body: 'Factory visits are welcomed on weekdays between 9:00 AM and 5:00 PM. Experience live wood mortar crushing in Salem.',
      image: '/products/groundnut_oil.jpg?v=ssoil',
      ctaLabel: 'Call Mill Desk',
      ctaUrl: 'tel:+919443210855',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sec-offers-festival',
      pageSlug: 'offers',
      sectionKey: 'banner',
      title: 'Seasonal Mill Celebration Vouchers',
      tamilTitle: 'பண்டிகை கால ஆலை தள்ளுபடி வவுச்சர்கள்',
      subtitle: 'Enjoy up to 20% discount on family combo packs and 5-litre cans with free express doorstep delivery.',
      body: 'Enter codes FIRST10, SAVE15, or BULK20 during checkout to activate your direct mill savings on genuine cold-pressed oils.',
      image: '/products/rice_bran_oil.jpg',
      ctaLabel: 'View All Vouchers',
      ctaUrl: '/offers',
      status: 'PUBLISHED',
      sortOrder: 1,
      updatedAt: new Date().toISOString(),
    },
  ],
  siteContent: DEFAULT_SITE_CONTENT,
};

// Ensure data folder and file exist
const ensureStorage = (): void => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CMS_FILE)) {
      fs.writeFileSync(CMS_FILE, JSON.stringify(DEFAULT_CMS_DATA, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring CMS storage:', err);
  }
};

const loadData = (): CmsDatabase => {
  ensureStorage();
  try {
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    const parsed: CmsDatabase = JSON.parse(raw);
    let changed = false;

    if (!parsed.pages || parsed.pages.length === 0) {
      parsed.pages = DEFAULT_CMS_DATA.pages;
      changed = true;
    }
    if (!parsed.sections || parsed.sections.length === 0) {
      parsed.sections = DEFAULT_CMS_DATA.sections;
      changed = true;
    }
    if (!parsed.siteContent) {
      parsed.siteContent = DEFAULT_SITE_CONTENT;
      changed = true;
    } else {
      // Ensure all 6 tabs exist
      for (const tab of ['home', 'about', 'product', 'offers', 'contact', 'footer'] as (keyof CmsSiteContent)[]) {
        if (!parsed.siteContent[tab]) {
          (parsed.siteContent as any)[tab] = DEFAULT_SITE_CONTENT[tab];
          changed = true;
        }
      }
    }

    if (changed) {
      saveData(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read cms_data.json, falling back to defaults:', err);
    return { ...DEFAULT_CMS_DATA };
  }
};

const saveData = (data: CmsDatabase): boolean => {
  ensureStorage();
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write cms_data.json:', err);
    return false;
  }
};

// -------------------------------------------------------------
// 1. GET ALL CMS PAGES & STATS (Admin Dashboard)
// -------------------------------------------------------------
cmsRouter.get('/pages', (_req: Request, res: Response) => {
  const data = loadData();
  const publishedCount = data.sections.filter((s) => s.status === 'PUBLISHED').length;
  const draftCount = data.sections.filter((s) => s.status === 'DRAFT').length;

  res.json({
    success: true,
    stats: {
      totalPages: data.pages.length,
      publishedCount,
      draftCount,
      totalSections: data.sections.length,
    },
    pages: data.pages,
    sections: data.sections,
    siteContent: data.siteContent,
  });
});

// -------------------------------------------------------------
// 2. GET FULL SITE CONTENT FOR ALL 6 TABS (Public & Admin)
// -------------------------------------------------------------
cmsRouter.get('/site-content', (_req: Request, res: Response) => {
  const data = loadData();
  res.json({
    success: true,
    siteContent: data.siteContent || DEFAULT_SITE_CONTENT,
    sections: data.sections,
  });
});

// -------------------------------------------------------------
// 3. UPDATE / SAVE TAB CONTENT (Home, About, Product, Offers, Contact, Footer)
// -------------------------------------------------------------
cmsRouter.put('/site-content/:tab', (req: Request, res: Response) => {
  const { tab } = req.params;
  const updates = req.body;
  const data = loadData();

  if (!['home', 'about', 'product', 'offers', 'contact', 'footer'].includes(tab)) {
    return res.status(400).json({ success: false, message: `Invalid tab "${tab}"` });
  }

  if (!data.siteContent) {
    data.siteContent = { ...DEFAULT_SITE_CONTENT };
  }

  const existingTabContent = (data.siteContent as any)[tab] || (DEFAULT_SITE_CONTENT as any)[tab];
  const updatedTabContent = {
    ...existingTabContent,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  (data.siteContent as any)[tab] = updatedTabContent;
  saveData(data);

  res.json({
    success: true,
    message: `${tab.toUpperCase()} content updated successfully!`,
    siteContent: data.siteContent,
    tabContent: updatedTabContent,
  });
});

// -------------------------------------------------------------
// 4. TOGGLE TAB STATUS (Publish <-> Draft)
// -------------------------------------------------------------
cmsRouter.patch('/site-content/:tab/status', (req: Request, res: Response) => {
  const { tab } = req.params;
  const { status } = req.body;
  const data = loadData();

  if (!['home', 'about', 'product', 'offers', 'contact', 'footer'].includes(tab)) {
    return res.status(400).json({ success: false, message: `Invalid tab "${tab}"` });
  }

  if (!data.siteContent) {
    data.siteContent = { ...DEFAULT_SITE_CONTENT };
  }

  const target = (data.siteContent as any)[tab];
  if (!target) {
    return res.status(404).json({ success: false, message: 'Tab content not found' });
  }

  const newStatus = status || (target.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
  target.status = newStatus;
  target.updatedAt = new Date().toISOString();

  saveData(data);

  res.json({
    success: true,
    message: `${tab.toUpperCase()} status is now ${newStatus}!`,
    tabContent: target,
  });
});

// -------------------------------------------------------------
// 5. RESET SPECIFIC TAB OR ALL SITE CONTENT TO DEFAULTS
// -------------------------------------------------------------
cmsRouter.post('/site-content/reset', (req: Request, res: Response) => {
  const { tab } = req.body;
  const data = loadData();

  if (tab && ['home', 'about', 'product', 'offers', 'contact', 'footer'].includes(tab)) {
    if (!data.siteContent) data.siteContent = { ...DEFAULT_SITE_CONTENT };
    (data.siteContent as any)[tab] = { ...(DEFAULT_SITE_CONTENT as any)[tab], updatedAt: new Date().toISOString() };
    saveData(data);
    return res.json({
      success: true,
      message: `${tab.toUpperCase()} content reset to factory defaults!`,
      tabContent: (data.siteContent as any)[tab],
      siteContent: data.siteContent,
    });
  }

  data.siteContent = { ...DEFAULT_SITE_CONTENT };
  saveData(data);

  res.json({
    success: true,
    message: 'All website content reset to factory defaults!',
    siteContent: data.siteContent,
  });
});

// -------------------------------------------------------------
// 6. GET SECTIONS FOR A SPECIFIC PAGE (Customer View)
// -------------------------------------------------------------
cmsRouter.get('/pages/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = loadData();
  const page = data.pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!page) {
    return res.status(404).json({ success: false, message: `Page with slug '${slug}' not found` });
  }

  const sections = data.sections
    .filter((s) => s.pageSlug.toLowerCase() === slug.toLowerCase() && s.status === 'PUBLISHED')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  res.json({
    success: true,
    page,
    sections,
  });
});

// -------------------------------------------------------------
// 7. CREATE / ADD NEW CONTENT SECTION
// -------------------------------------------------------------
cmsRouter.post('/sections', (req: Request, res: Response) => {
  const {
    pageSlug,
    sectionKey,
    title,
    tamilTitle,
    subtitle,
    tamilSubtitle,
    body,
    tamilBody,
    image,
    ctaLabel,
    ctaUrl,
    status,
    sortOrder,
  } = req.body;

  if (!pageSlug || !title) {
    return res.status(400).json({ success: false, message: 'Page and Title are required' });
  }

  const data = loadData();
  const newSection: CmsSectionItem = {
    id: `sec-${Date.now()}`,
    pageSlug: pageSlug.trim().toLowerCase(),
    sectionKey: (sectionKey || 'custom').trim().toLowerCase(),
    title: title.trim(),
    tamilTitle: tamilTitle?.trim(),
    subtitle: subtitle?.trim(),
    tamilSubtitle: tamilSubtitle?.trim(),
    body: body?.trim(),
    tamilBody: tamilBody?.trim(),
    image: image?.trim(),
    ctaLabel: ctaLabel?.trim(),
    ctaUrl: ctaUrl?.trim(),
    status: status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    sortOrder: Number(sortOrder) || data.sections.length + 1,
    updatedAt: new Date().toISOString(),
  };

  data.sections.unshift(newSection);
  saveData(data);

  res.status(201).json({
    success: true,
    message: 'Content section created successfully!',
    section: newSection,
  });
});

// -------------------------------------------------------------
// 8. UPDATE EXISTING CONTENT SECTION
// -------------------------------------------------------------
cmsRouter.put('/sections/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const data = loadData();

  const idx = data.sections.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  data.sections[idx] = {
    ...data.sections[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveData(data);

  res.json({
    success: true,
    message: 'Content section updated successfully!',
    section: data.sections[idx],
  });
});

// -------------------------------------------------------------
// 9. TOGGLE SECTION PUBLISH STATUS (PUBLISHED <-> DRAFT)
// -------------------------------------------------------------
cmsRouter.patch('/sections/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = loadData();

  const idx = data.sections.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  const newStatus = status ? status : data.sections[idx].status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  data.sections[idx].status = newStatus;
  data.sections[idx].updatedAt = new Date().toISOString();

  saveData(data);

  res.json({
    success: true,
    message: `Content status changed to ${newStatus}`,
    section: data.sections[idx],
  });
});

// -------------------------------------------------------------
// 10. DELETE CONTENT SECTION
// -------------------------------------------------------------
cmsRouter.delete('/sections/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = loadData();

  const initialCount = data.sections.length;
  data.sections = data.sections.filter((s) => s.id !== id);

  if (data.sections.length === initialCount) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  saveData(data);

  res.json({
    success: true,
    message: 'Content section deleted successfully!',
  });
});

// -------------------------------------------------------------
// 11. UPDATE PAGE SEO / METADATA
// -------------------------------------------------------------
cmsRouter.put('/pages/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const { metaTitle, metaDescription, metaKeywords, name, tamilName } = req.body;
  const data = loadData();

  const idx = data.pages.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }

  data.pages[idx] = {
    ...data.pages[idx],
    metaTitle: metaTitle || data.pages[idx].metaTitle,
    metaDescription: metaDescription || data.pages[idx].metaDescription,
    metaKeywords: metaKeywords || data.pages[idx].metaKeywords,
    name: name || data.pages[idx].name,
    tamilName: tamilName || data.pages[idx].tamilName,
    updatedAt: new Date().toISOString(),
  };

  saveData(data);

  res.json({
    success: true,
    message: `SEO settings updated for ${data.pages[idx].name}!`,
    page: data.pages[idx],
  });
});

// -------------------------------------------------------------
// 12. RESET TO FACTORY DEFAULTS
// -------------------------------------------------------------
cmsRouter.post('/reset', (_req: Request, res: Response) => {
  const fresh = { ...DEFAULT_CMS_DATA };
  saveData(fresh);
  res.json({
    success: true,
    message: 'CMS content has been reset to factory defaults!',
    data: fresh,
  });
});
