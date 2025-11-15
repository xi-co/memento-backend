import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/register', AuthController.register);

  fastify.post('/login', AuthController.login);

  fastify.post('/google', AuthController.googleAuth);

  fastify.post('/refresh', AuthController.refreshToken);

  fastify.get('/me', { preHandler: authMiddleware }, AuthController.getMe);
}
