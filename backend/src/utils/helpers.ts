import crypto from 'crypto';
import { nanoid } from 'nanoid';

/**
 * Generate a unique short code for URL
 */
export const generateShortCode = (): string => {
  return nanoid(8);
};

/**
 * Hash IP address for privacy
 */
export const hashIP = (ip: string): string => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate custom alias format (alphanumeric and hyphens only)
 */
export const isValidAlias = (alias: string): boolean => {
  return /^[a-zA-Z0-9-_]+$/.test(alias);
};

/**
 * Parse device type from user agent
 */
export const parseDeviceType = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};
