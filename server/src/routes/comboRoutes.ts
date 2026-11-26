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

const BACKUP_FILE = path.join(DATA_DIR, 'combo_offers_data.json');

export const comboRouter = Router();

export interface ComboItemRecord {
  productId: string;
  productName: string;
  productTamilName?: string;
  packSize: string;
  quantity: number;
  unitPrice?: number;
}

export interface ComboOfferRecord {
  id: string;
  title: string;
  tamilTitle?: string | null;
  description: string;
  tamilDescription?: string | null;
  badge: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  packSize: string;
  items: ComboItemRecord[];
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  sortOrder: number;
  rating?: number;
  reviewsCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Initial default rich combos
const INITIAL_COMBOS: ComboOfferRecord[] = [
  {
    id: 'combo-1',
    title: 'Heritage Mara Chekku Trio Combo',
    tamilTitle: 'பாரம்பரிய மரச்செக்கு முக்கூட்டு காம்போ',
    description: '1L Cold-Pressed Sesame Oil + 1L Groundnut Oil + 1L Pure Coconut Oil in celebratory protective gift box.',
    tamilDescription: '1லி நல்லெண்ணெய் + 1லி கடலை எண்ணெய் + 1லி தேங்காய் எண்ணெய் அடங்கிய சிறப்பு ஆலை பரிசு தொகுப்பு.',
    badge: 'Best Value',
    imageUrl: '/banners/groundnut_hero_banner.jpg',
    originalPrice: 1060,
    discountedPrice: 869,
    discountPercent: 18,
    packSize: '3 Litre Heritage Combo Box (1L x 3 Bottles)',
    items: [
      {
        productId: 'ss-sesame-1000',
        productName: 'SS Cold-Pressed Sesame Oil (நல்லெண்ணெய்)',
        productTamilName: 'மரச்செக்கு நல்லெண்ணெய்',
        packSize: '1 Litre Glass Bottle',
        quantity: 1,
        unitPrice: 420,
      },
      {
        productId: 'ss-groundnut-1000',
        productName: 'SS Cold-Pressed Groundnut Oil (கடலை எண்ணெய்)',
        productTamilName: 'மரச்செக்கு கடலை எண்ணெய்',
        packSize: '1 Litre Glass Bottle',
        quantity: 1,
        unitPrice: 320,
      },
      {
        productId: 'ss-coconut-1000',
        productName: 'SS Pure Cold-Pressed Coconut Oil (தேங்காய் எண்ணெய்)',
        productTamilName: 'மரச்செக்கு தேங்காய் எண்ணெய்',
        packSize: '1 Litre Glass Bottle',
        quantity: 1,
        unitPrice: 320,
      },
    ],
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    sortOrder: 1,
    rating: 5.0,
    reviewsCount: 384,
  },
  {
    id: 'combo-2',
    title: 'Buy 2 Get 1 Free Mara Chekku Deal',
    tamilTitle: '2 வாங்கினால் 1 இலவசம் - சிறப்பு மரச்செக்கு சலுகை',
    description: 'Buy 2 bottles of 1L Mara Chekku Sesame Oil and get 1L Pure Coconut Oil completely FREE!',
    tamilDescription: '2 நல்லெண்ணெய் 1L வாங்கினால் 1 தேங்காய் எண்ணெய் 1L முற்றிலும் இலவசம்!',
    badge: 'Special Deal',
    imageUrl: '/banners/sesame_sunflower_banner.jpg',
    originalPrice: 1160,
    discountedPrice: 840,
    discountPercent: 28,
    packSize: '3 Litre Festive Bundle (1L x 3 Bottles)',
    items: [
      {
        productId: 'ss-sesame-1000',
        productName: 'SS Cold-Pressed Sesame Oil (நல்லெண்ணெய்)',
        productTamilName: 'மரச்செக்கு நல்லெண்ணெய்',
        packSize: '1 Litre Glass Bottle',
        quantity: 2,
        unitPrice: 420,
      },
      {
        productId: 'ss-coconut-1000',
        productName: 'SS Pure Cold-Pressed Coconut Oil (Free Bottle)',
        productTamilName: 'இலவச தேங்காய் எண்ணெய்',
        packSize: '1 Litre Glass Bottle',
        quantity: 1,
        unitPrice: 320,
      },
    ],
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    sortOrder: 2,
    rating: 4.9,
    reviewsCount: 295,
  },
  {
    id: 'combo-3',
    title: 'Mega Health & Deepam Family Combo',
    tamilTitle: 'மெகா குடும்ப நல்வாழ்வு & தீபம் காம்போ',
    description: '2L Sesame Oil + 2L Groundnut Oil + 1L Pure Pooja Lamp Oil for divine pooja and healthy kitchen.',
    tamilDescription: '2லி நல்லெண்ணெய் + 2லி கடலை எண்ணெய் + 1லி கோவில் தீப எண்ணெய் அடங்கிய முழு குடும்ப தொகுப்பு.',
    badge: 'Limited Offer',
    imageUrl: '/products/ss_oil_can.jpg',
    originalPrice: 1580,
    discountedPrice: 1249,
    discountPercent: 21,
    packSize: '5 Litre Family Mega Pack',
    items: [
      {
        productId: 'ss-sesame-2000',
        productName: 'SS Cold-Pressed Sesame Oil (2L)',
        productTamilName: 'மரச்செக்கு நல்லெண்ணெய் 2லி',
        packSize: '2 Litre Can',
        quantity: 1,
        unitPrice: 819,
      },
      {
        productId: 'ss-groundnut-2000',
        productName: 'SS Cold-Pressed Groundnut Oil (2L)',
        productTamilName: 'மரச்செக்கு கடலை எண்ணெய் 2லி',
        packSize: '2 Litre Can',
        quantity: 1,
        unitPrice: 624,
      },
      {
        productId: 'ss-pooja-1000',
        productName: 'SS Pure Vaagai Lamp Oil (தீப எண்ணெய் 1L)',
        productTamilName: 'கோவில் விசேஷ தீப எண்ணெய்',
        packSize: '1 Litre Bottle',
        quantity: 1,
        unitPrice: 137,
      },
    ],
    startDate: new Date('2026-01-01T00:00:00Z'),
    endDate: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
    sortOrder: 3,
    rating: 5.0,
    reviewsCount: 168,
  },
];

// Helper: Backup to local JSON
const writeBackup = (combos: ComboOfferRecord[]) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(combos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write combo offers backup:', err);
  }
};

