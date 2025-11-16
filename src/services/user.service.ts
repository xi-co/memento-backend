import { User } from '@prisma/client';
import prisma from '../config/database';
import { UserResponse } from '../types/auth.types';

export class UserService {
  static sanitizeUser(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { googleId }
    });
  }

  static async create(data: {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<User> {
    return prisma.user.create({
      data
    });
  }

  static async updateById(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }
}
