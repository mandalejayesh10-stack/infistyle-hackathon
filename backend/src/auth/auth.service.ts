import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateAuthTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    // Store hashed refresh token in database (valid for 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: rawRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        company_name: user.companyName || '',
        gstin: user.gstin || '',
        billing_address: user.billingAddress || '',
        shipping_address: user.shippingAddress || '',
        profile_photo: user.profilePhoto || '',
        is_email_verified: user.isEmailVerified,
      },
    };
  }

  async register(data: { email: string; name: string; passwordHash: string }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.passwordHash, salt);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'customer',
        isEmailVerified: false,
      },
    });

    return this.generateAuthTokens(user);
  }

  async login(email: string, passwordHash: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (user.isDisabled) {
      throw new UnauthorizedException('This account has been disabled. Please contact support.');
    }

    const isValidPassword = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    return this.generateAuthTokens(user);
  }

  async rotateTokens(refreshTokenId: string, user: any) {
    // Revoke old refresh token
    await this.prisma.refreshToken.delete({ where: { id: refreshTokenId } }).catch(() => {});
    
    // Generate new tokens
    return this.generateAuthTokens(user);
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await this.prisma.refreshToken.delete({ where: { tokenHash } }).catch(() => {});
    }
    return { success: true };
  }

  async validateOrCreateGoogleUser(googleProfile: { googleId: string; email: string; name: string; profilePhoto: string }) {
    // 1. Find by googleId
    let user = await this.usersService.findByGoogleId(googleProfile.googleId);
    
    if (!user) {
      // 2. Find by email
      user = await this.usersService.findByEmail(googleProfile.email);
      
      if (user) {
        // Link Google ID to existing account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleProfile.googleId, profilePhoto: googleProfile.profilePhoto },
        });
      } else {
        // Create new account
        user = await this.prisma.user.create({
          data: {
            googleId: googleProfile.googleId,
            email: googleProfile.email,
            name: googleProfile.name,
            profilePhoto: googleProfile.profilePhoto,
            role: 'customer',
            isEmailVerified: true, // Google email is pre-verified
          },
        });
      }
    }

    if (user.isDisabled) {
      throw new UnauthorizedException('This account has been disabled.');
    }

    return this.generateAuthTokens(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't leak user existence for security, but return success
      return { success: true, message: 'If the email exists, a reset link has been logged.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Valid for 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any old reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }).catch(() => {});

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}?mode=reset_password&token=${resetToken}`;
    console.log(`\n============================================================`);
    console.log(`📧 [EMAIL ALERTS / PASSWORD RESET]`);
    console.log(`To: ${user.name} <${user.email}>`);
    console.log(`Subject: Password Reset Request for InfiStyle`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`============================================================\n`);

    return { success: true, reset_token: resetToken };
  }

  async resetPassword(resetToken: string, newPasswordHash: string) {
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const storedToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await this.prisma.passwordResetToken.delete({ where: { id: storedToken.id } });
      }
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPasswordHash, salt);

    await this.prisma.user.update({
      where: { id: storedToken.userId },
      data: { passwordHash },
    });

    // Delete the used token
    await this.prisma.passwordResetToken.delete({ where: { id: storedToken.id } });

    return { success: true };
  }
}
