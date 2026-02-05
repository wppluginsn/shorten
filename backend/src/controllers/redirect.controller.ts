import { Request, Response } from 'express';
import { LinkService } from '../services/link.service';
import { AnalyticsService } from '../services/analytics.service';
import { getClientIP, getGeoLocation } from '../utils/geolocation';

export class RedirectController {
  /**
   * Handle redirect with geo-blocking
   */
  static async redirect(req: Request, res: Response) {
    try {
      const shortCode = req.params.shortCode;

      // Get link
      const link = await LinkService.getLinkByShortCode(shortCode);

      // Check geo-blocking rules
      if (link.geoRules && link.geoRules.length > 0) {
        const geoRule = link.geoRules[0];
        const ip = getClientIP(req);
        const geoData = await getGeoLocation(ip);

        if (geoData.countryCode) {
          const isCountryInList = geoRule.countryCodes.includes(geoData.countryCode);

          // Check based on mode
          if (geoRule.mode === 'allow' && !isCountryInList) {
            // Country not in allow list - block
            return res.redirect(`/blocked?country=${geoData.country}&code=${geoData.countryCode}`);
          } else if (geoRule.mode === 'block' && isCountryInList) {
            // Country in block list - block
            return res.redirect(`/blocked?country=${geoData.country}&code=${geoData.countryCode}`);
          }
        }
      }

      // Check password protection
      if (link.password) {
        // Return password prompt page
        return res.status(200).json({
          requiresPassword: true,
          linkId: link.id,
          shortCode: link.shortCode,
        });
      }

      // Track click asynchronously
      AnalyticsService.trackClick(link.id, req);

      // Redirect to original URL
      return res.redirect(link.originalUrl);
    } catch (error: any) {
      return res.status(404).json({ error: 'Link not found or expired' });
    }
  }

  /**
   * Verify password and redirect
   */
  static async verifyPassword(req: Request, res: Response) {
    try {
      const { linkId, password } = req.body;

      if (!linkId || !password) {
        return res.status(400).json({ error: 'Link ID and password are required' });
      }

      // Verify password
      await LinkService.verifyLinkPassword(linkId, password);

      // Get link
      const link = await LinkService.getLinkByShortCode(linkId);

      // Track click
      AnalyticsService.trackClick(link.id, req);

      return res.status(200).json({ originalUrl: link.originalUrl });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}
