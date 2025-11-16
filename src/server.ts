import 'dotenv/config';
import { buildApp } from './app';
import prisma from './config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  let fastify;

  try {
    fastify = await buildApp();

    await prisma.$connect();
    fastify.log.info('Database connected successfully');

    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server running on http://${HOST}:${PORT}`);
    fastify.log.info(`Health check available at http://${HOST}:${PORT}/health`);
  } catch (error) {
    if (fastify) {
      fastify.log.error(error);
    } else {
      console.error('Failed to start server:', error);
    }
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`);

  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();
