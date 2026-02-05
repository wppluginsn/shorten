import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/database';
import { config } from '../config/env';
import { RegisterDto, LoginDto, GoogleAuthDto } from '../types';

const googleClient = new OAuth2Client(config.googleClientId);

export class AuthService {
  /**
   * Register a new user with email and password
   */
  static async register(data: RegisterDto) {
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * Login with email and password
   */
  static async login(data: LoginDto) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * Google OAuth authentication
   */
  static async googleAuth(data: GoogleAuthDto) {
    const { token } = data;

    try {
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: config.googleClientId,
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new Error('Invalid Google token');
      }

      const { sub: googleId, email, name, picture } = payload;

      // Find or create user
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId },
            { email },
          ],
        },
      });

      if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId, avatar: picture },
          });
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            name,
            avatar: picture,
          },
        });
      }

      // Generate JWT token
      const jwtToken = this.generateToken(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        token: jwtToken,
      };
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Generate JWT token
   */
  private static generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { userId: string; email: string } {
    try {
      return jwt.verify(token, config.jwtSecret) as { userId: string; email: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
