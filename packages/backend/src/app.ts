import express from 'express';
import config from './config';
import cors from 'cors';

import 'reflect-metadata';

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { TodoResolver, UserResolver } from './resolvers';

import jwt from 'jsonwebtoken';

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

(async () => {
  const schema = await buildSchema({
    resolvers: [TodoResolver, UserResolver],
    validate: false,
  });

  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: [/^https?:\/\/localhost:\d+$/],
    })
  );

  const prisma = new PrismaClient();

  const graphiqlConfig =
    config.get('NODE_ENV') === 'development'
      ? {
          headerEditorEnabled: true,
        }
      : undefined;

  app.use(
    '/graphql',
    graphqlHTTP(async (_req, resp, info) => {
      const authToken = _req.headers.authorization?.split(' ')?.[1];
      let jwtPayload: JwtPayload | undefined;

      if (authToken) {
        try {
          jwtPayload = await new Promise((res, rej) => {
            jwt.verify(
              authToken,
              config.get('JWT_SECRET'),
              { algorithms: ['HS256'] },
              (err, decoded) => {
                if (err) {
                  rej(err);
                }

                res(decoded as JwtPayload);
              }
            );
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
      }

      const context: Context = { prisma, userId: jwtPayload?.id ?? null };

      return {
        schema,
        context,
        graphiql: graphiqlConfig,
      };
    })
  );

  app.listen(config.get('PORT'), () => {
    console.log(
      `Example app listening at http://localhost:${config.get('PORT')}`
    );
  });
})();
