import { prisma } from './config/db.js';

async function seed() {
  console.log('🌱 Starting SS OIL database seed...');

  // 1. Clean existing records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productPackSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  // 2. Create Categories
  const catCooking = await prisma.category.create({
    data: {
      slug: 'cooking-oil',
      name: 'Cooking Oil',
      description: 'Everyday Light & Healthy Blends',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSesame = await prisma.category.create({
    data: {
      slug: 'sesame-oil',
      name: 'Sesame Oil',
      description: 'Traditional Gingelly Oil with Palm Jaggery',
      image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catGroundnut = await prisma.category.create({
    data: {
      slug: 'groundnut-oil',
      name: 'Groundnut Oil',
      description: '100% Mara Chekku Peanut Oil',
      image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catCoconut = await prisma.category.create({
    data: {
      slug: 'coconut-oil',
      name: 'Coconut Oil',
      description: 'Cold-Pressed Virgin Copra Oil',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('✅ Created 4 categories.');

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

  console.log('✅ Created 4 products with pack sizes and lab reports.');
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
