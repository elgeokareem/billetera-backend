import Elysia from "elysia";
import { authController } from "./modules/auth/controller";

export const routes = new Elysia().use(authController);
