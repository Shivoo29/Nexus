import { body, ValidationChain } from 'express-validator';

// Auth validation
export const signupValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Contact form validation
export const contactValidation: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('type')
    .isIn(['general', 'support', 'sales', 'partnership', 'feedback'])
    .withMessage('Invalid message type'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
];

// Newsletter validation
export const newsletterValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
];

// Onboarding validation
export const onboardingValidation: ValidationChain[] = [
  body('role').optional().isString().withMessage('Role must be a string'),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  body('theme').optional().isString().withMessage('Theme must be a string'),
  body('aiProvider')
    .optional()
    .isString()
    .withMessage('AI provider must be a string'),
];

// Profile update validation
export const profileUpdateValidation: ValidationChain[] = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

// Password change validation
export const passwordChangeValidation: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];
