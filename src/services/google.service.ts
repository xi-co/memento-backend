import { OAuth2Client } from 'google-auth-library';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { TokenUtil } from '../utils/token.util';
import { TokenResponse } from '../types/auth.types';

export class GoogleService {
  private static client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  static async verifyGoogleToken(token: string): Promise<{
    googleId: string;
    email: string;
    name: string;
  }> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email || !payload.name) {
        throw new Error('Invalid Google token payload');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name
      };
    } catch (error) {
      throw new Error('Failed to verify Google token');
    }
  }

  static async loginOrRegister(googleToken: string): Promise<{
    user: User;
    tokens: TokenResponse;
    isNewUser: boolean;
  }> {
    const googleData = await this.verifyGoogleToken(googleToken);

    let user = await UserService.findByGoogleId(googleData.googleId);
    let isNewUser = false;

    if (!user) {
      user = await UserService.findByEmail(googleData.email);

      if (user) {
        user = await UserService.updateById(user.id, {
          googleId: googleData.googleId
        });
      } else {
        user = await UserService.create({
          name: googleData.name,
          email: googleData.email,
          googleId: googleData.googleId
        });
        isNewUser = true;
      }
    }

    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email
    });

    return { user, tokens, isNewUser };
  }
}
