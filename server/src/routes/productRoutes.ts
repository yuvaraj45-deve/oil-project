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

// POST create category
productRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || null,
        image: image || null,
      },
    });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server error creating category' });
  }
});

// PUT update category
productRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;

    let existing = await prisma.category.findUnique({ where: { id } }).catch(() => null);
    if (!existing) {
      existing = await prisma.category.findUnique({ where: { slug: id } }).catch(() => null);
    }
    if (!existing && slug) {
      existing = await prisma.category.findUnique({ where: { slug } }).catch(() => null);
    }
    if (!existing && name) {
      existing = await prisma.category.findFirst({
        where: { name: { contains: name.split(' ')[0] } },
      }).catch(() => null);
    }

    if (existing) {
      const updated = await prisma.category.update({
        where: { id: existing.id },
        data: {
          name: name !== undefined ? name : existing.name,
          slug: slug !== undefined ? slug : existing.slug,
          description: description !== undefined ? description : existing.description,
          image: image !== undefined ? image : existing.image,
        },
      });
      return res.json({ success: true, data: updated, message: 'Category updated successfully' });
    } else {
      const created = await prisma.category.create({
        data: {
          name: name || id,
          slug: slug || id.toLowerCase().replace(/\s+/g, '-'),
          description: description || null,
          image: image || '/products/sesame_oil.jpg',
        },
      });
      return res.status(201).json({ success: true, data: created, message: 'Category created successfully' });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server error updating category' });
  }
});

// DELETE category
productRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server error deleting category' });
  }
});

