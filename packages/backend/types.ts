import type { PrismaClient } from '@prisma/client';

export type Context = {
  prisma: PrismaClient;
  userId: number | null;
};

export type JwtPayload = {
  id: number;
  username: string;
};

export enum AuthErrorCode {
  AuthFailed = 'auth_failed',
  WeakPassword = 'weak_password',
  UsernameTaken = 'username_taken',
  NotLoggedIn = 'not_logged_in',
}