const readBackup = (): ComboOfferRecord[] => {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = fs.readFileSync(BACKUP_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read combo offers backup:', err);
  }
  return INITIAL_COMBOS;
};

// Ensure TiDB Table Exists
let isTableReady = false;
export async function ensureComboTableExists(): Promise<void> {
  if (isTableReady) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`ComboOffer\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`tamilTitle\` VARCHAR(255) NULL,
        \`description\` TEXT NOT NULL,
        \`tamilDescription\` TEXT NULL,
        \`badge\` VARCHAR(100) NOT NULL DEFAULT 'Special Deal',
        \`imageUrl\` LONGTEXT NOT NULL,
        \`originalPrice\` DOUBLE NOT NULL,
        \`discountedPrice\` DOUBLE NOT NULL,
        \`discountPercent\` DOUBLE NOT NULL DEFAULT 0,
        \`packSize\` VARCHAR(255) NOT NULL DEFAULT 'Combo Pack',
        \`items\` LONGTEXT NOT NULL,
        \`startDate\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`endDate\` DATETIME(3) NOT NULL,
        \`isActive\` BOOLEAN NOT NULL DEFAULT true,
        \`sortOrder\` INT NOT NULL DEFAULT 0,
        \`rating\` DOUBLE NOT NULL DEFAULT 5.0,
        \`reviewsCount\` INT NOT NULL DEFAULT 120,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check count and seed if empty
    const countResult: any = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM \`ComboOffer\``);
    const count = Number(countResult?.[0]?.count || 0);

    if (count === 0) {
      console.log('🌱 Seeding initial Combo Offers into TiDB...');
      for (const combo of INITIAL_COMBOS) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO \`ComboOffer\` (
            \`id\`, \`title\`, \`tamilTitle\`, \`description\`, \`tamilDescription\`,
            \`badge\`, \`imageUrl\`, \`originalPrice\`, \`discountedPrice\`,
            \`discountPercent\`, \`packSize\`, \`items\`, \`startDate\`, \`endDate\`,
            \`isActive\`, \`sortOrder\`, \`rating\`, \`reviewsCount\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          combo.id,
          combo.title,
          combo.tamilTitle || null,
          combo.description,
          combo.tamilDescription || null,
          combo.badge,
          combo.imageUrl,
          combo.originalPrice,
          combo.discountedPrice,
          combo.discountPercent,
          combo.packSize,
          JSON.stringify(combo.items),
          combo.startDate,
          combo.endDate,
          combo.isActive ? 1 : 0,
          combo.sortOrder,
          combo.rating || 5.0,
          combo.reviewsCount || 150
        );
      }
      writeBackup(INITIAL_COMBOS);
    }

    isTableReady = true;
  } catch (error) {
    console.warn('Notice: TiDB ComboOffer table check/create deferred, using local backup cache:', (error as Error).message);
    if (!fs.existsSync(BACKUP_FILE)) {
      writeBackup(INITIAL_COMBOS);
    }
  }
}

// -------------------------------------------------------------
// 1. GET /api/combos - List combo offers (active by default, ?all=true for admin)
// -------------------------------------------------------------
comboRouter.get('/', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const includeAll = req.query.all === 'true';

    let combos: ComboOfferRecord[] = [];
    try {
      const query = includeAll
        ? `SELECT * FROM \`ComboOffer\` ORDER BY \`sortOrder\` ASC, \`createdAt\` DESC`
        : `SELECT * FROM \`ComboOffer\` WHERE \`isActive\` = 1 ORDER BY \`sortOrder\` ASC, \`createdAt\` DESC`;

      const rows: any = await prisma.$queryRawUnsafe(query);
      if (Array.isArray(rows) && rows.length > 0) {
        combos = rows.map((r: any) => {
          let items: ComboItemRecord[] = [];
          try {
            items = typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []);
          } catch {
            items = [];
          }

          return {
            id: r.id,
            title: r.title,
            tamilTitle: r.tamilTitle,
            description: r.description,
            tamilDescription: r.tamilDescription,
            badge: r.badge || 'Special Deal',
            imageUrl: r.imageUrl,
            originalPrice: Number(r.originalPrice) || 0,
            discountedPrice: Number(r.discountedPrice) || 0,
            discountPercent: Number(r.discountPercent) || 0,
            packSize: r.packSize || 'Combo Pack',
            items,
            startDate: r.startDate,
            endDate: r.endDate,
            isActive: Boolean(r.isActive),
            sortOrder: Number(r.sortOrder) || 0,
            rating: Number(r.rating) || 5.0,
            reviewsCount: Number(r.reviewsCount) || 120,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          };
        });
      }
    } catch (dbErr) {
      console.warn('Falling back to local combo backup due to DB query failure:', (dbErr as Error).message);
    }

    if (combos.length === 0) {
      const backup = readBackup();
      combos = includeAll ? backup : backup.filter((c) => c.isActive);
    }

    // Filter by date validity if not admin all
    if (!includeAll) {
      const now = new Date();
      combos = combos.filter((c) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        return (!c.startDate || now >= start) && (!c.endDate || now <= end);
      });
    }

    res.json({
      success: true,
      count: combos.length,
      data: combos,
    });
  } catch (error) {
    console.error('Error fetching combo offers:', error);
    const backup = readBackup();
    res.json({
      success: true,
      count: backup.length,
      data: backup,
      note: 'Loaded from local backup',
    });
  }
});

