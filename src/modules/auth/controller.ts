import { Elysia } from "elysia";
import { RegisterBody } from "./dto";

export const authController = new Elysia({ prefix: "/auth" })
  .post(
    "/sign-in",
    (context) => {
      return "todo fino";
    },
    {
      body: RegisterBody,
    },
  )
  .post("/sign-up", "sign-up");
