import UAParser from 'ua-parser-js';
import prisma from '../config/database';
import { hashIP, parseDeviceType } from '../utils/helpers';
import { getGeoLocation, getClientIP } from '../utils/geolocation';

export class AnalyticsService {
  /**
   * Track a click on a link
   */
  static async trackClick(linkId: string, req: any) {
    try {
      // Get IP address
      const ip = getClientIP(req);
      const ipHash = hashIP(ip);

      // Get geolocation
      const geoData = await getGeoLocation(ip);

      // Parse user agent
      const userAgent = req.headers['user-agent'] || '';
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      // Get referrer
      const referer = req.headers.referer || req.headers.referrer || null;

      // Create analytics record (async, don't wait)
      prisma.analytics.create({
        data: {
          linkId,
          ipHash,
          country: geoData.country || null,
          countryCode: geoData.countryCode || null,
          city: geoData.city || null,
          userAgent,
          device: parseDeviceType(userAgent),
          browser: result.browser.name || null,
          os: result.os.name || null,
          referer,
        },
      }).catch((error) => {
        console.error('Error tracking analytics:', error);
      });

      return true;
    } catch (error) {
      console.error('Error in trackClick:', error);
      return false;
    }
  }

  /**
   * Get analytics for a specific link
   */
  static async getLinkAnalytics(linkId: string, userId: string) {
    // Verify link belongs to user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    // Get all analytics data
    const [
      totalClicks,
      clicksByCountry,
      clicksByDevice,
      clicksByBrowser,
      recentClicks,
      clicksOverTime,
    ] = await Promise.all([
      // Total clicks
      prisma.analytics.count({ where: { linkId } }),

      // Clicks by country
      prisma.analytics.groupBy({
        by: ['countryCode', 'country'],
        where: { linkId, countryCode: { not: null } },
        _count: true,
        orderBy: { _count: { countryCode: 'desc' } },
        take: 10,
      }),

      // Clicks by device
      prisma.analytics.groupBy({
        by: ['device'],
        where: { linkId, device: { not: null } },
        _count: true,
      }),

      // Clicks by browser
      prisma.analytics.groupBy({
        by: ['browser'],
        where: { linkId, browser: { not: null } },
        _count: true,
        orderBy: { _count: { browser: 'desc' } },
        take: 10,
      }),

      // Recent clicks
      prisma.analytics.findMany({
        where: { linkId },
        orderBy: { clickedAt: 'desc' },
        take: 50,
        select: {
          id: true,
          clickedAt: true,
          country: true,
          countryCode: true,
          city: true,
          device: true,
          browser: true,
          os: true,
          referer: true,
        },
      }),

      // Clicks over time (last 30 days)
      prisma.analytics.groupBy({
        by: ['clickedAt'],
        where: {
          linkId,
          clickedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),
    ]);

    // Process clicks over time data
    const clicksByDate: { [key: string]: number } = {};
    clicksOverTime.forEach((item) => {
      const date = item.clickedAt.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + item._count;
    });

    return {
      totalClicks,
      clicksByCountry: clicksByCountry.map((item) => ({
        country: item.country,
        countryCode: item.countryCode,
        count: item._count,
      })),
      clicksByDevice: clicksByDevice.map((item) => ({
        device: item.device,
        count: item._count,
      })),
      clicksByBrowser: clicksByBrowser.map((item) => ({
        browser: item.browser,
        count: item._count,
      })),
      recentClicks,
      clicksOverTime: Object.entries(clicksByDate).map(([date, count]) => ({
        date,
        count,
      })).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  /**
   * Get overview analytics for user
   */
  static async getUserOverview(userId: string) {
    const [
      totalLinks,
      totalClicks,
      topLinks,
      recentActivity,
    ] = await Promise.all([
      // Total links
      prisma.link.count({ where: { userId } }),

      // Total clicks across all links
      prisma.analytics.count({
        where: {
          link: { userId },
        },
      }),

      // Top performing links
      prisma.link.findMany({
        where: { userId },
        include: {
          _count: {
            select: { analytics: true },
          },
        },
        orderBy: {
          analytics: {
            _count: 'desc',
          },
        },
        take: 5,
      }),

      // Recent activity (last 7 days)
      prisma.analytics.groupBy({
        by: ['clickedAt'],
        where: {
          link: { userId },
          clickedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),
    ]);

    // Process recent activity
    const activityByDate: { [key: string]: number } = {};
    recentActivity.forEach((item) => {
      const date = item.clickedAt.toISOString().split('T')[0];
      activityByDate[date] = (activityByDate[date] || 0) + item._count;
    });

    return {
      totalLinks,
      totalClicks,
      topLinks: topLinks.map((link) => ({
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        clicks: link._count.analytics,
      })),
      recentActivity: Object.entries(activityByDate).map(([date, count]) => ({
        date,
        count,
      })).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }
}
