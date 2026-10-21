import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { z } from 'zod';

export const orderRouter = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone is required'),
  shippingAddress: z.string().min(10, 'Complete shipping address is required'),
  paymentMethod: z.enum(['UPI', 'CARD', 'COD']).default('UPI'),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      packSize: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ).min(1, 'At least one item is required'),
});

// POST Create new order
orderRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const shippingFee = subtotal >= 499 ? 0 : 50;
    const totalAmount = subtotal + shippingFee;

    // Generate unique order number (e.g. SSOIL-2026-8924)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SSOIL-2026-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        shippingAddress: validatedData.shippingAddress,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: validatedData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'PROCESSING',
        totalAmount,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            packSize: item.packSize,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error processing order' });
  }
});

// GET order by order number for tracking
orderRouter.get('/:orderNumber', async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error fetching order' });
  }
});
