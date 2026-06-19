import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName || ''} ${name.familyName || ''}`.trim() || emails[0].value.split('@')[0],
      profilePhoto: profile.photos?.[0]?.value || '',
    };
    done(null, user);
  }
}
