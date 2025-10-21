import { Elysia } from 'elysia';
import { RegisterBody } from './dto';

export const authController = new Elysia({ prefix: '/auth' })
  .post(
    '/sign-in',
    (ctx) => {
      ctx.db;
      return 'todo fino';
    },
    {
      body: RegisterBody,
    }
  )
  .post('/sign-up', 'sign-up');
