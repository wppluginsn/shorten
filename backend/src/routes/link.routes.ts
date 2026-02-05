import { Router } from 'express';
import { LinkController } from '../controllers/link.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public route
router.post('/public', LinkController.createPublicLink);

// Protected routes
router.post('/', authMiddleware, LinkController.createLink);
router.get('/', authMiddleware, LinkController.getUserLinks);
router.get('/:id', authMiddleware, LinkController.getLink);
router.put('/:id', authMiddleware, LinkController.updateLink);
router.delete('/:id', authMiddleware, LinkController.deleteLink);

export default router;
