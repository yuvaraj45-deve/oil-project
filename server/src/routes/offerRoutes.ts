import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = typeof __dirname !== 'undefined'
  ? path.resolve(__dirname, '../../data')
  : path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}
const BACKUP_FILE = path.join(DATA_DIR, 'offers_data.json');

export const offerRouter = Router();

export interface OfferRecord {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  imageUrl?: string | null;
  applicableProducts?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  usageCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Default initial offers
const INITIAL_OFFERS: OfferRecord[] = [
  {
    id: 'offer-1',
    title: '10% OFF on First Order',
    description: 'Welcome offer for new customers on pure cold-pressed native Mara Chekku oils.',
    code: 'FIRST10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 150,
    imageUrl: '/products/groundnut_oil.jpg',
    applicableProducts: 'All Wood-Pressed Oils (Sesame, Groundnut, Coconut)',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 142,
  },
  {
    id: 'offer-2',
    title: '15% OFF on Orders Above ₹1000',
    description: 'Stock up your family pantry with authentic wood-pressed oils. Save 15% instantly.',
    code: 'SAVE15',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 1000,
    maxDiscount: 300,
    imageUrl: '/products/sesame_oil.jpg',
    applicableProducts: 'All 1L & 2L Family Packs & Bottles',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 389,
  },
  {
    id: 'offer-3',
    title: '20% OFF on Bulk Orders',
    description: 'Flat 20% off on 5 Litre cans, 15 Litre tins, and combo packages.',
    code: 'BULK20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 2500,
    maxDiscount: 750,
    imageUrl: '/products/ss_oil_can.jpg',
    applicableProducts: '5L Heavy-Duty Cans & 15L Commercial Tins',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 96,
  },
  {
    id: 'offer-4',
    title: '100% Free Express Delivery',
    description: 'Special express mill-to-doorstep shipping waiver for all orders across Tamil Nadu.',
    code: 'FREEDEL',
    discountType: 'FREE_DELIVERY',
    discountValue: 50,
    minOrderValue: 0,
    maxDiscount: 50,
    imageUrl: '/banners/ssoil_bottling_hero_banner.jpg',
    applicableProducts: 'All Store Products (Tamil Nadu Express Delivery)',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2027-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 512,
  },
  {
    id: 'offer-5',
    title: 'Flat ₹100 OFF Heritage Special',
    description: 'Flat ₹100 direct deduction celebrating traditional Vaagai wood ghani pressing.',
    code: 'VAAGAI100',
    discountType: 'FIXED',
    discountValue: 100,
    minOrderValue: 1299,
    maxDiscount: null,
    imageUrl: '/products/coconut_oil.jpg',
    applicableProducts: 'Heritage Cold-Pressed Ghee & Oils Trio',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 78,
  },
  {
    id: 'offer-6',
    title: '18% OFF on Festival Combos',
    description: 'Special combo savings on Sesame, Groundnut and Coconut pure oils in celebratory box.',
    code: 'FESTIVECOMBO',
    discountType: 'PERCENTAGE',
    discountValue: 18,
    minOrderValue: 1800,
    maxDiscount: 500,
    imageUrl: '/banners/groundnut_hero_banner.jpg',
    applicableProducts: 'Mara Chekku Heritage Trio (Sesame + Groundnut + Coconut)',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 65,
  },
  {
    id: 'offer-7',
    title: 'Buy 2 Get 1 Free Mara Chekku Deal',
    description: 'Buy 2 bottles of 1L Sesame Oil and get 1L Coconut Oil Free (33% equivalent combo discount).',
    code: 'B2G1FREE',
    discountType: 'PERCENTAGE',
    discountValue: 33,
    minOrderValue: 1100,
    maxDiscount: 360,
    imageUrl: '/banners/sesame_sunflower_banner.jpg',
    applicableProducts: 'Mara Chekku Sesame 1L & Coconut Oil 1L',
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    usageCount: 115,
  },
];

// Helper: Backup to local JSON
const writeBackup = (offers: OfferRecord[]) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(offers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write offers backup:', err);
  }
};

const readBackup = (): OfferRecord[] => {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = fs.readFileSync(BACKUP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read offers backup:', err);
  }
  return INITIAL_OFFERS;
};

