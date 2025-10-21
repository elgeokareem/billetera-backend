import { Elysia } from 'elysia';
import { routes } from './routes';
import { dbPlugin } from './plugins/db';
import { logger } from './plugins/logger';

const app = new Elysia()
  .use(dbPlugin)
  .use(logger) // global logging
  .use(routes)
  .get('/', () => 'Hello Elysia')
  .get('/ping', 'pong')
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
