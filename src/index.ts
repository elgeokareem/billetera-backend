import { Elysia } from "elysia";
import { routes } from "./routes";
import { logger } from "./plugins/logger";

const app = new Elysia()
  .use(logger) // global logging
  .get("/", () => "Hello Elysia")
  .get("/ping", "pong")
  .use(routes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
