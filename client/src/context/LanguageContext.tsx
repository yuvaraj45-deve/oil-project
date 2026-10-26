import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.health': 'Health',
    'nav.contact': 'Contact',
    'nav.searchPlaceholder': 'Search oils...',
    'nav.signIn': 'Sign In',
    'nav.cart': 'Cart',
    'nav.tagline': 'Pure Oil • Healthy Life',

    // Hero
    'hero.badge': '100% PURE • NATURAL • TRUSTED',
    'hero.title': 'Goodness of Nature in Every Drop',
    'hero.subtitle': 'PureVa brings you the finest quality cooking oils, crafted from nature, for a healthier tomorrow.',
    'hero.exploreProducts': 'Explore Our Products',

    // Value Pillars
    'pillar.1.title': '100% Pure & Natural',
    'pillar.1.desc': 'No harmful chemicals, no adulteration.',
    'pillar.2.title': 'Good for Your Health',
    'pillar.2.desc': 'Rich in nutrients, supports a healthy lifestyle.',
    'pillar.3.title': 'Premium Quality',
    'pillar.3.desc': 'Carefully processed for the best taste & nutrition.',
    'pillar.4.title': 'Sustainable Choice',
    'pillar.4.desc': 'Better for you, better for the planet.',

    // Our Product Range (Categories)
    'range.badge': 'OUR PRODUCT RANGE',
    'range.title': 'Pure Oils for a Healthier You',
    'range.subtitle': 'Choose from our range of 100% cold-pressed oils, traditional pooja essentials, and wholesome kitchen products.',
    'range.tab.all': 'All Categories',
    'range.tab.woodPressed': 'Wood-Pressed Oils',
    'range.tab.cooking': 'Cooking Oils',
    'range.tab.pooja': 'Pooja Oils',
    'range.tab.gheeJaggery': 'Ghee & Sweeteners',
    'range.from': 'From',
    'range.shop': 'Shop',

    // Category Names
    'cat.groundnut.name': 'Groundnut Oil',
    'cat.groundnut.benefit': 'Rich in natural Vitamin E, heart-healthy MUFA & authentic aroma',
    'cat.sesame.name': 'Sesame (Gingelly) Oil',
    'cat.sesame.benefit': 'Slow-pressed with palm jaggery, high in calcium & sesamol antioxidants',
    'cat.coconut.name': 'Virgin Coconut Oil',
    'cat.coconut.benefit': 'Sulphur-free sun-dried copra, 64% Lauric Acid for cooking, hair & skin',
    'cat.sunflower.name': 'Sunflower Cooking Oil',
    'cat.sunflower.benefit': 'Light non-sticky texture, rich in Vitamin E with high smoke point',
    'cat.ricebran.name': 'Heart-Care Rice Bran Oil',
    'cat.ricebran.benefit': '10,000+ ppm natural Oryzanol clinically balanced for cholesterol care',
    'cat.lamp.name': 'Pooja Deepam Oil',
    'cat.lamp.benefit': 'Traditional 5 sacred oils blend for divine prosperity and positive aura',
    'cat.ghee.name': 'A2 Cultured Cow Ghee',
    'cat.ghee.benefit': 'Made from cultured A2 curd churned with traditional wooden bilona',
    'cat.jaggery.name': 'Palm Jaggery (Karupatti)',
    'cat.jaggery.benefit': '100% natural unrefined palm nectar rich in plant iron & minerals',

    // Product Names & Taglines
    'prod.ss-sesame-1000.name': 'SS Premium Wood-Pressed Sesame Oil',
    'prod.ss-sesame-1000.tagline': 'Gingelly Oil slow-pressed with Natural Palm Jaggery',
    'prod.ss-coconut-1000.name': 'SS Pure Cold-Pressed Coconut Oil',
    'prod.ss-coconut-1000.tagline': 'Raw Extra-Virgin Oil from Sulphur-Free Sun-Dried Copra',
    'prod.ss-cooking-daily-1000.name': 'SS Gold Everyday Pure Cooking Oil',
    'prod.ss-cooking-daily-1000.tagline': 'Light, Balanced & Nutrient-Rich Oil for Modern Kitchens',
    'prod.ss-groundnut-1000.name': 'SS Mara Chekku Groundnut Oil',
    'prod.ss-groundnut-1000.tagline': 'Traditional Wood-Pressed Groundnut Oil with Rich Nutty Aroma',
    'prod.ss-sunflower-1000.name': 'SS Pure Light Sunflower Oil',
    'prod.ss-sunflower-1000.tagline': 'Light, Pure & Vitamin E Enriched for Modern Health',
    'prod.ss-ricebran-1000.name': 'SS Heart-Care Pure Rice Bran Oil',
    'prod.ss-ricebran-1000.tagline': 'Physically Refined with 10,000+ ppm Natural Gamma Oryzanol',
    'prod.ss-deepam-1000.name': 'SS Pancha Deepam Pooja Oil',
    'prod.ss-deepam-1000.tagline': 'Sacred 5-Oil Blend Infused with Sugandha Herbs for Divine Peace',
    'prod.ss-ghee-500.name': 'SS A2 Cultured Desi Cow Ghee',
    'prod.ss-ghee-500.tagline': 'Traditional Bilona Method from Native Bos Indicus Cow Milk',
    'prod.ss-jaggery-500.name': 'SS Pure Udangudi Palm Jaggery (Karupatti)',
    'prod.ss-jaggery-500.tagline': 'Traditional Unrefined Palm Nectar Block Packed with Natural Iron',

    // Featured Products (4 items + View All)
    'prod.badge': 'POPULAR PRODUCTS',
    'prod.title': 'Our Pure Oils & Products',
    'prod.subtitle': 'Freshly cold-pressed in Salem, 100% unadulterated, lab-tested with airtight food-grade bottling.',
    'prod.filter': 'Filter:',
    'prod.filterAll': 'All Oils',
    'prod.pure': '100% Pure',
    'prod.mill': 'Salem Mill',
    'prod.details': 'Details',
    'prod.labTested': 'Lab Tested',
    'prod.available': 'Available:',
    'prod.base': 'Base',
    'prod.addToCart': 'Add to Cart',
    'prod.added': 'Added to Cart!',
    'prod.selectLiter': 'SELECT LITER',
    'prod.howManyLiters': 'How many liters do you need?',
    'prod.clickPreferred': 'Click preferred size to add to cart',

    // View All Card
    'viewAll.fullRange': 'FULL RANGE',
    'viewAll.products': 'PRODUCTS',
    'viewAll.moreToExplore': 'MORE TO EXPLORE',
    'viewAll.title': 'View All Products',
    'viewAll.desc': 'Explore all cold-pressed oils, pooja essentials & pure cow ghee.',
    'viewAll.button': 'View All',

    // Promise of Purity
    'promise.badge': 'ABOUT PUREVA',
    'promise.title': 'Our Promise of Purity',
    'promise.desc': 'At PureVa, we believe that good health starts with what you cook. That is why we bring you 100% pure, natural and unadulterated oils, sourced from the best farms and processed with care.',
    'promise.knowMore': 'Know More',
    'promise.quote': 'Real Oil. Real Goodness.',
    'promise.tagline': 'Pure. Healthy. Happy.',

    // Pure Difference
    'diff.badge': 'WHY CHOOSE PUREVA',
    'diff.title': 'The Pure Difference',
    'diff.f1.title': 'No Added Preservatives',
    'diff.f1.desc': 'Just pure goodness.',
    'diff.f2.title': 'No Artificial Colors',
    'diff.f2.desc': 'Naturally clear & clean.',
    'diff.f3.title': 'Rich in Nutrients',
    'diff.f3.desc': 'Supports overall wellness.',
    'diff.f4.title': 'Trusted by Families',
    'diff.f4.desc': 'For generations.',

    // Make the Switch Banner
    'switch.quote': 'Healthy Cooking, Happier Living',
    'switch.title': 'Make the Switch to PureVa',
    'switch.desc': 'Better Oil. Better Health. A Brighter Future.',
    'switch.shopNow': 'Shop Now',

    // Footer
    'footer.copyright': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',

    // Shop Page
    'shop.badge': 'Direct from Salem Mill',
    'shop.title': 'Our Cold-Pressed & Mara Chekku Collection',
    'shop.subtitle': 'Every bottle is slow-churned without artificial heat or chemical bleaching. Choose pure wood-pressed sesame, virgin coconut, and everyday healthy oils.',
    'shop.searchPlaceholder': 'Search oils by name or dish...',
    'shop.cat.all': 'All Pure Oils & Products',
    'shop.cat.groundnut': 'Groundnut Oil',
    'shop.cat.sesame': 'Sesame Oil',
    'shop.cat.coconut': 'Virgin Coconut Oil',
    'shop.cat.cooking': 'Everyday Cooking Oil',
    'shop.cat.pooja': 'Pooja Deepam Oil',
    'shop.cat.ghee': 'A2 Cow Ghee',
    'shop.cat.jaggery': 'Palm Jaggery',
    'shop.sortBy': 'Sort by:',
    'shop.sort.featured': 'Featured',
    'shop.sort.priceLow': 'Price: Low to High',
    'shop.sort.priceHigh': 'Price: High to Low',
    'shop.sort.rating': 'Top Rated',
    'shop.showing': 'Showing',
    'shop.productsCount': 'pure products',
    'shop.noProducts': 'No oils match your filters.',
    'shop.mrp': 'MRP',

    // About Page & Section
    'about.heritageBadge': 'Salem Heritage • Estd. 1984',
    'about.heroTitle': 'Four Decades of Artisanal Wood-Pressed Purity',
    'about.heroDesc': 'What started as a single Vaagai wood mortar in Salem has grown into a trusted family name across Tamil Nadu and South India.',
    'about.history.title': 'Our History',
    'about.history.desc': 'Our journey began with a vision to bring quality cooking oil to every home. We continue to grow with a commitment to customer trust and tradition.',
    'about.quality.title': 'Product Quality',
    'about.quality.desc': 'We focus on delivering quality edible oils with care and attention, making them a reliable choice for your everyday cooking.',
    'about.storyBadge': 'About SS OIL',
    'about.storyTitle': 'Generations of Honesty, Pressed Into Every Drop',
    'about.storyP1': 'Founded on the belief that real food begins with real oil, SS OIL preserves the ancient South Indian tradition of Mara Chekku (wood-pressing). By using genuine Vaagai wood churners that operate at natural room temperatures, we safeguard the delicate vitamins, aroma, and natural taste that commercial industrial processing destroys.',
    'about.storyP2': 'Every single drop we package is 100% unadulterated, free from liquid paraffin, and tested for low peroxide and zero chemical solvents. Because good health begins in the kitchen.',
    'about.tradHeritage': 'Traditional Heritage',
    'about.vaagaiTitle': 'Authentic Vaagai Mara Chekku',
    'about.vaagaiDesc': 'Naturally cooled wood prevents nutrient loss during crushing.',
    'about.unadulterated': '100% Unadulterated',
    'about.noDilution': 'Zero Liquid Paraffin or Palm Dilution',
    'about.stat.heritage': 'Heritage Year',
    'about.stat.coldPressed': 'Cold-Pressed',
    'about.stat.experience': 'Years Experience',
    'about.stat.families': 'Happy Families',

    // Contact Page
    'contact.badge': 'Customer & Wholesale Desk',
    'contact.title': 'Connect with Our Salem Mill',
    'contact.subtitle': 'Have questions about our cold-press process, bulk 15L catering tins, or direct farmer sourcing? Our mill desk is here to assist you.',
    'contact.officeTitle': 'Salem Mill & Head Office',
    'contact.locationTitle': 'Mill Location',
    'contact.locationDesc': 'SS OIL Mills & Packing Facility, No. 42 Chekku Street, Industrial Estate, Salem, Tamil Nadu – 636004',
    'contact.phoneTitle': 'Phone & WhatsApp',
    'contact.phoneHours': 'Mon – Sat: 9:00 AM – 7:30 PM IST',
    'contact.emailTitle': 'Email Enquiries',
    'contact.emailDesc': 'Direct responses within 2 to 4 business hours',
    'contact.formTitle': 'Send Us a Direct Message',
    'contact.formName': 'Full Name',
    'contact.formPhone': 'Phone Number',
    'contact.formEmail': 'Email Address',
    'contact.formType': 'Inquiry Type',
    'contact.typeRetail': 'Retail Customer Order',
    'contact.typeBulk': 'Bulk & Catering Supply',
    'contact.typeDist': 'Distribution / Dealership',
    'contact.formMessage': 'Your Message / Inquiry',
    'contact.formSubmit': 'Send Message to Mill',
    'contact.success': 'Thank you! Your message has been dispatched to our Salem mill desk.',

    // Cart Drawer
    'cart.title': 'Your Shopping Cart',
    'cart.items': 'items',
    'cart.freeShippingReached': 'You qualify for FREE Delivery across Tamil Nadu!',
    'cart.addMoreForFree': 'Add',
    'cart.moreForFree': 'more to unlock FREE Delivery!',
    'cart.emptyTitle': 'Your Cart is Empty',
    'cart.emptySubtitle': 'Explore our range of pure cold-pressed oils and add wholesome goodness to your home.',
    'cart.startShopping': 'Start Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.delivery': 'Estimated Delivery',
    'cart.free': 'FREE',
    'cart.proceedCheckout': 'Proceed to Checkout',
    'cart.clearCart': 'Clear Cart',

    // Why Us / Health Page
    'whyus.badge': 'The Purity Standard',
    'whyus.title': 'Why Discerning Families Choose SS OIL',
    'whyus.subtitle': 'Over 90% of supermarket edible oils are industrially bleached, solvent-extracted, and deodorized. Discover the uncompromising science behind our pure wood-pressed craftsmanship.',
    'whyus.certBadge': 'NABL & FSSAI Certified',
    'whyus.certTitle': 'Every Single Batch Has a Lab Report',
    'whyus.certDesc': 'We test for Free Fatty Acids (< 0.35%), Peroxide Value (< 1.8 meq/kg), and Zero Hexane solvent residues so you feed your children with complete peace of mind.',
    'whyus.inspectCert': 'Inspect Official GC-MS Certificate',
    'whyus.shopVerified': 'Shop Verified Oils',

    // Purity Comparison Matrix
    'comparison.badge': 'The Purity Truth',
    'comparison.title': 'Commercial Refined Oil vs SS OIL Mara Chekku',
    'comparison.subtitle': "Understand what goes into your family's daily cooking oil before you buy.",
    'comparison.colStandard': 'Critical Quality Standard',
    'comparison.colRefined': 'Commercial Refined',
    'comparison.colWoodPressed': 'SS OIL Wood-Pressed',
    'comparison.temp': 'Extraction Temperature',
    'comparison.tempRefined': 'Subjected to 200°C – 240°C thermal steam cracking',
    'comparison.tempSS': 'Natural room temperature crushing (Always below 42°C)',
    'comparison.solvents': 'Chemical Solvents Used',
    'comparison.solventsRefined': 'Hexane petroleum solvent used to maximize factory yield',
    'comparison.solventsSS': 'Zero chemical solvents. 100% mechanical wood pressure',
    'comparison.bleach': 'Bleaching & Clarification',
    'comparison.bleachRefined': 'Sulfuric acid wash, caustic soda neutralization & silica clay',
    'comparison.bleachSS': '5 Days natural solar sunlight sedimentation',
    'comparison.vitE': 'Natural Vitamin E & Tocopherols',
    'comparison.vitERefined': 'Completely stripped by high heat and vacuum deodorization',
    'comparison.vitESS': '100% retained natural antioxidants & plant phytosterols',
    'comparison.foam': 'Anti-Foaming Additives',
    'comparison.foamRefined': 'Synthetic chemicals (e.g. Dimethylpolysiloxane / E900)',
    'comparison.foamSS': 'Zero anti-foaming agents or synthetic preservatives',
    'comparison.aroma': 'Culinary Aroma & Taste',
    'comparison.aromaRefined': 'Deodorized, flat, neutral, and chemical blandness',
    'comparison.aromaSS': 'Authentic roasted seed fragrance that fills your home',

    // About Section extra
    'about.singleOrigin': 'Single-Origin Seeds',
    'about.singleOriginDesc': 'Only premium black sesame and sun-dried coastal copra sourced directly from farmer cooperatives.',
    'about.zeroPreservatives': 'Zero Preservatives',
    'about.zeroPreservativesDesc': 'No artificial colors, no anti-foaming chemicals, and no chemical degumming agents.',
    'about.yearsTrust': 'Years of Trust',
    'about.satisfiedKitchens': 'Satisfied Kitchens',
    'about.farmSourced': 'Farm Sourced',

    // Farm Origins Map
    'farm.badge': 'Single-Origin Farm Direct',
    'farm.title': 'Rooted in Village Soil',
    'farm.subtitle': 'We bypass industrial commodity brokers and work directly with organic farmer cooperatives across Tamil Nadu and western drylands.',
    'farm.directOrigin': 'Direct Origin',

    // Testimonials
    'testim.badge': 'Real Kitchen Stories',
    'testim.title': 'Customer Testimonials',
    'testim.subtitle': 'See how SS OIL is bringing authentic village taste and wellness back to everyday homes.',
    'testim.verified': 'Verified Purchase',

    // Quick View Modal
    'quickview.inspectLab': 'Inspect Batch Lab Analysis',
    'quickview.tradGhani': '100% Traditional Vaagai Mara Chekku',
    'quickview.healthHighlights': 'Pure Health Highlights:',
    'quickview.selectPackSize': 'Select Pack Size:',
    'quickview.addToCart': 'Add to Cart',
    'quickview.added': 'Added to Cart!',

    // Checkout Modal
    'checkout.title': 'Instant Checkout',
    'checkout.subtitle': 'Direct Salem mill dispatch to your doorstep',
    'checkout.step1': '1. Delivery Address',
    'checkout.step2': '2. Payment Mode',
    'checkout.name': 'Full Name',
    'checkout.phone': 'Mobile Number',
    'checkout.email': 'Email Address',
    'checkout.address': 'Door Number & Street Address',
    'checkout.city': 'City / Town',
    'checkout.state': 'State',
    'checkout.pincode': 'Pincode (6-digit)',
    'checkout.upi': 'UPI Instant (GPay / PhonePe / Paytm / QR)',
    'checkout.cod': 'Cash on Delivery (Pay at Doorstep)',
    'checkout.card': 'Debit / Credit Card / Net Banking',
    'checkout.orderSummary': 'Order Summary',
    'checkout.items': 'Items',
    'checkout.subtotal': 'Subtotal',
    'checkout.delivery': 'Express Delivery',
    'checkout.free': 'FREE',
    'checkout.total': 'Total Payable',
    'checkout.placeOrder': 'Confirm & Place Order',

    // Search Modal
    'search.placeholder': 'Search by oil name, dish, or benefits...',
    'search.quick': 'Quick Searches:',
    'search.noResults': 'No oils found for',
    'search.clear': 'Clear',

    // About Page - User Content & Expansions
    'about.history.title': 'Our History',
    'about.history.desc': 'Our journey began with a vision to bring quality cooking oil to every home. We continue to grow with a commitment to customer trust and tradition.',
    'about.history.p1.title': 'Rooted in Tradition',
    'about.history.p1.desc': 'Reviving time-tested, ancient oil extraction wisdom for modern health-conscious homes.',
    'about.history.p2.title': 'Direct Farm Relationships',
    'about.history.p2.desc': 'Sourcing sun-cured seeds directly from dedicated, local organic farming clusters.',
    'about.history.p3.title': 'Generational Trust',
    'about.history.p3.desc': 'Built on decades of unwavering customer satisfaction and uncompromised word-of-mouth.',

    'about.quality.title': 'Product Quality',
    'about.quality.desc': 'We focus on delivering quality edible oils with care and attention, making them a reliable choice for your everyday cooking.',
    'about.quality.p1.title': '100% Cold-Pressed',
    'about.quality.p1.desc': 'Slow-extracted below 42°C to lock in vital micronutrients, natural antioxidants, and aroma.',
    'about.quality.p2.title': 'Zero Chemical Refining',
    'about.quality.p2.desc': 'No hexane solvents, no caustic soda washing, and zero artificial preservatives.',
    'about.quality.p3.title': 'Batch-Tested Purity',
    'about.quality.p3.desc': 'Every single press is tested for low free fatty acids and natural peroxide values.',

    // Vision & Mission
    'about.vision.badge': 'OUR FUTURE',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To empower every household with pure, nutrient-dense cooking oils that nurture health, preserve culinary heritage, and eliminate adulterated fats from our dining tables.',

    'about.mission.badge': 'OUR PURPOSE',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To uphold honest farm-to-kitchen transparency, preserve traditional wood-pressing methods, and deliver premium edible oils at honest, accessible everyday prices.',

    // 4 Purity Pillars
    'about.pillars.badge': 'THE PUREVA STANDARD',
    'about.pillars.title': 'What Makes Our Oils Stand Apart',
    'about.pillars.subtitle': 'From hand-selected seeds to natural sunlight sedimentation, our process guarantees unmatched purity.',
    'about.pill.1.title': 'Hand-Selected Native Seeds',
    'about.pill.1.desc': 'Only first-grade native sesame, sun-cured coconuts, and clean groundnuts.',
    'about.pill.2.title': 'Traditional Wood Ghani',
    'about.pill.2.desc': 'Slow wood-mortar crushing prevents friction heat damage, locking in vitamins.',
    'about.pill.3.title': 'Solar Sunlight Clarification',
    'about.pill.3.desc': 'Natural 5-day sedimentation under the sun eliminates seed sediment without chemicals.',
    'about.pill.4.title': 'Freshly Packed & Sealed',
    'about.pill.4.desc': 'Bottled in food-grade, leak-proof packaging to preserve aroma and fresh taste.',

    'about.exploreOils': 'Explore Our Pure Oils',
  },

  ta: {
    // Navbar
    'nav.home': 'முகப்பு',
    'nav.products': 'தயாரிப்புகள்',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.health': 'ஆரோக்கியம்',
    'nav.contact': 'தொடர்புக்கு',
    'nav.searchPlaceholder': 'எண்ணெய் தேட...',
    'nav.signIn': 'உள்நுழைக',
    'nav.cart': 'கார்ட்',
    'nav.tagline': 'தூய எண்ணெய் • ஆரோக்கிய வாழ்வு',

    // Hero
    'hero.badge': '100% தூய்மையான • இயற்கை • நம்பகமானது',
    'hero.title': 'ஒவ்வொரு துளியிலும் இயற்கையின் தூய்மை',
    'hero.subtitle': 'உங்கள் குடும்பத்தின் ஆரோக்கியமான வாழ்விற்கு, இயற்கையான முறையில் தயாரிக்கப்பட்ட தூய மரச்செக்கு சமையல் எண்ணெய்கள்.',
    'hero.exploreProducts': 'தயாரிப்புகளைப் பாருங்கள்',

    // Value Pillars
    'pillar.1.title': '100% தூய & இயற்கை',
    'pillar.1.desc': 'ரசாயனங்கள் அற்றது, கலப்படமற்ற தூய்மை.',
    'pillar.2.title': 'ஆரோக்கியத்திற்கு உகந்தது',
    'pillar.2.desc': 'ஊட்டச்சத்துக்கள் நிறைந்தது, இதயத்திற்கு நலம் தரும்.',
    'pillar.3.title': 'உயர்தர தரம்',
    'pillar.3.desc': 'பாரம்பரிய முறையில் சிறந்த சுவை மற்றும் தரத்துடன்.',
    'pillar.4.title': 'சுற்றுச்சூழல் நட்பு',
    'pillar.4.desc': 'உங்களுக்கும் சிறந்தது, பூமிக்கும் நலம் தருவது.',

    // Our Product Range (Categories)
    'range.badge': 'தயாரிப்பு வகைகள்',
    'range.title': 'ஆரோக்கியமான வாழ்வுக்கு தூய எண்ணெய்கள்',
    'range.subtitle': 'பாரம்பரிய மரச்செக்கு எண்ணெய்கள், பூஜை எண்ணெய்கள் மற்றும் இயற்கையான சமையல் பொருட்களைத் தேர்ந்தெடுங்கள்.',
    'range.tab.all': 'அனைத்து வகைகள்',
    'range.tab.woodPressed': 'மரச்செக்கு எண்ணெய்கள்',
    'range.tab.cooking': 'சமையல் எண்ணெய்கள்',
    'range.tab.pooja': 'பூஜை எண்ணெய்கள்',
    'range.tab.gheeJaggery': 'நெய் & கருப்பட்டி',
    'range.from': 'தொடக்க விலை',
    'range.shop': 'வாங்க',

    // Category Names
    'cat.groundnut.name': 'மரச்செக்கு கடலை எண்ணெய்',
    'cat.groundnut.benefit': 'இயற்கையான வைட்டமின் E, இதயத்திற்கு உகந்த நல்ல கொழுப்புகள் மற்றும் பாரம்பரிய மணம்',
    'cat.sesame.name': 'மரச்செக்கு நல்லெண்ணெய்',
    'cat.sesame.benefit': 'பனை கருப்பட்டி சேர்த்து ஆட்டப்பட்டது, அதிக கால்சியம் மற்றும் செசமால் ஆன்டி-ஆக்ஸிடன்ட்கள்',
    'cat.coconut.name': 'பாரம்பரிய தேங்காய் எண்ணெய்',
    'cat.coconut.benefit': 'சல்ஃபர் இல்லாத கொப்பரை, 64% லாரிக் அமிலம் சமையல் மற்றும் தலைமுடி நலம் தரும்',
    'cat.sunflower.name': 'தூய சூரியகாந்தி எண்ணெய்',
    'cat.sunflower.benefit': 'குறைந்த பிசுபிசுப்பு, அதிக வைட்டமின் E மற்றும் தினசரி குடும்ப சமையலுக்கு ஏற்றது',
    'cat.ricebran.name': 'தூய தவிட்டு எண்ணெய்',
    'cat.ricebran.benefit': '10,000+ ppm ஒரிசனால் கொலஸ்ட்ரால் சமநிலைக்கு மருத்துவ ரீதியாக சிறந்தது',
    'cat.lamp.name': 'பஞ்ச தீப பூஜை எண்ணெய்',
    'cat.lamp.benefit': 'தெய்வீக அமைதி மற்றும் மங்களகரமான நேர்மறை ஆற்றல் தரும் 5 புனித எண்ணெய்களின் கூட்டு',
    'cat.ghee.name': 'நாட்டு மாட்டு நெய் (பிலோனா)',
    'cat.ghee.benefit': 'பாரம்பரிய மத்து கொண்டு கடையப்பட்ட நாட்டுப்பசு தயிர் நெய்',
    'cat.jaggery.name': 'உடன்குடி பனை கருப்பட்டி',
    'cat.jaggery.benefit': 'இயற்கையான இரும்புச்சத்து மற்றும் தாதுக்கள் நிறைந்த சுத்தமான பனை வெல்லம்',

    // Product Names & Taglines
    'prod.ss-sesame-1000.name': 'SS பிரீமியம் மரச்செக்கு நல்லெண்ணெய்',
    'prod.ss-sesame-1000.tagline': 'இயற்கை பனை கருப்பட்டி சேர்த்து மரச்செக்கில் ஆட்டப்பட்டது',
    'prod.ss-coconut-1000.name': 'SS தூய மரச்செக்கு தேங்காய் எண்ணெய்',
    'prod.ss-coconut-1000.tagline': 'சல்ஃபர் இல்லாத கொப்பரையிலிருந்து எடுக்கப்பட்ட தூய எண்ணெய்',
    'prod.ss-cooking-daily-1000.name': 'SS கோல்ட் தினசரி சமையல் எண்ணெய்',
    'prod.ss-cooking-daily-1000.tagline': 'குறைந்த பிசுபிசுப்பு, குடும்ப ஆரோக்கியத்திற்கான சிறந்த எண்ணெய்',
    'prod.ss-groundnut-1000.name': 'SS மரச்செக்கு கடலை எண்ணெய்',
    'prod.ss-groundnut-1000.tagline': 'பாரம்பரிய வாகை மரச்செக்கில் ஆட்டப்பட்ட மணமிக்க கடலை எண்ணெய்',
    'prod.ss-sunflower-1000.name': 'SS தூய சூரியகாந்தி எண்ணெய்',
    'prod.ss-sunflower-1000.tagline': 'வைட்டமின் E நிறைந்த லேசான சமையல் எண்ணெய்',
    'prod.ss-ricebran-1000.name': 'SS இதய நலம் தரும் தவிட்டு எண்ணெய்',
    'prod.ss-ricebran-1000.tagline': '10,000+ ppm ஒரிசனால் கொலஸ்ட்ரால் சமநிலைக்கு உகந்தது',
    'prod.ss-deepam-1000.name': 'SS பஞ்ச தீப பூஜை எண்ணெய்',
    'prod.ss-deepam-1000.tagline': 'தெய்வீக சாந்தியும் அமைதியும் தரும் 5 புனித எண்ணெய்களின் கூட்டு',
    'prod.ss-ghee-500.name': 'SS நாட்டு மாட்டு பிலோனா நெய்',
    'prod.ss-ghee-500.tagline': 'பாரம்பரிய மத்து கொண்டு கடையப்பட்ட மணமிக்க மணல் நெய்',
    'prod.ss-jaggery-500.name': 'SS உடன்குடி சுத்தமான பனை கருப்பட்டி',
    'prod.ss-jaggery-500.tagline': 'இயற்கை இரும்புச்சத்து நிறைந்த சுத்தமான பனை வெல்லம்',

    // Featured Products (4 items + View All)
    'prod.badge': 'சிறந்த 4 தயாரிப்புகள்',
    'prod.title': 'எங்கள் தூய எண்ணெய்கள் & பொருட்கள்',
    'prod.subtitle': 'சேலத்தில் மரச்செக்கில் ஆட்டப்பட்ட, 100% கலப்படமில்லாத, ஆய்வகப் பரிசோதனை செய்யப்பட்ட தூய எண்ணெய்கள்.',
    'prod.filter': 'வடிகட்ட:',
    'prod.filterAll': 'அனைத்து எண்ணெய்கள்',
    'prod.pure': '100% தூய்மை',
    'prod.mill': 'சேலம் மில்',
    'prod.details': 'விவரங்கள்',
    'prod.labTested': 'ஆய்வக சான்று',
    'prod.available': 'கிடைக்கும் அளவுகள்:',
    'prod.base': 'அடிப்படை',
    'prod.addToCart': 'கார்ட்டில் சேர்',
    'prod.added': 'கார்ட்டில் சேர்க்கப்பட்டது!',
    'prod.selectLiter': 'அளவைத் தேர்ந்தெடுக்கவும்',
    'prod.howManyLiters': 'எத்தனை லிட்டர் வேணும்?',
    'prod.clickPreferred': 'விருப்பமான அளவைத் தொட்டு கார்ட்டில் சேர்க்கவும்',

    // View All Card
    'viewAll.fullRange': 'முழுமையான பட்டியல்',
    'viewAll.products': 'பொருட்கள்',
    'viewAll.moreToExplore': 'மேலும் பார்க்க',
    'viewAll.title': 'அனைத்து தயாரிப்புகள்',
    'viewAll.desc': 'அனைத்து மரச்செக்கு எண்ணெய்கள், பூஜை எண்ணெய் & நெய்யைப் பார்க்கவும்.',
    'viewAll.button': 'அனைத்தையும் காண்க',

    // Promise of Purity
    'promise.badge': 'பியூர்வா பற்றி',
    'promise.title': 'எங்கள் தூய்மையின் வாக்குறுதி',
    'promise.desc': 'பியூர்வாவில், நல்ல ஆரோக்கியம் நாம் சமைக்கும் எண்ணெயிலிருந்து தொடங்குகிறது என நம்புகிறோம். அதனால்தான் விவசாயிகளிடம் இருந்து நேரடியாகப் பெற்று, கலப்படமற்ற தூய எண்ணெய்களை உங்களுக்கு வழங்குகிறோம்.',
    'promise.knowMore': 'மேலும் அறிய',
    'promise.quote': 'உண்மையான எண்ணெய். உண்மையான நலம்.',
    'promise.tagline': 'தூய்மை. ஆரோக்கியம். மகிழ்ச்சி.',

    // Pure Difference
    'diff.badge': 'ஏன் பியூர்வா?',
    'diff.title': 'தூய்மையின் வேறுபாடு',
    'diff.f1.title': 'பாதுகாப்பு ரசாயனங்கள் இல்லை',
    'diff.f1.desc': 'தூய இயற்கை நலம் மட்டும்.',
    'diff.f2.title': 'செயற்கை நிறமூட்டிகள் இல்லை',
    'diff.f2.desc': 'இயற்கையான தெளிவு மற்றும் நிறம்.',
    'diff.f3.title': 'ஊட்டச்சத்துக்கள் நிறைந்தது',
    'diff.f3.desc': 'முழுமையான உடல் நலத்திற்கு உகந்தது.',
    'diff.f4.title': 'குடும்பங்களின் நம்பிக்கை',
    'diff.f4.desc': 'தலைமுறைகளாக நம்பப்படும் தரம்.',

    // Make the Switch Banner
    'switch.quote': 'ஆரோக்கிய சமையல், ஆனந்த வாழ்க்கை',
    'switch.title': 'பியூர்வா தூய எண்ணெய்க்கு மாறுங்கள்',
    'switch.desc': 'சிறந்த எண்ணெய். சிறந்த ஆரோக்கியம். ஒளிமயமான எதிர்காலம்.',
    'switch.shopNow': 'இப்போதே வாங்க',

    // Footer
    'footer.copyright': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.privacy': 'தனியுரிமைக் கொள்கை',
    'footer.terms': 'விதிமுறைகள் & நிபந்தனைகள்',

    // Shop Page
    'shop.badge': 'நேரடி சேலம் ஆலைத் தயாரிப்பு',
    'shop.title': 'மரச்செக்கு & தூய சமையல் எண்ணெய் வகைகள்',
    'shop.subtitle': 'செயற்கை வெப்பமும் ரசாயன நிறமூட்டிகளும் இன்றி மெதுவாக ஆட்டப்பட்ட தூய எண்ணெய்கள். மரச்செக்கு நல்லெண்ணெய், கடலை எண்ணெய், தேங்காய் எண்ணெய் மற்றும் சமையல் எண்ணெய்களைத் தேர்ந்தெடுங்கள்.',
    'shop.searchPlaceholder': 'எண்ணெய் பெயர் அல்லது உணவு மூலம் தேட...',
    'shop.cat.all': 'அனைத்து தூய தயாரிப்புகள்',
    'shop.cat.groundnut': 'கடலை எண்ணெய்',
    'shop.cat.sesame': 'நல்லெண்ணெய்',
    'shop.cat.coconut': 'தேங்காய் எண்ணெய்',
    'shop.cat.cooking': 'சமையல் எண்ணெய்',
    'shop.cat.pooja': 'பூஜை தீப எண்ணெய்',
    'shop.cat.ghee': 'நாட்டு மாட்டு நெய்',
    'shop.cat.jaggery': 'பனை கருப்பட்டி',
    'shop.sortBy': 'வரிசைப்படுத்து:',
    'shop.sort.featured': 'சிறந்தது',
    'shop.sort.priceLow': 'விலை: குறைவிலிருந்து அதிகம்',
    'shop.sort.priceHigh': 'விலை: அதிகத்திலிருந்து குறைவு',
    'shop.sort.rating': 'அதிக மதிப்பீடு',
    'shop.showing': 'காட்டப்படுகிறது:',
    'shop.productsCount': 'தூய தயாரிப்புகள்',
    'shop.noProducts': 'நீங்கள் தேடிய தயாரிப்புகள் எதுவும் கிடைக்கவில்லை.',
    'shop.mrp': 'அசல் விலை',

    // About Page & Section
    'about.heritageBadge': 'சேலம் பாரம்பரியம் • தொடக்கம் 1984',
    'about.heroTitle': 'நான்கு தலைமுறை பாரம்பரிய மரச்செக்கு தூய்மை',
    'about.heroDesc': 'சேலத்தில் ஒரு சிறிய வாகை மரச்செக்கில் தொடங்கப்பட்டு, இன்று குடும்பங்களின் நன்மதிப்பைப் பெற்றுள்ள தூய பாரம்பரிய எண்ணெய் ஆலை.',
    'about.history.title': 'எங்கள் வரலாறு (Our History)',
    'about.history.desc': 'ஒவ்வொரு இல்லத்திற்கும் தரமான சமையல் எண்ணெயை கொண்டு சேர்க்கும் தொலைநோக்குப் பார்வையுடன் எங்கள் பயணம் தொடங்கியது. வாடிக்கையாளர் நம்பிக்கை மற்றும் பாரம்பரிய அர்ப்பணிப்புடன் நாங்கள் தொடர்ந்து வளர்கிறோம்.',
    'about.quality.title': 'தயாரிப்பு தரம் (Product Quality)',
    'about.quality.desc': 'மிகவும் கவனத்துடனும் அக்கறையுடனும் தரமான சமையல் எண்ணெய்களை வழங்கி, உங்கள் அன்றாட சமையலுக்கு ஒரு நம்பகமான தேர்வாக இருக்க உறுதிபூண்டுள்ளோம்.',
    'about.storyBadge': 'SS OIL பற்றி',
    'about.storyTitle': 'தலைமுறை தலைமுறையாக நேர்மையுடன் ஆட்டப்படும் தூய எண்ணெய்',
    'about.storyP1': 'உண்மையான சமையல் உண்மையான தூய எண்ணெயிலிருந்து தொடங்குகிறது என்ற நம்பிக்கையுடன், பாரம்பரிய மரச்செக்கு முறையை பாதுகாத்து வருகிறோம். வாகை மர உரலில் குறைவான வேகத்தில் ஆட்டுவதால் எண்ணெயின் இயல்பான சத்துக்களும் மணமும் முழுமையாகப் பாதுகாக்கப்படுகின்றன.',
    'about.storyP2': 'நாம் அடைக்கும் ஒவ்வொரு துளி எண்ணெயும் 100% கலப்படமில்லாதது, ரசாயனங்கள் அற்றது, ஆய்வகப் பரிசோதனை செய்யப்பட்டது. குடும்ப ஆரோக்கியம் சமையலறையிலிருந்து தொடங்குகிறது.',
    'about.tradHeritage': 'பாரம்பரிய பெருமை',
    'about.vaagaiTitle': 'உண்மையான வாகை மரச்செக்கு',
    'about.vaagaiDesc': 'இயற்கையான வாகை மரம் வெப்பத்தை தணித்து ஊட்டச்சத்துக்கள் சிதையாமல் காக்கிறது.',
    'about.unadulterated': '100% கலப்படமற்றது',
    'about.noDilution': 'மினரல் ஆயில் அல்லது பாமாயில் கலப்படம் இல்லை',
    'about.stat.heritage': 'தொடங்கப்பட்ட ஆண்டு',
    'about.stat.coldPressed': 'மரச்செக்கு தூய்மை',
    'about.stat.experience': 'ஆண்டுகள் அனுபவம்',
    'about.stat.families': 'மகிழ்ச்சியான குடும்பங்கள்',

    // Contact Page
    'contact.badge': 'வாடிக்கையாளர் & மொத்த விற்பனை தொடர்பு',
    'contact.title': 'எங்கள் சேலம் ஆலையை தொடர்பு கொள்ளவும்',
    'contact.subtitle': 'எண்ணெய் தயாரிப்பு முறை, மொத்த 15L டின் ஆர்டர்கள் அல்லது விவசாயிகளிடம் கொள்முதல் குறித்த கேள்விகளுக்கு எங்கள் அலுவலகம் உதவ தயாராக உள்ளது.',
    'contact.officeTitle': 'சேலம் ஆலை & தலைமை அலுவலகம்',
    'contact.locationTitle': 'ஆலை முகவரி',
    'contact.locationDesc': 'SS OIL மில்ஸ் & பேக்கிங் யூனிட், எண். 42 செக்கு தெரு, சிட்கோ தொழிற்பேட்டை, சேலம், தமிழ்நாடு – 636004',
    'contact.phoneTitle': 'தொலைபேசி & வாட்ஸ்அப்',
    'contact.phoneHours': 'திங்கள் – சனி: காலை 9:00 – இரவு 7:30 வரை',
    'contact.emailTitle': 'மின்னஞ்சல் முகவரி',
    'contact.emailDesc': '2 முதல் 4 மணி நேரத்திற்குள் பதில் வழங்கப்படும்',
    'contact.formTitle': 'எங்களுக்கு செய்தி அனுப்பவும்',
    'contact.formName': 'முழு பெயர்',
    'contact.formPhone': 'தொலைபேசி எண்',
    'contact.formEmail': 'மின்னஞ்சல் முகவரி',
    'contact.formType': 'விசாரணை வகை',
    'contact.typeRetail': 'குடும்ப பயன்பாட்டு ஆர்டர்',
    'contact.typeBulk': 'மொத்த & கேட்டரிங் சப்ளை',
    'contact.typeDist': 'விநியோகஸ்தர் / டீலர்ஷிப்',
    'contact.formMessage': 'உங்கள் செய்தி / விவரங்கள்',
    'contact.formSubmit': 'செய்தியை அனுப்பவும்',
    'contact.success': 'நன்றி! உங்கள் செய்தி எங்கள் சேலம் ஆலைக்கு அனுப்பப்பட்டது.',

    // Cart Drawer
    'cart.title': 'உங்கள் ஷாப்பிங் கார்ட்',
    'cart.items': 'பொருட்கள்',
    'cart.freeShippingReached': 'தமிழ்நாடு முழுவதும் இலவச டெலிவரிக்கு தகுதி பெற்றுள்ளீர்கள்!',
    'cart.addMoreForFree': 'இன்னும்',
    'cart.moreForFree': 'சேர்த்தால் இலவச டெலிவரி பெறலாம்!',
    'cart.emptyTitle': 'உங்கள் கார்ட் காலியாக உள்ளது',
    'cart.emptySubtitle': 'எங்கள் தூய மரச்செக்கு எண்ணெய் வகைகளைப் பார்த்து உங்கள் குடும்பத்திற்குத் தேர்ந்தெடுங்கள்.',
    'cart.startShopping': 'வாங்கத் தொடங்குங்கள்',
    'cart.subtotal': 'மொத்தத் தொகை',
    'cart.delivery': 'டெலிவரி கட்டணம்',
    'cart.free': 'இலவசம்',
    'cart.proceedCheckout': 'ஆர்டர் செய்ய தொடரவும்',
    'cart.clearCart': 'கார்ட்டை காலி செய்',

    // Why Us / Health Page
    'whyus.badge': 'தூய்மையின் தரம்',
    'whyus.title': 'குடும்பங்கள் ஏன் SS OIL-ஐத் தேர்ந்தெடுக்கின்றன?',
    'whyus.subtitle': 'கடைகளில் விற்கப்படும் 90%-க்கும் அதிகமான சமையல் எண்ணெய்கள் ரசாயனங்களால் சுத்திகரிக்கப்பட்டு மணம் நீக்கப்பட்டவை. எங்கள் பாரம்பரிய மரச்செக்கு முறையின் தூய அறிவியலை அறிந்து கொள்ளுங்கள்.',
    'whyus.certBadge': 'NABL & FSSAI அங்கீகாரம்',
    'whyus.certTitle': 'ஒவ்வொரு பேட்சுக்கும் ஆய்வகச் சான்று உண்டு',
    'whyus.certDesc': 'குறைந்த கொழுப்பு அமிலம் (< 0.35%), பெராக்சைடு (< 1.8 meq/kg), மற்றும் ரசாயனங்கள் அற்றது என பரிசோதிக்கப்பட்டு உங்கள் குழந்தைகளுக்கு பாதுகாப்பான தூய்மையை வழங்குகிறோம்.',
    'whyus.inspectCert': 'அதிகாரப்பூர்வ ஆய்வகச் சான்றைப் பார்க்க',
    'whyus.shopVerified': 'தூய எண்ணெய்களை வாங்க',

    // Purity Comparison Matrix
    'comparison.badge': 'உண்மைத் தூய்மை',
    'comparison.title': 'சுத்திகரிக்கப்பட்ட எண்ணெய் vs SS OIL மரச்செக்கு',
    'comparison.subtitle': 'உங்கள் குடும்பத்திற்கு வாங்கும் முன் சமையல் எண்ணெயின் உண்மைத் தன்மையை அறிந்து கொள்ளுங்கள்.',
    'comparison.colStandard': 'முக்கிய தர அளவீடு',
    'comparison.colRefined': 'சுத்திகரிக்கப்பட்ட எண்ணெய் (Refined)',
    'comparison.colWoodPressed': 'SS OIL மரச்செக்கு எண்ணெய்',
    'comparison.temp': 'தயாரிப்பு வெப்பநிலை',
    'comparison.tempRefined': '200°C – 240°C அதிக வெப்பத்தில் கொதிக்க வைக்கப்படுகிறது',
    'comparison.tempSS': 'இயற்கையான அறை வெப்பநிலையில் மெதுவாக ஆட்டப்படுகிறது (< 42°C)',
    'comparison.solvents': 'ரசாயன கரைப்பான்கள்',
    'comparison.solventsRefined': 'அதிக அளவு எண்ணெய் எடுக்க ஹெக்சேன் பெட்ரோலிய ரசாயனம் சேர்க்கப்படுகிறது',
    'comparison.solventsSS': 'எந்த ரசாயனமும் இன்றி 100% வாகை மர உரலில் பிழியப்படுகிறது',
    'comparison.bleach': 'பிளீச்சிங் & தெளிவாக்கல்',
    'comparison.bleachRefined': 'கந்தக அமிலம், காஸ்டிக் சோடா மற்றும் சிலிக்கா களிமண் கொண்டு வெளுக்கப்படுகிறது',
    'comparison.bleachSS': '5 நாட்கள் இயற்கையான சூரிய ஒளியில் தங்கித் தெளிய வைக்கப்படுகிறது',
    'comparison.vitE': 'வைட்டமின் E சத்து',
    'comparison.vitERefined': 'அதிக வெப்பத்தில் அனைத்து இயற்கை வைட்டமின்களும் அழிக்கப்படுகின்றன',
    'comparison.vitESS': 'இயற்கை ஆன்டி-ஆக்ஸிடன்ட்கள் மற்றும் வைட்டமின்கள் 100% பாதுகாக்கப்படுகின்றன',
    'comparison.foam': 'நுரை தடுப்பு ரசாயனங்கள்',
    'comparison.foamRefined': 'செயற்கை கெமிக்கல்கள் (E900 போன்றவை) சேர்க்கப்படுகின்றன',
    'comparison.foamSS': 'எந்தவித செயற்கை பாதுகாப்பு ரசாயனமும் சேர்க்கப்படுவதில்லை',
    'comparison.aroma': 'சுவை மற்றும் மணம்',
    'comparison.aromaRefined': 'மணம் நீக்கப்பட்டு சுவையற்ற செயற்கை திரவமாக மாறுகிறது',
    'comparison.aromaSS': 'சமையலறையை மணக்கச் செய்யும் பாரம்பரிய அசல் எண்ணெய் மணம்',

    // About Section extra
    'about.singleOrigin': 'நேரடி விவசாய விதைகள்',
    'about.singleOriginDesc': 'விவசாயிகளிடமிருந்து நேரடியாகப் பெறப்பட்ட முதல் தர கருப்பு எள் மற்றும் கொப்பரைத் தேங்காய்.',
    'about.zeroPreservatives': 'ரசாயனங்கள் அற்றது',
    'about.zeroPreservativesDesc': 'செயற்கை நிறங்கள், நுரை தடுப்பான்கள் மற்றும் ரசாயனங்கள் எதுவும் சேர்க்கப்படுவதில்லை.',
    'about.yearsTrust': 'ஆண்டுகள் நம்பிக்கை',
    'about.satisfiedKitchens': 'மகிழ்ச்சியான குடும்பங்கள்',
    'about.farmSourced': 'நேரடி விவசாயக் கொள்முதல்',

    // Farm Origins Map
    'farm.badge': 'நேரடி விவசாயக் கொள்முதல்',
    'farm.title': 'கிராமத்து மண்ணின் பெருமை',
    'farm.subtitle': 'இடைத்தரகர்கள் இன்றி, தமிழ்நாடு முழுவதும் உள்ள இயற்கை விவசாயிகளிடம் இருந்து நேரடியாக தரமான விதைகளைக் கொள்முதல் செய்கிறோம்.',
    'farm.directOrigin': 'நேரடி உற்பத்தி',

    // Testimonials
    'testim.badge': 'வாடிக்கையாளர் அனுபவம்',
    'testim.title': 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
    'testim.subtitle': 'SS OIL எவ்வாறு பாரம்பரிய கிராமத்து சுவையையும் நல்வாழ்வையும் வீடுகளுக்கு கொண்டு சேர்க்கிறது என்பதை அறியுங்கள்.',
    'testim.verified': 'உறுதிசெய்யப்பட்ட வாடிக்கையாளர்',

    // Quick View Modal
    'quickview.inspectLab': 'ஆய்வக அறிக்கையைப் பார்க்க',
    'quickview.tradGhani': '100% பாரம்பரிய வாகை மரச்செக்கு',
    'quickview.healthHighlights': 'முக்கிய ஆரோக்கிய நன்மைகள்:',
    'quickview.selectPackSize': 'அளவைத் தேர்ந்தெடுக்கவும்:',
    'quickview.addToCart': 'கார்ட்டில் சேர்',
    'quickview.added': 'கார்ட்டில் சேர்க்கப்பட்டது!',

    // Checkout Modal
    'checkout.title': 'உடனடி ஆர்டர்',
    'checkout.subtitle': 'சேலம் ஆலையிலிருந்து உங்கள் வீட்டு வாசலுக்கு நேரடி டெலிவரி',
    'checkout.step1': '1. டெலிவரி முகவரி',
    'checkout.step2': '2. பணம் செலுத்தும் முறை',
    'checkout.name': 'முழு பெயர்',
    'checkout.phone': 'மொபைல் எண்',
    'checkout.email': 'மின்னஞ்சல் முகவரி',
    'checkout.address': 'கதவு எண் & தெரு முகவரி',
    'checkout.city': 'ஊர் / நகரம்',
    'checkout.state': 'மாநிலம்',
    'checkout.pincode': 'பின்கோடு (6-இலக்கம்)',
    'checkout.upi': 'UPI மூலம் உடனடியாக (GPay / PhonePe / Paytm / QR)',
    'checkout.cod': 'பொருளைப் பெற்று பணம் செலுத்தவும் (COD)',
    'checkout.card': 'டெபிட் / கிரெடிட் கார்டு / நெட் பேங்கிங்',
    'checkout.orderSummary': 'ஆர்டர் விவரங்கள்',
    'checkout.items': 'பொருட்கள்',
    'checkout.subtotal': 'மொத்தத் தொகை',
    'checkout.delivery': 'விரைவு டெலிவரி',
    'checkout.free': 'இலவசம்',
    'checkout.total': 'செலுத்த வேண்டிய தொகை',
    'checkout.placeOrder': 'ஆர்டரை உறுதி செய்க',

    // Search Modal
    'search.placeholder': 'எண்ணெய் பெயர், உணவு அல்லது நன்மைகள் மூலம் தேட...',
    'search.quick': 'விரைவுத் தேடல்கள்:',
    'search.noResults': 'தேடிய முடிவுகள் எதுவும் கிடைக்கவில்லை:',
    'search.clear': 'அழி',

    // About Page - User Content & Expansions
    'about.history.title': 'எங்கள் வரலாறு',
    'about.history.desc': 'ஒவ்வொரு வீட்டிற்கும் தரமான சமையல் எண்ணெயைக் கொண்டு சேர்க்கும் தொலைநோக்குப் பார்வையுடன் எங்கள் பயணம் தொடங்கியது. வாடிக்கையாளர் நம்பிக்கை மற்றும் பாரம்பரியத்தின் மீதான அர்ப்பணிப்புடன் நாங்கள் தொடர்ந்து வளர்ந்து வருகிறோம்.',
    'about.history.p1.title': 'பாரம்பரிய வேர்கள்',
    'about.history.p1.desc': 'ஆரோக்கியமான வாழ்விற்காக முன்னோர்களின் பாரம்பரிய மரச்செக்கு எண்ணெய் தயாரிப்பு முறையை மீட்டெடுக்கிறோம்.',
    'about.history.p2.title': 'விவசாயிகளுடன் நேரடி தொடர்பு',
    'about.history.p2.desc': 'இயற்கையாகக் காயவைக்கப்பட்ட எள், தேங்காய் மற்றும் நிலக்கடலைகளை விவசாயிகளிடம் இருந்து நேரடியாகப் பெறுகிறோம்.',
    'about.history.p3.title': 'தலைமுறை நம்பிக்கை',
    'about.history.p3.desc': 'வாடிக்கையாளர்களின் அசைக்க முடியாத நம்பிக்கை மற்றும் வாய்மொழிப் புகழால் கட்டமைக்கப்பட்ட வளர்ச்சி.',

    'about.quality.title': 'தயாரிப்பு தரம்',
    'about.quality.desc': 'உங்கள் அன்றாட சமையலுக்கு ஒரு நம்பகமான தேர்வாக அமையும் வகையில், மிகுந்த கவனத்துடனும் அக்கறையுடனும் தரமான சமையல் எண்ணெய்களை வழங்குவதில் நாங்கள் கவனம் செலுத்துகிறோம்.',
    'about.quality.p1.title': '100% மரச்செக்கு முறை',
    'about.quality.p1.desc': 'செயற்கை வெப்பமின்றி 42°C-க்குக் கீழ் மெதுவாக ஆட்டப்பட்டு, இயற்கை ஊட்டச்சத்துக்கள் மற்றும் மணம் பாதுகாக்கப்படுகிறது.',
    'about.quality.p2.title': 'ரசாயன சுத்திகரிப்பு இல்லை',
    'about.quality.p2.desc': 'ஹெக்ஸேன், காஸ்டிக் சோடா மற்றும் எந்தவித செயற்கை பதனப் பொருட்களும் சேர்க்கப்படுவதில்லை.',
    'about.quality.p3.title': 'ஆய்வகப் பரிசோதனை',
    'about.quality.p3.desc': 'ஒவ்வொரு தயாரிப்பும் தரம் மற்றும் தூய்மைக்காக முறையாகப் பரிசோதிக்கப்பட்ட பிறகே பாட்டில்களில் அடைக்கப்படுகிறது.',

    // Vision & Mission
    'about.vision.badge': 'எங்கள் எதிர்காலம்',
    'about.vision.title': 'எங்கள் தொலைநோக்குப் பார்வை',
    'about.vision.desc': 'ஒவ்வொரு வீட்டிலும் தூய, ஊட்டச்சத்து நிறைந்த சமையல் எண்ணெய்களைக் கொண்டு சேர்த்து, எதிர்கால சந்ததியினரை கலப்பட எண்ணெய்களிலிருந்து பாதுகாத்து நல்வாழ்வை உறுதி செய்வது.',

    'about.mission.badge': 'எங்கள் நோக்கம்',
    'about.mission.title': 'எங்கள் நோக்கம்',
    'about.mission.desc': 'விவசாயிகள் முதல் சமையலறை வரை வெளிப்படையான நேர்மையைக் கடைப்பிடித்து, பாரம்பரிய மரச்செக்கு முறையைப் பாதுகாத்து, நியாயமான விலையில் தூய எண்ணெய்களை வழங்குவது.',

    // 4 Purity Pillars
    'about.pillars.badge': 'பியூர்வா தூய்மைத் தரம்',
    'about.pillars.title': 'எங்கள் எண்ணெய்களின் தனிச்சிறப்பு',
    'about.pillars.subtitle': 'தேர்ந்தெடுக்கப்பட்ட விதைகள் முதல் இயற்கையான வண்டல் முறை வரை, தூய்மைக்கு நாங்கள் தரும் 100% உத்தரவாதம்.',
    'about.pill.1.title': 'உயர்தர நாட்டு விதைகள்',
    'about.pill.1.desc': 'முதல் தரமான கறுப்பு எள், நிலக்கடலை மற்றும் தேங்காய்ப் பருப்புகள் மட்டுமே பயன்படுத்தப்படுகின்றன.',
    'about.pill.2.title': 'வாகை மரச்செக்கு தயாரிப்பு',
    'about.pill.2.desc': 'மெதுவான மரச்செக்கு ஆட்டல் மூலம் வெப்பம் தவிர்க்கப்பட்டு, இயற்கை வைட்டமின்களும் நறுமணமும் பாதுகாக்கப்படுகின்றன.',
    'about.pill.3.title': 'சூரிய ஒளி வண்டல் முறை',
    'about.pill.3.desc': 'செயற்கை வடிகட்டி ரசாயனங்களின்றி, 5 நாட்கள் இயற்கையான சூரிய ஒளியில் வண்டல் படிய வைக்கப்படுகிறது.',
    'about.pill.4.title': 'பாதுகாப்பான புதிய பேக்கிங்',
    'about.pill.4.desc': 'உணவுத் தரம் வாய்ந்த பாட்டில்களில் சுகாதாரமாக அடைக்கப்பட்டு, புதிய நறுமணத்துடன் உங்கள் இல்லத்திற்கு அனுப்பப்படுகிறது.',

    'about.exploreOils': 'எங்கள் தயாரிப்புகளைக் காண்க',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ssoil_lang');
      if (saved === 'ta' || saved === 'en') return saved;
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ssoil_lang', lang);
    } catch (e) {}
  };

  const t = (key: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
