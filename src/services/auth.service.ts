import { User } from '@prisma/client';
import { UserService } from './user.service';
import { PasswordUtil } from '../utils/password.util';
import { TokenUtil } from '../utils/token.util';
import { TokenResponse } from '../types/auth.types';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: User; tokens: TokenResponse }> {
    const existingUser = await UserService.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordValidation = PasswordUtil.validate(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    const user = await UserService.create({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email
    });

    return { user, tokens };
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; tokens: TokenResponse }> {
    const user = await UserService.findByEmail(data.email);
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email
    });

    return { user, tokens };
  }

  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const payload = TokenUtil.verifyRefreshToken(refreshToken);

    const user = await UserService.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return TokenUtil.generateTokens({
      userId: user.id,
      email: user.email
    });
  }
}
