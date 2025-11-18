import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import {
  profileUpdateValidation,
  onboardingValidation,
  passwordChangeValidation,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', profileUpdateValidation, userController.updateProfile);
router.put('/onboarding', onboardingValidation, userController.updateOnboarding);
router.post('/change-password', passwordChangeValidation, userController.changePassword);
router.delete('/account', userController.deleteAccount);

export default router;