// Ensure TiDB Table Exists
let isTableReady = false;
export async function ensureOfferTableExists(): Promise<void> {
  if (isTableReady) return;
  try {
    // 1. Create table in TiDB if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Offer\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`code\` VARCHAR(100) NOT NULL UNIQUE,
        \`discountType\` VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
        \`discountValue\` DOUBLE NOT NULL DEFAULT 0,
        \`minOrderValue\` DOUBLE NOT NULL DEFAULT 0,
        \`maxDiscount\` DOUBLE NULL,
        \`imageUrl\` LONGTEXT NULL,
        \`applicableProducts\` TEXT NULL,
        \`startDate\` DATETIME(3) NOT NULL,
        \`endDate\` DATETIME(3) NOT NULL,
        \`isActive\` BOOLEAN NOT NULL DEFAULT true,
        \`usageCount\` INT NOT NULL DEFAULT 0,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe column migration for applicableProducts if table existed before
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`Offer\` ADD COLUMN \`applicableProducts\` TEXT NULL`);
    } catch {}

    // 2. Check if table has rows; if not, seed initial offers
    const countResult: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM \`Offer\``);
    const count = Number(countResult?.[0]?.count || 0);

    if (count === 0) {
      console.log('Seeding initial offers in TiDB...');
      for (const item of INITIAL_OFFERS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO \`Offer\` (\`id\`, \`title\`, \`description\`, \`code\`, \`discountType\`, \`discountValue\`, \`minOrderValue\`, \`maxDiscount\`, \`imageUrl\`, \`applicableProducts\`, \`startDate\`, \`endDate\`, \`isActive\`, \`usageCount\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          item.id,
          item.title,
          item.description,
          item.code,
          item.discountType,
          item.discountValue,
          item.minOrderValue,
          item.maxDiscount || null,
          item.imageUrl || null,
          item.applicableProducts || 'All Products',
          new Date(item.startDate),
          new Date(item.endDate),
          item.isActive,
          item.usageCount
        );
      }
    } else {
      // Ensure missing default offers exist and existing offers have imageUrl and applicableProducts
      for (const item of INITIAL_OFFERS) {
        try {
          const existing: any = await prisma.$queryRawUnsafe(
            `SELECT \`id\`, \`imageUrl\`, \`applicableProducts\` FROM \`Offer\` WHERE \`code\` = ?`,
            item.code
          );
          if (!existing || existing.length === 0) {
            await prisma.$executeRawUnsafe(
              `INSERT INTO \`Offer\` (\`id\`, \`title\`, \`description\`, \`code\`, \`discountType\`, \`discountValue\`, \`minOrderValue\`, \`maxDiscount\`, \`imageUrl\`, \`applicableProducts\`, \`startDate\`, \`endDate\`, \`isActive\`, \`usageCount\`)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              item.id,
              item.title,
              item.description,
              item.code,
              item.discountType,
              item.discountValue,
              item.minOrderValue,
              item.maxDiscount || null,
              item.imageUrl || null,
              item.applicableProducts || 'All Products',
              new Date(item.startDate),
              new Date(item.endDate),
              item.isActive,
              item.usageCount
            );
          } else {
            const row = existing[0];
            if (!row.imageUrl || !row.applicableProducts) {
              await prisma.$executeRawUnsafe(
                `UPDATE \`Offer\` SET \`imageUrl\` = COALESCE(\`imageUrl\`, ?), \`applicableProducts\` = COALESCE(\`applicableProducts\`, ?) WHERE \`id\` = ?`,
                item.imageUrl || null,
                item.applicableProducts || 'All Products',
                row.id
              );
            }
          }
        } catch (syncErr) {
          console.warn('Sync offer record note:', (syncErr as Error).message);
        }
      }
    }
    isTableReady = true;
    console.log('✅ TiDB Offer table initialized successfully.');
  } catch (error) {
    console.warn('Note on TiDB Offer table setup:', (error as Error).message);
    // If TiDB table setup had issues, backup cache ensures 100% operation
    if (!fs.existsSync(BACKUP_FILE)) {
      writeBackup(INITIAL_OFFERS);
    }
  }
}

// Initialize on module load
ensureOfferTableExists().catch(console.error);

