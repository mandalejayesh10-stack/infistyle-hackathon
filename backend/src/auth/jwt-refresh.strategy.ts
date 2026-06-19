import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'infistyle_secret_jwt_key_super_secure_development_key_12345',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.body?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new UnauthorizedException('Expired or invalid session token. Please log in again.');
    }

    if (storedToken.user.isDisabled) {
      throw new UnauthorizedException('User account is disabled');
    }

    return { user: storedToken.user, refreshTokenId: storedToken.id };
  }
}
