/**
 * Fetch geolocation data from IP address
 */
export const getGeoLocation = async (ip: string): Promise<{
  country?: string;
  countryCode?: string;
  city?: string;
}> => {
  try {
    // Use ip-api.com for geolocation (free, no API key needed)
    // For production, consider using a paid service or self-hosted solution
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
      };
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error);
  }
  
  return {};
};

/**
 * Get client IP address from request
 */
export const getClientIP = (req: any): string => {
  // Check for forwarded IP (when behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check for real IP header
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP as string;
  }
  
  // Fallback to remote address
  return req.ip || req.connection.remoteAddress || '0.0.0.0';
};
