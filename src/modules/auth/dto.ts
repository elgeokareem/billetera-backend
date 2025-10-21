import { t } from 'elysia';

export const RegisterBody = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 8 }),
});

export const LoginBody = RegisterBody;
