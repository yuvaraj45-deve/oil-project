import { prisma } from './config/db.js';

async function seed() {
  console.log('🌱 Checking SS OIL database seed status...');

  // Always clean and reseed to ensure full 9-product catalog is up-to-date
  console.log('🌱 Seeding complete 9-product catalog...');

  // 1. Clean existing records (if any partial)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productPackSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  // 2. Create Categories
  const catCooking = await prisma.category.upsert({
    where: { slug: 'cooking-oil' },
    update: {},
    create: {
      slug: 'cooking-oil',
      name: 'Cooking Oil',
      description: 'Everyday Light & Healthy Blends',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSesame = await prisma.category.upsert({
    where: { slug: 'sesame-oil' },
    update: {},
    create: {
      slug: 'sesame-oil',
      name: 'Sesame Oil',
      description: 'Traditional Gingelly Oil with Palm Jaggery',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catGroundnut = await prisma.category.upsert({
    where: { slug: 'groundnut-oil' },
    update: {},
    create: {
      slug: 'groundnut-oil',
      name: 'Groundnut Oil',
      description: '100% Mara Chekku Peanut Oil',
      image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catCoconut = await prisma.category.upsert({
    where: { slug: 'coconut-oil' },
    update: {},
    create: {
      slug: 'coconut-oil',
      name: 'Coconut Oil',
      description: 'Cold-Pressed Virgin Copra Oil',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catPooja = await prisma.category.upsert({
    where: { slug: 'pooja-special' },
    update: {},
    create: {
      slug: 'pooja-special',
      name: 'Pooja Deepam Oil',
      description: 'Sacred 5 Sacred Oils Blend for Divine Positivity',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catGhee = await prisma.category.upsert({
    where: { slug: 'a2-desi-ghee' },
    update: {},
    create: {
      slug: 'a2-desi-ghee',
      name: 'A2 Cow Ghee',
      description: 'Traditional Bilona Curd Churned Pure Ghee',
      image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catJaggery = await prisma.category.upsert({
    where: { slug: 'palm-jaggery-special' },
    update: {},
    create: {
      slug: 'palm-jaggery-special',
      name: 'Palm Jaggery',
      description: 'Traditional Unrefined Udangudi Karupatti',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catMustard = await prisma.category.upsert({
    where: { slug: 'mustard-oil' },
    update: {},
    create: {
      slug: 'mustard-oil',
      name: 'Mustard Oil',
      description: 'Pungent Cold-Pressed Mustard Oil',
      image: '/showcase/showcase_groundnut.png',
    },
  });

  console.log('✅ Created / Verified all categories.');

  // 3. Create Products & Pack Sizes
  const p1 = await prisma.product.create({
    data: {
      name: 'SS Mara Chekku Groundnut Oil',
      slug: 'ss-mara-chekku-groundnut-oil',
      tagline: 'Traditional Wood-Pressed Groundnut Oil with Authentic Aroma',
      description: 'Crafted using hand-picked native groundnuts crushed slowly in traditional Vaagai wood presses (Mara Chekku).',
      price: 340,
      originalPrice: 420,
      discountPercent: 19,
      defaultPack: '1 Litre Bottle',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      badge: 'Bestseller',
      smokePoint: '232°C (High Smoke Point)',
      extractionMethod: 'Traditional Vaagai Mara Chekku (Wood-Pressed)',
      categoryId: catGroundnut.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 180, originalPrice: 220 },
          { packSize: '1 Litre Bottle', price: 340, originalPrice: 420 },
          { packSize: '2 Litre Can', price: 670, originalPrice: 830 },
          { packSize: '5 Litre Tin', price: 1650, originalPrice: 2050 },
        ],
      },
      labReports: {
        create: {
          batchNumber: 'SS-GND-2026-H14',
          testedDate: '12-Oct-2026',
          acidValue: '0.34 mg KOH/g (Permissible < 4.0)',
          peroxideValue: '1.18 meq O2/kg (Permissible < 10.0)',
          hexaneResidue: '0.00 ppm (Zero Chemical Solvents)',
          freeFattyAcids: '0.17% (Extra Virgin Grade)',
          iodineValue: '91.2 g I2/100g',
          tocopherolVitaminE: '22.8 mg / 100g (Naturally Intact)',
          certification: 'FSSAI & Agmark Grade I Verified',
        },
      },
      reviews: {
        create: [
          {
            author: 'Priya Sundaram',
            location: 'Chennai',
            rating: 5,
            comment: 'The aroma of SS Groundnut Oil reminds me of the traditional oils my grandmother pressed in our village.',
          },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'SS Premium Wood-Pressed Sesame Oil',
      slug: 'ss-premium-wood-pressed-sesame-oil',
      tagline: 'Gingelly Oil slow-pressed with Natural Palm Jaggery',
      description: 'Extracted from clean black sesame seeds blended with organic palm jaggery (Karupatti) to tame bitterness.',
      price: 395,
      originalPrice: 480,
      discountPercent: 18,
      defaultPack: '1 Litre Bottle',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
      badge: 'Wood-Pressed',
      smokePoint: '210°C (Medium-High Smoke Point)',
      extractionMethod: 'Wooden Ghani with Pure Palm Jaggery',
      categoryId: catSesame.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 210, originalPrice: 250 },
          { packSize: '1 Litre Bottle', price: 395, originalPrice: 480 },
          { packSize: '2 Litre Bottle', price: 780, originalPrice: 950 },
          { packSize: '5 Litre Can', price: 1920, originalPrice: 2350 },
        ],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'SS Pure Cold-Pressed Coconut Oil',
      slug: 'ss-pure-cold-pressed-coconut-oil',
      tagline: 'Raw Extra-Virgin Oil from Sulphur-Free Sun-Dried Copra',
      description: 'Extracted from naturally sun-dried coconut copra sourced directly from coastal farms.',
      price: 320,
      originalPrice: 390,
      discountPercent: 18,
      defaultPack: '1 Litre Glass Jar',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      badge: '100% Pure',
      smokePoint: '177°C (Gentle Cooking & Baking)',
      extractionMethod: 'Gentle Cold-Pressed (Below 38°C)',
      categoryId: catCoconut.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 170, originalPrice: 210 },
          { packSize: '1 Litre Glass Jar', price: 320, originalPrice: 390 },
          { packSize: '2 Litre Can', price: 630, originalPrice: 770 },
          { packSize: '5 Litre Can', price: 1550, originalPrice: 1900 },
        ],
      },
    },
  });

  const p4 = await prisma.product.create({
    data: {
      name: 'SS Gold Everyday Pure Cooking Oil',
      slug: 'ss-gold-everyday-pure-cooking-oil',
      tagline: 'Light, Balanced & Nutrient-Rich Oil for Modern Kitchens',
      description: 'Specially created for modern Indian households looking for non-sticky, heart-friendly everyday cooking.',
      price: 210,
      originalPrice: 260,
      discountPercent: 19,
      defaultPack: '1 Litre Bottle',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      badge: 'Popular',
      smokePoint: '240°C (High Smoke Point for Deep Fry)',
      extractionMethod: 'Physical Cold Refining & Micro-Filtration',
      categoryId: catCooking.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '1 Litre Pouch', price: 195, originalPrice: 240 },
          { packSize: '1 Litre Bottle', price: 210, originalPrice: 260 },
          { packSize: '5 Litre Can', price: 1020, originalPrice: 1250 },
          { packSize: '15 Litre Tin', price: 2950, originalPrice: 3600 },
        ],
      },
    },
  });

  const p5 = await prisma.product.create({
    data: {
      name: 'SS Pure Light Sunflower Oil',
      slug: 'ss-pure-light-sunflower-oil',
      tagline: 'Light, Pure & Vitamin E Enriched for Modern Health',
      description: 'Extracted from premium sunflower seeds. Extremely light and non-greasy, retaining natural vitamins for guilt-free family meals.',
      price: 210,
      originalPrice: 260,
      discountPercent: 19,
      defaultPack: '1 Litre Bottle',
      image: '/products/sunflower_oil.jpg',
      badge: 'Light & Pure',
      smokePoint: '225°C (Great for Deep Frying)',
      extractionMethod: 'Gentle Cold Micro-Filtration',
      categoryId: catCooking.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 115, originalPrice: 140 },
          { packSize: '1 Litre Bottle', price: 210, originalPrice: 260 },
          { packSize: '5 Litre Can', price: 1020, originalPrice: 1250 },
        ],
      },
    },
  });

  const p6 = await prisma.product.create({
    data: {
      name: 'SS Heart-Care Pure Rice Bran Oil',
      slug: 'ss-heart-care-pure-rice-bran-oil',
      tagline: 'Physically Refined with 10,000+ ppm Natural Gamma Oryzanol',
      description: 'Extracted from the nutrient-rich golden outer layer of brown rice grains. Packed with Gamma Oryzanol clinically known to help maintain healthy cholesterol.',
      price: 195,
      originalPrice: 240,
      discountPercent: 18,
      defaultPack: '1 Litre Bottle',
      image: '/products/rice_bran_oil.jpg',
      badge: 'Heart Care',
      smokePoint: '250°C (Highest Smoke Point)',
      extractionMethod: 'Physical Cold Refining & De-waxing',
      categoryId: catCooking.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 110, originalPrice: 130 },
          { packSize: '1 Litre Bottle', price: 195, originalPrice: 240 },
          { packSize: '5 Litre Can', price: 950, originalPrice: 1180 },
        ],
      },
    },
  });

  const p7 = await prisma.product.create({
    data: {
      name: 'SS Pancha Deepam Pooja Oil',
      slug: 'ss-pancha-deepam-pooja-oil',
      tagline: 'Sacred 5-Oil Blend Infused with Sugandha Herbs for Divine Peace',
      description: 'Blended according to ancient Vedic scriptures combining 5 sacred oils (Gingelly, Mahua, Castor, Neem, and Pure Cow Ghee). Burns brighter with a lingering sacred aroma.',
      price: 260,
      originalPrice: 320,
      discountPercent: 19,
      defaultPack: '1 Litre Bottle',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
      badge: 'Temple Pooja',
      smokePoint: '190°C (Lamp Burning Grade)',
      extractionMethod: 'Traditional Sacred Cold Herbal Blend',
      categoryId: catPooja.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500 ml Bottle', price: 140, originalPrice: 170 },
          { packSize: '1 Litre Bottle', price: 260, originalPrice: 320 },
        ],
      },
    },
  });

  const p8 = await prisma.product.create({
    data: {
      name: 'SS A2 Cultured Desi Cow Ghee',
      slug: 'ss-a2-cultured-desi-cow-ghee',
      tagline: 'Traditional Bilona Method from Native Bos Indicus Cow Milk',
      description: 'Handcrafted following the traditional 5-step Bilona method: curdling whole A2 cow milk, bi-directional churning, and slow firewood simmering for authentic golden granular Danedaar texture.',
      price: 450,
      originalPrice: 520,
      discountPercent: 13,
      defaultPack: '500 ml Jar',
      image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
      badge: 'Bilona Pure',
      smokePoint: '252°C (Extremely High Smoke Point)',
      extractionMethod: 'Traditional Clay Pot & Wooden Bilona Churn',
      categoryId: catGhee.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '250 ml Jar', price: 240, originalPrice: 280 },
          { packSize: '500 ml Jar', price: 450, originalPrice: 520 },
          { packSize: '1 Litre Jar', price: 880, originalPrice: 1020 },
        ],
      },
    },
  });

  const p9 = await prisma.product.create({
    data: {
      name: 'SS Pure Udangudi Palm Jaggery (Karupatti)',
      slug: 'ss-pure-udangudi-palm-jaggery-karupatti',
      tagline: 'Traditional Unrefined Palm Nectar Block Packed with Natural Iron',
      description: 'Authentic palm jaggery (Karupatti) made by traditional wood-fire boiling of fresh palm nectar without bone-char or chemical clarifiers.',
      price: 160,
      originalPrice: 200,
      discountPercent: 20,
      defaultPack: '500g Block',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
      badge: 'Native Pure',
      smokePoint: 'Natural Unrefined Sweetener',
      extractionMethod: 'Traditional Palm Nectar Fire Boiling',
      categoryId: catJaggery.id,
      featured: true,
      packSizes: {
        create: [
          { packSize: '500g Block', price: 160, originalPrice: 200 },
          { packSize: '1 kg Block', price: 310, originalPrice: 390 },
        ],
      },
    },
  });

  console.log('✅ Created 9 products with complete pack sizes and categories.');
  console.log('🌾 SS OIL Database successfully seeded!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
