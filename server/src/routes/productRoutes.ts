import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const productRouter = Router();

// GET all categories
productRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

// GET all products with filtering & search
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;

    const whereClause: any = {};

    if (category && typeof category === 'string' && category !== 'all') {
      whereClause.category = { slug: category };
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        packSizes: true,
        reviews: true,
        labReports: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

// GET single product by slug or ID
productRouter.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        category: true,
        packSizes: true,
        reviews: { orderBy: { createdAt: 'desc' } },
        labReports: true,
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
});
