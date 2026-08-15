import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "./userRepository.js";

import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "./userSchemas.js";

export const userRouter = Router();

userRouter.get(
  "/",
  async (_request, response, next) => {
    try {
      const users = await listUsers();

      response.json({
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/",
  async (request, response, next) => {
    try {
      const input = createUserSchema.parse(
        request.body
      );

      const user = await createUser(input);

      response.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } = userIdSchema.parse(
        request.params
      );

      const user = await getUserById(id);

      response.json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.patch(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } = userIdSchema.parse(
        request.params
      );

      const input = updateUserSchema.parse(
        request.body
      );

      const user = await updateUser(
        id,
        input
      );

      response.json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/:id",
  async (request, response, next) => {
    try {
      const { id } = userIdSchema.parse(
        request.params
      );

      await deleteUser(id);

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);