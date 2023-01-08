import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';

const prisma = new PrismaClient();

const router = express.Router();

router.get('/', async (req, res) => {
  const todos = await prisma.todo.findMany();

  res.json(todos);
});

router.post('/', async (req, res) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        done: req.body.done,
        content: req.body.content,
        title: req.body.title,
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
});

export default router;
