import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; name: string; passwordHash: string }) {
    return this.authService.register({
      email: body.email,
      name: body.name,
      passwordHash: body.passwordHash,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; passwordHash: string }) {
    return this.authService.login(body.email, body.passwordHash);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any) {
    const { user, refreshTokenId } = req.user;
    return this.authService.rotateTokens(refreshTokenId, user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refresh_token?: string }) {
    return this.authService.logout(body.refresh_token || '');
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; passwordHash: string }) {
    return this.authService.resetPassword(body.token, body.passwordHash);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: any) {
    const result = await this.authService.validateOrCreateGoogleUser(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}?access_token=${result.access_token}&refresh_token=${result.refresh_token}`;
    res.redirect(redirectUrl);
  }

  @Post('google-simulated')
  @HttpCode(HttpStatus.OK)
  async googleSimulatedLogin(@Body() body: { email?: string; name?: string }) {
    const simulatedProfile = {
      googleId: 'simulated-google-id-' + Math.random().toString(36).substring(2, 10),
      email: body.email || 'google-user@gmail.com',
      name: body.name || 'Google User',
      profilePhoto: '',
    };
    return this.authService.validateOrCreateGoogleUser(simulatedProfile);
  }
}