// -------------------------------------------------------------
// 1. GET /api/offers - Fetch all offers with search and filter
// -------------------------------------------------------------
offerRouter.get('/', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { activeOnly, search, status, discountType } = req.query;

    let offers: OfferRecord[] = [];

    try {
      const dbOffers: any = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`Offer\` ORDER BY \`createdAt\` DESC`
      );
      offers = dbOffers.map((o: any) => ({
        ...o,
        isActive: Boolean(o.isActive),
        startDate: o.startDate,
        endDate: o.endDate,
      }));
      writeBackup(offers);
    } catch (dbErr) {
      console.warn('Falling back to local backup for offers list:', (dbErr as Error).message);
      offers = readBackup();
    }

    const now = new Date();

    // Map dynamic status property
    let enriched = offers.map((o) => {
      const start = new Date(o.startDate);
      const end = new Date(o.endDate);
      let dynamicStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'UPCOMING' = 'ACTIVE';

      if (!o.isActive) {
        dynamicStatus = 'INACTIVE';
      } else if (now > end) {
        dynamicStatus = 'EXPIRED';
      } else if (now < start) {
        dynamicStatus = 'UPCOMING';
      } else {
        dynamicStatus = 'ACTIVE';
      }

      return {
        ...o,
        status: dynamicStatus,
      };
    });

    // Filter activeOnly (for customer-facing storefront)
    if (activeOnly === 'true') {
      enriched = enriched.filter((o) => o.status === 'ACTIVE');
    }

    // Status filter
    if (status && status !== 'ALL') {
      enriched = enriched.filter((o) => o.status === (status as string).toUpperCase());
    }

    // Discount type filter
    if (discountType && discountType !== 'ALL') {
      enriched = enriched.filter(
        (o) => o.discountType.toUpperCase() === (discountType as string).toUpperCase()
      );
    }

    // Search filter
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      enriched = enriched.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.code.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve offers',
      error: (error as Error).message,
    });
  }
});

// -------------------------------------------------------------
// 2. GET /api/offers/:id - Fetch single offer
// -------------------------------------------------------------
offerRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { id } = req.params;

    let offer: OfferRecord | null = null;
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`Offer\` WHERE \`id\` = ? OR \`code\` = ? LIMIT 1`,
        id,
        id.toUpperCase()
      );
      if (rows && rows.length > 0) {
        offer = { ...rows[0], isActive: Boolean(rows[0].isActive) };
      }
    } catch {
      const backup = readBackup();
      offer = backup.find((o) => o.id === id || o.code.toUpperCase() === id.toUpperCase()) || null;
    }

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({ success: true, data: offer });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

