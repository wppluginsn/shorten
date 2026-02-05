import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { CreateLinkDto, UpdateLinkDto } from '../types';
import { generateShortCode, isValidUrl, isValidAlias } from '../utils/helpers';

export class LinkService {
  /**
   * Create a new short link
   */
  static async createLink(data: CreateLinkDto, userId?: string) {
    const { originalUrl, customAlias, title, password, expiresAt, geoRules } = data;

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    // Generate or validate short code
    let shortCode: string;
    
    if (customAlias) {
      // Validate custom alias
      if (!isValidAlias(customAlias)) {
        throw new Error('Invalid alias format. Use only letters, numbers, hyphens, and underscores');
      }

      // Check if alias already exists
      const existing = await prisma.link.findFirst({
        where: {
          OR: [
            { shortCode: customAlias },
            { customAlias },
          ],
        },
      });

      if (existing) {
        throw new Error('This alias is already taken');
      }

      shortCode = customAlias;
    } else {
      // Generate unique short code
      shortCode = generateShortCode();
      
      // Ensure uniqueness
      let attempts = 0;
      while (await prisma.link.findUnique({ where: { shortCode } })) {
        shortCode = generateShortCode();
        attempts++;
        if (attempts > 10) {
          throw new Error('Failed to generate unique short code');
        }
      }
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create link
    const link = await prisma.link.create({
      data: {
        userId,
        originalUrl,
        shortCode,
        customAlias: customAlias || null,
        title: title || null,
        password: hashedPassword,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        geoRules: true,
      },
    });

    // Create geo rules if provided
    if (geoRules && geoRules.countryCodes.length > 0) {
      await prisma.geoRule.create({
        data: {
          linkId: link.id,
          countryCodes: geoRules.countryCodes,
          mode: geoRules.mode,
        },
      });
    }

    return link;
  }

  /**
   * Get all links for a user
   */
  static async getUserLinks(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where: { userId },
        include: {
          geoRules: true,
          _count: {
            select: { analytics: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.link.count({ where: { userId } }),
    ]);

    return {
      links: links.map((link) => ({
        ...link,
        clickCount: link._count.analytics,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get link by short code
   */
  static async getLinkByShortCode(shortCode: string) {
    const link = await prisma.link.findFirst({
      where: {
        OR: [
          { shortCode },
          { customAlias: shortCode },
        ],
        isActive: true,
      },
      include: {
        geoRules: true,
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    // Check if expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new Error('Link has expired');
    }

    return link;
  }

  /**
   * Get link by ID (for authenticated user)
   */
  static async getLinkById(linkId: string, userId: string) {
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
      include: {
        geoRules: true,
        _count: {
          select: { analytics: true },
        },
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    return {
      ...link,
      clickCount: link._count.analytics,
    };
  }

  /**
   * Update a link
   */
  static async updateLink(linkId: string, userId: string, data: UpdateLinkDto) {
    const { originalUrl, customAlias, title, password, expiresAt, isActive, geoRules } = data;

    // Check if link exists and belongs to user
    const existingLink = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!existingLink) {
      throw new Error('Link not found');
    }

    // Validate URL if provided
    if (originalUrl && !isValidUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    // Validate and check custom alias if provided
    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        throw new Error('Invalid alias format');
      }

      const aliasExists = await prisma.link.findFirst({
        where: {
          OR: [
            { shortCode: customAlias },
            { customAlias },
          ],
          id: { not: linkId },
        },
      });

      if (aliasExists) {
        throw new Error('This alias is already taken');
      }
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update link
    const updateData: any = {};
    if (originalUrl !== undefined) updateData.originalUrl = originalUrl;
    if (customAlias !== undefined) updateData.customAlias = customAlias;
    if (title !== undefined) updateData.title = title;
    if (password !== undefined) updateData.password = hashedPassword;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const link = await prisma.link.update({
      where: { id: linkId },
      data: updateData,
      include: {
        geoRules: true,
      },
    });

    // Update geo rules if provided
    if (geoRules !== undefined) {
      // Delete existing geo rules
      await prisma.geoRule.deleteMany({
        where: { linkId },
      });

      // Create new geo rules if provided
      if (geoRules.countryCodes.length > 0) {
        await prisma.geoRule.create({
          data: {
            linkId: link.id,
            countryCodes: geoRules.countryCodes,
            mode: geoRules.mode,
          },
        });
      }
    }

    return link;
  }

  /**
   * Delete a link
   */
  static async deleteLink(linkId: string, userId: string) {
    // Check if link exists and belongs to user
    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId,
      },
    });

    if (!link) {
      throw new Error('Link not found');
    }

    // Delete link (cascades to geo rules and analytics)
    await prisma.link.delete({
      where: { id: linkId },
    });

    return { message: 'Link deleted successfully' };
  }

  /**
   * Verify password for password-protected link
   */
  static async verifyLinkPassword(linkId: string, password: string) {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!link || !link.password) {
      throw new Error('Link not found or not password protected');
    }

    const isValid = await bcrypt.compare(password, link.password);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    return true;
  }
}
