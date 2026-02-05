import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface CreateLinkDto {
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

export interface UpdateLinkDto {
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

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GoogleAuthDto {
  token: string;
}