// -------------------------------------------------------------
// 3. POST /api/offers - Create new offer
// -------------------------------------------------------------
offerRouter.post('/', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const {
      title,
      description,
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      imageUrl,
      applicableProducts,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!title || !code || discountValue === undefined || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, Coupon Code, Discount Value, and Expiry Date are required.',
      });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleanCode.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code must be at least 2 alphanumeric characters.',
      });
    }

    const applicableStr = Array.isArray(applicableProducts)
      ? applicableProducts.join(', ')
      : (applicableProducts || 'All Products');

    const newOffer: OfferRecord = {
      id: `offer-${Date.now()}`,
      title: title.trim(),
      description: (description || '').trim(),
      code: cleanCode,
      discountType: (discountType || 'PERCENTAGE').toUpperCase(),
      discountValue: Number(discountValue) || 0,
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      imageUrl: imageUrl || null,
      applicableProducts: applicableStr,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      usageCount: 0,
    };

    try {
      // Check existing code in DB
      const existing: any = await prisma.$queryRawUnsafe(
        `SELECT \`id\` FROM \`Offer\` WHERE \`code\` = ? LIMIT 1`,
        cleanCode
      );
      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Coupon code '${cleanCode}' already exists. Please choose a different code.`,
        });
      }

      await prisma.$executeRawUnsafe(
        `INSERT INTO \`Offer\` (\`id\`, \`title\`, \`description\`, \`code\`, \`discountType\`, \`discountValue\`, \`minOrderValue\`, \`maxDiscount\`, \`imageUrl\`, \`applicableProducts\`, \`startDate\`, \`endDate\`, \`isActive\`, \`usageCount\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newOffer.id,
        newOffer.title,
        newOffer.description,
        newOffer.code,
        newOffer.discountType,
        newOffer.discountValue,
        newOffer.minOrderValue,
        newOffer.maxDiscount,
        newOffer.imageUrl,
        newOffer.applicableProducts,
        newOffer.startDate,
        newOffer.endDate,
        newOffer.isActive,
        newOffer.usageCount
      );
    } catch (dbErr) {
      console.warn('DB Insert issue, updating local backup:', (dbErr as Error).message);
    }

    // Always update backup cache
    const currentList = readBackup();
    const updatedList = [newOffer, ...currentList.filter((o) => o.code !== cleanCode)];
    writeBackup(updatedList);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully!',
      data: newOffer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create offer',
      error: (error as Error).message,
    });
  }
});

// -------------------------------------------------------------
// 4. PUT /api/offers/:id - Update existing offer
// -------------------------------------------------------------
offerRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { id } = req.params;
    const {
      title,
      description,
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      imageUrl,
      applicableProducts,
      startDate,
      endDate,
      isActive,
    } = req.body;

    const cleanCode = code ? code.trim().toUpperCase() : undefined;
    const applicableStr = applicableProducts !== undefined
      ? (Array.isArray(applicableProducts) ? applicableProducts.join(', ') : applicableProducts)
      : undefined;

    try {
      if (cleanCode) {
        // Ensure no other offer has this code
        const dup: any = await prisma.$queryRawUnsafe(
          `SELECT \`id\` FROM \`Offer\` WHERE \`code\` = ? AND \`id\` != ? LIMIT 1`,
          cleanCode,
          id
        );
        if (dup && dup.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Coupon code '${cleanCode}' is already taken by another offer.`,
          });
        }
      }

      await prisma.$executeRawUnsafe(
        `UPDATE \`Offer\` SET
           \`title\` = COALESCE(?, \`title\`),
           \`description\` = COALESCE(?, \`description\`),
           \`code\` = COALESCE(?, \`code\`),
           \`discountType\` = COALESCE(?, \`discountType\`),
           \`discountValue\` = COALESCE(?, \`discountValue\`),
           \`minOrderValue\` = COALESCE(?, \`minOrderValue\`),
           \`maxDiscount\` = ?,
           \`imageUrl\` = COALESCE(?, \`imageUrl\`),
           \`applicableProducts\` = COALESCE(?, \`applicableProducts\`),
           \`startDate\` = COALESCE(?, \`startDate\`),
           \`endDate\` = COALESCE(?, \`endDate\`),
           \`isActive\` = COALESCE(?, \`isActive\`),
           \`updatedAt\` = CURRENT_TIMESTAMP(3)
         WHERE \`id\` = ?`,
        title !== undefined ? title : null,
        description !== undefined ? description : null,
        cleanCode !== undefined ? cleanCode : null,
        discountType !== undefined ? discountType.toUpperCase() : null,
        discountValue !== undefined ? Number(discountValue) : null,
        minOrderValue !== undefined ? Number(minOrderValue) : null,
        maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : null) : null,
        imageUrl !== undefined ? imageUrl : null,
        applicableStr !== undefined ? applicableStr : null,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
        isActive !== undefined ? Boolean(isActive) : null,
        id
      );
    } catch (dbErr) {
      console.warn('DB Update issue, updating backup:', (dbErr as Error).message);
    }

    // Update backup cache
    const currentList = readBackup();
    const updatedList = currentList.map((o) => {
      if (o.id === id) {
        return {
          ...o,
          title: title !== undefined ? title : o.title,
          description: description !== undefined ? description : o.description,
          code: cleanCode !== undefined ? cleanCode : o.code,
          discountType: discountType !== undefined ? discountType.toUpperCase() : o.discountType,
          discountValue: discountValue !== undefined ? Number(discountValue) : o.discountValue,
          minOrderValue: minOrderValue !== undefined ? Number(minOrderValue) : o.minOrderValue,
          maxDiscount: maxDiscount !== undefined ? (maxDiscount ? Number(maxDiscount) : null) : o.maxDiscount,
          imageUrl: imageUrl !== undefined ? imageUrl : o.imageUrl,
          applicableProducts: applicableStr !== undefined ? applicableStr : o.applicableProducts,
          startDate: startDate ? new Date(startDate) : o.startDate,
          endDate: endDate ? new Date(endDate) : o.endDate,
          isActive: isActive !== undefined ? Boolean(isActive) : o.isActive,
          updatedAt: new Date(),
        };
      }
      return o;
    });
    writeBackup(updatedList);

    const updated = updatedList.find((o) => o.id === id);

    res.json({
      success: true,
      message: 'Offer updated successfully!',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update offer',
      error: (error as Error).message,
    });
  }
});

// -------------------------------------------------------------
// 5. DELETE /api/offers/:id - Delete an offer
// -------------------------------------------------------------
offerRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { id } = req.params;

    try {
      await prisma.$executeRawUnsafe(`DELETE FROM \`Offer\` WHERE \`id\` = ?`, id);
    } catch (dbErr) {
      console.warn('DB Delete issue, updating backup:', (dbErr as Error).message);
    }

    const currentList = readBackup();
    const updatedList = currentList.filter((o) => o.id !== id);
    writeBackup(updatedList);

    res.json({
      success: true,
      message: 'Offer deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete offer',
      error: (error as Error).message,
    });
  }
});

