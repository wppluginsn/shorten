import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { RedirectController } from '../controllers/redirect.controller';

const router = Router();

// Rate limiter for redirect endpoints to prevent abuse
const redirectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many redirect attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Password verification with rate limiting
router.post('/verify-password', redirectLimiter, RedirectController.verifyPassword);

// Redirect handler with rate limiting - must be last to catch all
router.get('/:shortCode', redirectLimiter, RedirectController.redirect);

export default router;
