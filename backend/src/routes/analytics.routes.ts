import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All analytics routes are protected
router.get('/link/:id', authMiddleware, AnalyticsController.getLinkAnalytics);
router.get('/overview', authMiddleware, AnalyticsController.getUserOverview);

export default router;
