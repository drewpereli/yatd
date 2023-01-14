import express from 'express';
import { PrismaClient, User } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const prisma = new PrismaClient();

const router = express.Router();

export enum AuthErrorCode {
  AuthFailed = 'auth_failed',
  MissingParams = 'missing_params',
  MismatchedPasswords = 'mismatched_passwords',
  WeakPassword = 'weak_password',
  UsernameTaken = 'username_taken',
}

router.post(
  '/signup',
  body('username')
    .isString()
    .notEmpty()
    .withMessage(AuthErrorCode.MissingParams),
  body('password').isStrongPassword().withMessage(AuthErrorCode.WeakPassword),
  body('password_confirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage(AuthErrorCode.MismatchedPasswords),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: AuthErrorCode.UsernameTaken }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });

    const access_token = generateAccessToken(user);

    res.json({ access_token, username: user.username });
  }
);

router.post(
  '/login',
  body('username')
    .isString()
    .notEmpty()
    .withMessage(AuthErrorCode.MissingParams),
  body('password')
    .isString()
    .notEmpty()
    .withMessage(AuthErrorCode.MissingParams),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: AuthErrorCode.AuthFailed }] });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(400)
        .json({ errors: [{ msg: AuthErrorCode.AuthFailed }] });
    }

    const access_token = generateAccessToken(user);

    res.json({ access_token, username: user.username });
  }
);

export type JwtPayload = {
  id: number;
  username: string;
};

function generateAccessToken(user: User) {
  const payload: JwtPayload = { id: user.id, username: user.username };

  return jwt.sign(payload, config.get('JWT_SECRET'), { algorithm: 'HS256' });
}

export default router;
