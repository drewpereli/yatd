import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Todo } from '@generated/type-graphql';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthErrorCode, Context } from '../app';

function isAuthenticated(
  ctx: Context
): ctx is Omit<Context, 'userId'> & { userId: number } {
  return ctx.userId !== null;
}

@Resolver((of) => Todo)
export class TodoResolver {
  @Query((returns) => [Todo])
  async todos(@Ctx() ctx: Context) {
    if (!isAuthenticated(ctx)) throw new Error(AuthErrorCode.NotLoggedIn);

    return ctx.prisma.todo.findMany({
      where: { userId: ctx.userId },
    });
  }

  @Mutation((returns) => Todo)
  async createTodo(
    @Ctx() ctx: Context,
    @Arg('title') title: string,
    @Arg('done', { nullable: true, defaultValue: false }) done: boolean,
    @Arg('description', { nullable: true }) description?: string
  ) {
    if (!isAuthenticated(ctx)) throw new Error(AuthErrorCode.NotLoggedIn);

    return ctx.prisma.todo.create({
      data: {
        title,
        description,
        done,
        userId: ctx.userId,
      },
    });
  }

  @Mutation((returns) => Todo)
  async updateTodo(
    @Ctx() ctx: Context,
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Arg('done', { nullable: true, defaultValue: false }) done: boolean,
    @Arg('description', { nullable: true }) description?: string
  ) {
    if (!isAuthenticated(ctx)) throw new Error(AuthErrorCode.NotLoggedIn);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id: Number(id),
        userId: ctx.userId,
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    const updatedTodo = await ctx.prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        done,
        title,
        description,
      },
    });

    return updatedTodo;
  }

  @Mutation((returns) => Todo)
  async deleteTodo(@Ctx() ctx: Context, @Arg('id') id: number) {
    if (!isAuthenticated(ctx)) throw new Error(AuthErrorCode.NotLoggedIn);

    const todo = await ctx.prisma.todo.findFirst({
      where: {
        id,
        userId: ctx.userId,
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    await ctx.prisma.todo.delete({
      where: {
        id,
      },
    });

    return todo;
  }
}

@Resolver()
export class UserResolver {
  @Mutation((returns) => String)
  async createUser(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    if (!isStrongPassword(password))
      throw new Error(AuthErrorCode.WeakPassword);

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error(AuthErrorCode.UsernameTaken);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return generateAccessToken(user);
  }

  @Query((returns) => String)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error(AuthErrorCode.AuthFailed);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error(AuthErrorCode.AuthFailed);
    }

    return generateAccessToken(user);
  }
}

export type JwtPayload = {
  id: number;
  username: string;
};

function generateAccessToken(user: User) {
  const payload: JwtPayload = { id: user.id, username: user.username };

  return jwt.sign(payload, config.get('JWT_SECRET'), { algorithm: 'HS256' });
}

function isStrongPassword(password: string) {
  return password.length >= 8;
}
