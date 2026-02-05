import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuthRequest } from '../types';

export class AnalyticsController {
  /**
   * Get analytics for a specific link
   */
  static async getLinkAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const linkId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const analytics = await AnalyticsService.getLinkAnalytics(linkId, userId);

      return res.status(200).json(analytics);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get user overview analytics
   */
  static async getUserOverview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const overview = await AnalyticsService.getUserOverview(userId);

      return res.status(200).json(overview);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
