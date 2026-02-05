import { Response } from 'express';
import { LinkService } from '../services/link.service';
import { AuthRequest } from '../types';

export class LinkController {
  /**
   * Create a new link (authenticated)
   */
  static async createLink(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const link = await LinkService.createLink(req.body, userId);

      return res.status(201).json(link);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Create a public link (no authentication)
   */
  static async createPublicLink(req: AuthRequest, res: Response) {
    try {
      const { originalUrl } = req.body;

      if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
      }

      // Public links don't support advanced features
      const link = await LinkService.createLink({ originalUrl });

      return res.status(201).json({
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/${link.shortCode}`,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all user's links
   */
  static async getUserLinks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await LinkService.getUserLinks(userId, page, limit);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get a specific link
   */
  static async getLink(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const linkId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const link = await LinkService.getLinkById(linkId, userId);

      return res.status(200).json(link);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  /**
   * Update a link
   */
  static async updateLink(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const linkId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const link = await LinkService.updateLink(linkId, userId, req.body);

      return res.status(200).json(link);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete a link
   */
  static async deleteLink(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const linkId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const result = await LinkService.deleteLink(linkId, userId);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