// POST create product
productRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      tagline,
      description,
      price,
      originalPrice,
      discountPercent,
      defaultPack,
      image,
      badge,
      smokePoint,
      extractionMethod,
      inStock,
      featured,
      categoryId,
      categorySlug,
      categoryName,
      packSizes,
    } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required',
      });
    }

    // 1. Robust Category Resolution: Resolve by UUID, slug, or create if missing
    let targetCat = null;
    if (categoryId) {
      targetCat = await prisma.category.findUnique({ where: { id: categoryId } }).catch(() => null);
    }

    const candidateSlug = categorySlug || (categoryId && !targetCat ? categoryId : null);
    if (!targetCat && candidateSlug) {
      targetCat = await prisma.category.findUnique({ where: { slug: candidateSlug } }).catch(() => null);
    }

    if (!targetCat) {
      // Find ANY existing category or auto-create a category matching the request
      const fallbackSlug = candidateSlug || 'cooking-oil';
      targetCat = await prisma.category.findUnique({ where: { slug: fallbackSlug } }).catch(() => null);

      if (!targetCat) {
        const titleCaseName =
          categoryName ||
          fallbackSlug
            .split('-')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

        targetCat = await prisma.category.create({
          data: {
            slug: fallbackSlug,
            name: titleCaseName,
            description: `${titleCaseName} - 100% Traditional Mara Chekku`,
            image: image || '/showcase/showcase_groundnut.png',
          },
        });
      }
    }

    // 2. Safe collision-free slug generation
    let generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!generatedSlug) generatedSlug = `oil-product-${Date.now()}`;

    const existingSlug = await prisma.product.findUnique({ where: { slug: generatedSlug } });
    if (existingSlug) {
      generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
    }

    const calculatedDiscount =
      discountPercent !== undefined
        ? Number(discountPercent)
        : originalPrice && Number(originalPrice) > Number(price)
        ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
        : 0;

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        tagline: tagline || '',
        description: description || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price),
        discountPercent: calculatedDiscount,
        defaultPack: defaultPack || '1 Litre Bottle',
        image: image || '/products/groundnut_oil.jpg',
        badge: badge || null,
        smokePoint: smokePoint || '220°C',
        extractionMethod: extractionMethod || 'Traditional Cold-Pressed Mara Chekku',
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        featured: featured !== undefined ? Boolean(featured) : false,
        categoryId: targetCat.id,
        packSizes:
          packSizes && Array.isArray(packSizes) && packSizes.length > 0
            ? {
                create: packSizes.map((p: any) => ({
                  packSize: typeof p === 'string' ? p : p.packSize || '1 Litre Bottle',
                  price: Number(p.price || price),
                  originalPrice: Number(p.originalPrice || originalPrice || price),
                  inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        packSizes: true,
      },
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});

// PUT update product (Edit product)
productRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      tagline,
      description,
      price,
      originalPrice,
      discountPercent,
      defaultPack,
      image,
      badge,
      smokePoint,
      extractionMethod,
      inStock,
      featured,
      categoryId,
      packSizes,
    } = req.body;

    let existing = await prisma.product.findUnique({ where: { id } }).catch(() => null);
    if (!existing) {
      existing = await prisma.product.findUnique({ where: { slug: id } }).catch(() => null);
    }
    if (!existing && slug) {
      existing = await prisma.product.findUnique({ where: { slug } }).catch(() => null);
    }
    if (!existing && name) {
      const firstWord = name.trim().split(' ')[0];
      existing = await prisma.product.findFirst({
        where: {
          OR: [
            { name: { contains: firstWord } },
            { name: { equals: name.trim() } },
          ],
        },
      }).catch(() => null);
    }

    const calculatedDiscount =
      discountPercent !== undefined
        ? Number(discountPercent)
        : price !== undefined && originalPrice !== undefined && Number(originalPrice) > Number(price)
        ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
        : existing ? existing.discountPercent : 0;

    if (existing) {
      // If packSizes provided, update them
      if (packSizes && Array.isArray(packSizes)) {
        await prisma.productPackSize.deleteMany({ where: { productId: existing.id } });
        await prisma.productPackSize.createMany({
          data: packSizes.map((p: any) => ({
            productId: existing.id,
            packSize: typeof p === 'string' ? p : p.packSize,
            price: Number(p.price || price || existing.price),
            originalPrice: Number(p.originalPrice || originalPrice || existing.originalPrice),
            inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
          })),
        });
      }

      const updated = await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: name !== undefined ? name : existing.name,
          slug: slug !== undefined ? slug : existing.slug,
          tagline: tagline !== undefined ? tagline : existing.tagline,
          description: description !== undefined ? description : existing.description,
          price: price !== undefined ? Number(price) : existing.price,
          originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
          discountPercent: calculatedDiscount,
          defaultPack: defaultPack !== undefined ? defaultPack : existing.defaultPack,
          image: image !== undefined ? image : existing.image,
          badge: badge !== undefined ? badge : existing.badge,
          smokePoint: smokePoint !== undefined ? smokePoint : existing.smokePoint,
          extractionMethod: extractionMethod !== undefined ? extractionMethod : existing.extractionMethod,
          inStock: inStock !== undefined ? Boolean(inStock) : existing.inStock,
          featured: featured !== undefined ? Boolean(featured) : existing.featured,
          categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        },
        include: {
          category: true,
          packSizes: true,
          reviews: true,
          labReports: true,
        },
      });

      return res.json({ success: true, data: updated, message: 'Product updated successfully' });
    } else {
      // If doesn't exist, create it!
      const firstCat = await prisma.category.findFirst();
      const targetCatId = categoryId || (firstCat ? firstCat.id : undefined);

      const created = await prisma.product.create({
        data: {
          name: name || id,
          slug: slug || id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          tagline: tagline || '',
          description: description || '',
          price: Number(price || 300),
          originalPrice: originalPrice ? Number(originalPrice) : Number(price || 350),
          discountPercent: calculatedDiscount,
          defaultPack: defaultPack || '1 Litre Bottle',
          image: image || '/products/sesame_oil.jpg',
          badge: badge || null,
          smokePoint: smokePoint || '210°C',
          extractionMethod: extractionMethod || 'Traditional Vaagai Mara Chekku',
          inStock: inStock !== undefined ? Boolean(inStock) : true,
          featured: featured !== undefined ? Boolean(featured) : true,
          categoryId: targetCatId!,
        },
        include: {
          category: true,
          packSizes: true,
        },
      });
      return res.status(201).json({ success: true, data: created, message: 'Product created successfully' });
    }

    res.json({ success: true, data: updated, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

// DELETE product (Clean cascade delete so it never fails on foreign key relations)
productRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.productPackSize.deleteMany({ where: { productId: id } }).catch(() => null);
    await prisma.labReport.deleteMany({ where: { productId: id } }).catch(() => null);
    await prisma.review.deleteMany({ where: { productId: id } }).catch(() => null);
    await prisma.orderItem.deleteMany({ where: { productId: id } }).catch(() => null);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});
