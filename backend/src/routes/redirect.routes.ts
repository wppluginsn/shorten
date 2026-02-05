import { Router } from 'express';
import { RedirectController } from '../controllers/redirect.controller';

const router = Router();

// Password verification
router.post('/verify-password', RedirectController.verifyPassword);

// Redirect handler - must be last to catch all
router.get('/:shortCode', RedirectController.redirect);

export default router;