// -------------------------------------------------------------
// 2. GET /api/combos/:id - Get single combo
// -------------------------------------------------------------
comboRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const { id } = req.params;

    let combo: ComboOfferRecord | null = null;
    try {
      const rows: any = await prisma.$queryRawUnsafe(`SELECT * FROM \`ComboOffer\` WHERE \`id\` = ? LIMIT 1`, id);
      if (rows && rows.length > 0) {
        const r = rows[0];
        let items: ComboItemRecord[] = [];
        try {
          items = typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []);
        } catch {}

        combo = {
          ...r,
          originalPrice: Number(r.originalPrice),
          discountedPrice: Number(r.discountedPrice),
          discountPercent: Number(r.discountPercent),
          items,
          isActive: Boolean(r.isActive),
        };
      }
    } catch {}

    if (!combo) {
      const backup = readBackup();
      combo = backup.find((c) => c.id === id) || null;
    }

    if (!combo) {
      return res.status(404).json({ success: false, message: 'Combo offer not found' });
    }

    res.json({ success: true, data: combo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// 3. POST /api/combos - Create combo offer (Admin)
// -------------------------------------------------------------
comboRouter.post('/', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const {
      title,
      tamilTitle,
      description,
      tamilDescription,
      badge,
      imageUrl,
      originalPrice,
      discountedPrice,
      packSize,
      items,
      startDate,
      endDate,
      isActive,
      sortOrder,
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Combo title is required.' });
    }

    const orig = Number(originalPrice);
    const disc = Number(discountedPrice);

    if (isNaN(orig) || orig <= 0) {
      return res.status(400).json({ success: false, message: 'Original price must be greater than zero.' });
    }

    if (isNaN(disc) || disc <= 0) {
      return res.status(400).json({ success: false, message: 'Discounted price must be greater than zero.' });
    }

    if (disc > orig) {
      return res.status(400).json({ success: false, message: 'Discounted combo price cannot be higher than original price.' });
    }

    let parsedItems: ComboItemRecord[] = [];
    if (Array.isArray(items)) {
      parsedItems = items;
    } else if (typeof items === 'string') {
      try { parsedItems = JSON.parse(items); } catch {}
    }

    if (parsedItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one oil product included in this combo.' });
    }

    const discountPercent = Math.round(((orig - disc) / orig) * 100);
    const id = `combo-${Date.now()}`;
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const newCombo: ComboOfferRecord = {
      id,
      title: title.trim(),
      tamilTitle: (tamilTitle && String(tamilTitle).trim()) || null,
      description: (description && String(description).trim()) || 'Fresh Vaagai Mara Chekku Pure Oil Combo Offer',
      tamilDescription: (tamilDescription && String(tamilDescription).trim()) || null,
      badge: badge || 'Special Deal',
      imageUrl: imageUrl || '/products/sesame_oil.jpg?v=ssoil',
      originalPrice: orig,
      discountedPrice: disc,
      discountPercent,
      packSize: packSize || `${parsedItems.length} Oil Combo Pack`,
      items: parsedItems,
      startDate: start,
      endDate: end,
      isActive: isActive !== false,
      sortOrder: Number(sortOrder) || 0,
      rating: 5.0,
      reviewsCount: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to TiDB
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO \`ComboOffer\` (
          \`id\`, \`title\`, \`tamilTitle\`, \`description\`, \`tamilDescription\`,
          \`badge\`, \`imageUrl\`, \`originalPrice\`, \`discountedPrice\`,
          \`discountPercent\`, \`packSize\`, \`items\`, \`startDate\`, \`endDate\`,
          \`isActive\`, \`sortOrder\`, \`rating\`, \`reviewsCount\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newCombo.id,
        newCombo.title,
        newCombo.tamilTitle,
        newCombo.description,
        newCombo.tamilDescription,
        newCombo.badge,
        newCombo.imageUrl,
        newCombo.originalPrice,
        newCombo.discountedPrice,
        newCombo.discountPercent,
        newCombo.packSize,
        JSON.stringify(newCombo.items),
        newCombo.startDate,
        newCombo.endDate,
        newCombo.isActive ? 1 : 0,
        newCombo.sortOrder,
        newCombo.rating,
        newCombo.reviewsCount
      );
    } catch (dbErr) {
      console.warn('Could not insert combo into TiDB, caching locally:', (dbErr as Error).message);
    }

    // Update backup cache
    const currentList = readBackup();
    currentList.unshift(newCombo);
    writeBackup(currentList);

    res.status(201).json({
      success: true,
      message: 'Combo offer created and published successfully.',
      data: newCombo,
    });
  } catch (error) {
    console.error('Error creating combo offer:', error);
    res.status(500).json({ success: false, message: 'Failed to create combo offer', error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// 4. PUT /api/combos/:id - Update combo offer (Admin)
// -------------------------------------------------------------
comboRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const { id } = req.params;
    const {
      title,
      tamilTitle,
      description,
      tamilDescription,
      badge,
      imageUrl,
      originalPrice,
      discountedPrice,
      packSize,
      items,
      startDate,
      endDate,
      isActive,
      sortOrder,
    } = req.body;

    const currentList = readBackup();
    const existing = currentList.find((c) => c.id === id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Combo offer not found.' });
    }

    const orig = originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice;
    const disc = discountedPrice !== undefined ? Number(discountedPrice) : existing.discountedPrice;
    const discountPercent = orig > 0 ? Math.round(((orig - disc) / orig) * 100) : existing.discountPercent;

    let parsedItems = existing.items;
    if (items !== undefined) {
      if (Array.isArray(items)) parsedItems = items;
      else if (typeof items === 'string') {
        try { parsedItems = JSON.parse(items); } catch {}
      }
    }

    const updatedCombo: ComboOfferRecord = {
      ...existing,
      title: title !== undefined ? String(title).trim() : existing.title,
      tamilTitle: tamilTitle !== undefined ? (tamilTitle ? String(tamilTitle).trim() : null) : existing.tamilTitle,
      description: description !== undefined ? String(description).trim() : existing.description,
      tamilDescription: tamilDescription !== undefined ? (tamilDescription ? String(tamilDescription).trim() : null) : existing.tamilDescription,
      badge: badge !== undefined ? badge : existing.badge,
      imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      originalPrice: orig,
      discountedPrice: disc,
      discountPercent,
      packSize: packSize !== undefined ? packSize : existing.packSize,
      items: parsedItems,
      startDate: startDate ? new Date(startDate) : existing.startDate,
      endDate: endDate ? new Date(endDate) : existing.endDate,
      isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing.sortOrder,
      updatedAt: new Date(),
    };

    // Update in TiDB
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE \`ComboOffer\` SET
          \`title\` = ?,
          \`tamilTitle\` = ?,
          \`description\` = ?,
          \`tamilDescription\` = ?,
          \`badge\` = ?,
          \`imageUrl\` = ?,
          \`originalPrice\` = ?,
          \`discountedPrice\` = ?,
          \`discountPercent\` = ?,
          \`packSize\` = ?,
          \`items\` = ?,
          \`startDate\` = ?,
          \`endDate\` = ?,
          \`isActive\` = ?,
          \`sortOrder\` = ?,
          \`updatedAt\` = CURRENT_TIMESTAMP(3)
        WHERE \`id\` = ?`,
        updatedCombo.title,
        updatedCombo.tamilTitle,
        updatedCombo.description,
        updatedCombo.tamilDescription,
        updatedCombo.badge,
        updatedCombo.imageUrl,
        updatedCombo.originalPrice,
        updatedCombo.discountedPrice,
        updatedCombo.discountPercent,
        updatedCombo.packSize,
        JSON.stringify(updatedCombo.items),
        updatedCombo.startDate,
        updatedCombo.endDate,
        updatedCombo.isActive ? 1 : 0,
        updatedCombo.sortOrder,
        id
      );
    } catch (dbErr) {
      console.warn('Could not update TiDB, updating local cache:', (dbErr as Error).message);
    }

    // Update backup cache
    const updatedList = currentList.map((c) => (c.id === id ? updatedCombo : c));
    writeBackup(updatedList);

    res.json({
      success: true,
      message: 'Combo offer updated successfully.',
      data: updatedCombo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update combo offer', error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// 5. PATCH /api/combos/:id/toggle - Toggle active status (Admin)
// -------------------------------------------------------------
comboRouter.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const { id } = req.params;

    let newStatus = true;
    try {
      const rows: any = await prisma.$queryRawUnsafe(`SELECT \`isActive\` FROM \`ComboOffer\` WHERE \`id\` = ? LIMIT 1`, id);
      if (rows && rows.length > 0) {
        newStatus = !Boolean(rows[0].isActive);
        await prisma.$executeRawUnsafe(
          `UPDATE \`ComboOffer\` SET \`isActive\` = ?, \`updatedAt\` = CURRENT_TIMESTAMP(3) WHERE \`id\` = ?`,
          newStatus ? 1 : 0,
          id
        );
      }
    } catch {
      const currentList = readBackup();
      const item = currentList.find((c) => c.id === id);
      if (item) newStatus = !item.isActive;
    }

    // Update backup
    const currentList = readBackup();
    const updatedList = currentList.map((c) => (c.id === id ? { ...c, isActive: newStatus, updatedAt: new Date() } : c));
    writeBackup(updatedList);

    res.json({
      success: true,
      message: `Combo offer ${newStatus ? 'Activated' : 'Deactivated'} successfully.`,
      isActive: newStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle combo status', error: (error as Error).message });
  }
});

// -------------------------------------------------------------
// 6. DELETE /api/combos/:id - Delete combo offer (Admin)
// -------------------------------------------------------------
comboRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await ensureComboTableExists();
    const { id } = req.params;

    try {
      await prisma.$executeRawUnsafe(`DELETE FROM \`ComboOffer\` WHERE \`id\` = ?`, id);
    } catch (dbErr) {
      console.warn('Could not delete from TiDB, updating local cache:', (dbErr as Error).message);
    }

    const currentList = readBackup();
    const updatedList = currentList.filter((c) => c.id !== id);
    writeBackup(updatedList);

    res.json({
      success: true,
      message: 'Combo offer deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete combo offer', error: (error as Error).message });
  }
});
