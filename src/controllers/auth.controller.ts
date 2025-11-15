import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { GoogleService } from '../services/google.service';
import { UserService } from '../services/user.service';
import {
  RegisterInput,
  LoginInput,
  GoogleAuthInput,
  RefreshTokenInput,
  registerSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenSchema
} from '../types/validation.schemas';

export class AuthController {
  static async register(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validatedData = registerSchema.parse(request.body);

      const { user, tokens } = await AuthService.register(validatedData);

      reply.status(201).send({
        message: 'User registered successfully',
        user: UserService.sanitizeUser(user),
        tokens
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('already registered') ? 409 : 400;
        reply.status(statusCode).send({
          error: 'Registration failed',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  static async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validatedData = loginSchema.parse(request.body);

      const { user, tokens } = await AuthService.login(validatedData);

      reply.status(200).send({
        message: 'Login successful',
        user: UserService.sanitizeUser(user),
        tokens
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('Invalid credentials') ? 401 : 400;
        reply.status(statusCode).send({
          error: 'Login failed',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  static async googleAuth(
    request: FastifyRequest<{ Body: GoogleAuthInput }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validatedData = googleAuthSchema.parse(request.body);

      const { user, tokens, isNewUser } = await GoogleService.loginOrRegister(
        validatedData.token
      );

      reply.status(200).send({
        message: isNewUser ? 'User registered with Google' : 'Login successful',
        user: UserService.sanitizeUser(user),
        tokens,
        isNewUser
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(401).send({
          error: 'Google authentication failed',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  static async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenInput }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const validatedData = refreshTokenSchema.parse(request.body);

      const tokens = await AuthService.refreshToken(validatedData.refreshToken);

      reply.status(200).send({
        message: 'Token refreshed successfully',
        tokens
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.status(401).send({
          error: 'Token refresh failed',
          message: error.message
        });
      } else {
        reply.status(500).send({
          error: 'Internal server error',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  static async getMe(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const user = await UserService.findById(request.user.userId);

      if (!user) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found'
        });
      }

      reply.status(200).send({
        user: UserService.sanitizeUser(user)
      });
    } catch (error) {
      reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      });
    }
  }
}
