export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface Link {
  id: string;
  userId?: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  password?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  geoRules?: GeoRule[];
  clickCount?: number;
}

export interface GeoRule {
  id: string;
  linkId: string;
  countryCodes: string[];
  mode: 'allow' | 'block';
  createdAt: string;
}

export interface Analytics {
  totalClicks: number;
  clicksByCountry: CountryClick[];
  clicksByDevice: DeviceClick[];
  clicksByBrowser: BrowserClick[];
  recentClicks: RecentClick[];
  clicksOverTime: TimeSeriesClick[];
}

export interface CountryClick {
  country: string;
  countryCode: string;
  count: number;
}

export interface DeviceClick {
  device: string;
  count: number;
}

export interface BrowserClick {
  browser: string;
  count: number;
}

export interface RecentClick {
  id: string;
  clickedAt: string;
  country?: string;
  countryCode?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  referer?: string;
}

export interface TimeSeriesClick {
  date: string;
  count: number;
}

export interface UserOverview {
  totalLinks: number;
  totalClicks: number;
  topLinks: TopLink[];
  recentActivity: TimeSeriesClick[];
}

export interface TopLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  title?: string;
  clicks: number;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  password?: string;
  expiresAt?: Date;
  geoRules?: {
    countryCodes: string[];
    mode: 'allow' | 'block';
  };
}

export interface UpdateLinkRequest {
  originalUrl?: string;
  customAlias?: string;
  title?: string;
  password?: string;
  expiresAt?: Date;
  isActive?: boolean;
  geoRules?: {
    countryCodes: string[];
    mode: 'allow' | 'block';
  };
}
