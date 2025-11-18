import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

// Signup
export const signup = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken({ userId: user.id, email: user.email });

  // Log action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'signup',
      details: 'User registered with email',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    },
  });

  res.status(201).json({
    message: 'Account created successfully',
    user,
    token,
  });
});

// Login
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if active
  if (!user.isActive) {
    throw new ApiError(403, 'Account has been deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate token
  const token = generateToken({ userId: user.id, email: user.email });

  // Log action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'login',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    },
  });

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    },
    token,
  });
});

// Get current user
export const getCurrentUser = asyncHandler(
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
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({ user });
  }
);

// Logout (optional - for token invalidation)
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user) {
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'logout',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });
  }

  res.json({ message: 'Logged out successfully' });
});
