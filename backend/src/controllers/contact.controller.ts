import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';

// Submit contact form
export const submitContactForm = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }

    const { name, email, type, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        type,
        message,
      },
    });

    // TODO: Send email notification to admin
    // await emailService.sendContactNotification(contactMessage);

    res.status(201).json({
      message: 'Message sent successfully. We will get back to you soon!',
      id: contactMessage.id,
    });
  }
);

// Subscribe to newsletter
export const subscribeNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }

    const { email } = req.body;

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return res.json({ message: 'Email is already subscribed' });
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        return res.json({ message: 'Subscription reactivated successfully' });
      }
    }

    await prisma.newsletter.create({
      data: { email },
    });

    // TODO: Send welcome email
    // await emailService.sendNewsletterWelcome(email);

    res.status(201).json({
      message: 'Successfully subscribed to newsletter!',
    });
  }
);

// Unsubscribe from newsletter
export const unsubscribeNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    await prisma.newsletter.updateMany({
      where: { email },
      data: { isActive: false },
    });

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  }
);

// Join waitlist
export const joinWaitlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name, reason } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    // Check if already on waitlist
    const existing = await prisma.waitlistEntry.findUnique({
      where: { email },
    });

    if (existing) {
      return res.json({ message: 'Email is already on the waitlist' });
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        email,
        name,
        reason,
      },
    });

    // TODO: Send waitlist confirmation email
    // await emailService.sendWaitlistConfirmation(email, name);

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      position: await prisma.waitlistEntry.count(),
    });
  }
);
