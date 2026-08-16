import { Router } from "express";
import { login, getSessionUser, registerAffectedUser } from "./authRepository.js";
import { loginSchema, registerAffectedUserSchema } from "./authSchemas.js";
import { authenticateRequest, type AuthenticatedRequest } from "./authMiddleware.js";
import { verifyAuthToken } from "./token.js";

export const authRouter = Router();

authRouter.post("/login", async (request, response, next) => {
  try {
    const input = loginSchema.parse(request.body);
    const session = await login(input);

    response.json({
      data: session
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register/affected-user", async (request, response, next) => {
  try {
    const input = registerAffectedUserSchema.parse(request.body);
    const session = await registerAffectedUser(input);

    response.status(201).json({
      data: session
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get(
  "/me",
  authenticateRequest,
  async (request: AuthenticatedRequest, response, next) => {
    try {
      const authorizationHeader = request.headers.authorization;
      const token = authorizationHeader?.startsWith("Bearer ")
        ? authorizationHeader.slice("Bearer ".length)
        : "";
      const payload = request.auth ?? verifyAuthToken(token);
      const user = await getSessionUser(payload);

      response.json({
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);