// -------------------------------------------------------------
// 6. PATCH /api/offers/:id/toggle-status - Toggle active/inactive
// -------------------------------------------------------------
offerRouter.patch('/:id/toggle-status', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { id } = req.params;

    let newStatus = false;

    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT \`isActive\` FROM \`Offer\` WHERE \`id\` = ? LIMIT 1`,
        id
      );
      if (rows && rows.length > 0) {
        newStatus = !Boolean(rows[0].isActive);
        await prisma.$executeRawUnsafe(
          `UPDATE \`Offer\` SET \`isActive\` = ?, \`updatedAt\` = CURRENT_TIMESTAMP(3) WHERE \`id\` = ?`,
          newStatus,
          id
        );
      }
    } catch {
      const currentList = readBackup();
      const item = currentList.find((o) => o.id === id);
      if (item) newStatus = !item.isActive;
    }

    // Update backup cache
    const currentList = readBackup();
    const updatedList = currentList.map((o) => (o.id === id ? { ...o, isActive: newStatus } : o));
    writeBackup(updatedList);

    res.json({
      success: true,
      message: `Offer ${newStatus ? 'Activated' : 'Deactivated'} successfully.`,
      isActive: newStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: (error as Error).message,
    });
  }
});

// -------------------------------------------------------------
// 7. POST /api/offers/validate-coupon - Validate during checkout
// -------------------------------------------------------------
offerRouter.post('/validate-coupon', async (req: Request, res: Response) => {
  try {
    await ensureOfferTableExists();
    const { code, orderAmount } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        valid: false,
        message: 'Please enter a coupon code.',
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const subtotal = Number(orderAmount) || 0;

    let offer: OfferRecord | null = null;
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`Offer\` WHERE \`code\` = ? LIMIT 1`,
        cleanCode
      );
      if (rows && rows.length > 0) {
        offer = { ...rows[0], isActive: Boolean(rows[0].isActive) };
      }
    } catch {
      const backup = readBackup();
      offer = backup.find((o) => o.code.toUpperCase() === cleanCode) || null;
    }

    // 1. Check existence
    if (!offer) {
      return res.status(200).json({
        valid: false,
        message: `Coupon code '${cleanCode}' is invalid. Please check and try again.`,
      });
    }

    // 2. Check active flag
    if (!offer.isActive) {
      return res.status(200).json({
        valid: false,
        message: `Coupon '${cleanCode}' is currently deactivated by the administrator.`,
      });
    }

    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    // 3. Check start date
    if (now < start) {
      const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return res.status(200).json({
        valid: false,
        message: `Coupon '${cleanCode}' is not active yet. Offer starts on ${startStr}.`,
      });
    }

    // 4. Check expiry date
    if (now > end) {
      const endStr = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return res.status(200).json({
        valid: false,
        message: `Coupon '${cleanCode}' has expired on ${endStr}.`,
      });
    }

    // 5. Check minimum order value
    if (subtotal < offer.minOrderValue) {
      const deficit = offer.minOrderValue - subtotal;
      return res.status(200).json({
        valid: false,
        message: `Minimum order value of ₹${offer.minOrderValue} required for coupon '${cleanCode}'. Add ₹${deficit} more to qualify!`,
      });
    }

    // 6. Calculate discount
    let discountAmount = 0;
    if (offer.discountType === 'PERCENTAGE') {
      const raw = Math.round((subtotal * offer.discountValue) / 100);
      discountAmount = offer.maxDiscount ? Math.min(raw, offer.maxDiscount) : raw;
    } else if (offer.discountType === 'FIXED') {
      discountAmount = Math.min(subtotal, offer.discountValue);
    } else if (offer.discountType === 'FREE_DELIVERY') {
      discountAmount = 50; // free delivery waiver
    }

    // Increment usage count in background
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE \`Offer\` SET \`usageCount\` = \`usageCount\` + 1 WHERE \`id\` = ?`,
        offer.id
      );
    } catch {}

    return res.status(200).json({
      valid: true,
      message: `🎉 Coupon '${cleanCode}' applied successfully! You save ₹${discountAmount}.`,
      coupon: {
        id: offer.id,
        code: offer.code,
        title: offer.title,
        discountType: offer.discountType.toLowerCase(),
        discountValue: offer.discountValue,
        discountAmount,
        minOrderValue: offer.minOrderValue,
        maxDiscount: offer.maxDiscount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      valid: false,
      message: 'Failed to validate coupon code due to server error.',
      error: (error as Error).message,
    });
  }
});

