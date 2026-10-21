import { Router, Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { z } from 'zod';

export const newsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

newsletterRouter.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = subscribeSchema.parse(req.body);

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to SS OIL updates!',
      });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to SS OIL harvest specials and tips!',
      data: subscriber,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Server error processing subscription' });
  }
});
