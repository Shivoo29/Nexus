import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';
import { contactValidation, newsletterValidation } from '../middleware/validation';

const router = Router();

router.post('/', contactValidation, contactController.submitContactForm);
router.post('/newsletter/subscribe', newsletterValidation, contactController.subscribeNewsletter);
router.post('/newsletter/unsubscribe', contactController.unsubscribeNewsletter);
router.post('/waitlist', contactController.joinWaitlist);

export default router;
