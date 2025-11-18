import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';

// Get user profile
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        languages: true,
        theme: true,
        aiProvider: true,
        hasCompletedOnboarding: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({ user });
  }
);

// Update user profile
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }

    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'profile_update',
        details: 'Profile updated',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  }
);

// Update onboarding data
export const updateOnboarding = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }

    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { role, languages, theme, aiProvider } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(role && { role }),
        ...(languages && { languages }),
        ...(theme && { theme }),
        ...(aiProvider && { aiProvider }),
        hasCompletedOnboarding: true,
      },
      select: {
        id: true,
        role: true,
        languages: true,
        theme: true,
        aiProvider: true,
        hasCompletedOnboarding: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'onboarding_completed',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      message: 'Onboarding completed successfully',
      user,
    });
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array()[0].msg);
    }

    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || !user.password) {
      throw new ApiError(400, 'Cannot change password for OAuth users');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'password_change',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({ message: 'Password changed successfully' });
  }
);

// Delete account
export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'account_deleted',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    await prisma.user.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Account deleted successfully' });
  }
);
