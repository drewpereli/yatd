import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { expressjwt, Request as JwtRequest } from 'express-jwt';
import config from '../config';
import { JwtPayload } from './auth-routes';

const prisma = new PrismaClient();

const router = express.Router();

router.get(
  '/',
  expressjwt({ secret: config.get('JWT_SECRET'), algorithms: ['HS256'] }),

  async (req: JwtRequest<JwtPayload>, res) => {
    const todos = await prisma.todo.findMany({
      where: { userId: req.auth!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(todos);
  }
);

router.post(
  '/',
  expressjwt({ secret: config.get('JWT_SECRET'), algorithms: ['HS256'] }),
  async (req: JwtRequest<JwtPayload>, res) => {
    try {
      const todo = await prisma.todo.create({
        data: {
          done: req.body.done,
          title: req.body.title,
          description: req.body.description,
          userId: req.auth!.id,
        },
      });

      res.json(todo);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        res.status(400).json({ message: 'Invalid body' });
      } else {
        console.error(error);
        res.status(500).json({ message: 'There was an error' });
      }
    }
  }
);

router.put(
  '/:id',
  expressjwt({ secret: config.get('JWT_SECRET'), algorithms: ['HS256'] }),
  async (req: JwtRequest<JwtPayload>, res) => {
    try {
      const todo = await prisma.todo.findFirst({
        where: {
          id: Number(req.params.id),
          userId: req.auth!.id,
        },
      });

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      const updatedTodo = await prisma.todo.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          done: req.body.done,
          title: req.body.title,
          description: req.body.description,
        },
      });

      res.json(updatedTodo);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        res.status(400).json({ message: 'Invalid body' });
      } else {
        console.error(error);
        res.status(500).json({ message: 'There was an error' });
      }
    }
  }
);

export default router;
