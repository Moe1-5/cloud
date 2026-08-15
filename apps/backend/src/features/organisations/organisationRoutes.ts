import { Router } from "express";

import {
  createOrganisation,
  deleteOrganisation,
  getOrganisationById,
  listOrganisations,
  updateOrganisation,
} from "./organisationRepository.js";

import {
  createOrganisationSchema,
  organisationIdSchema,
  updateOrganisationSchema,
} from "./organisationSchemas.js";

export const organisationRouter =
  Router();

organisationRouter.get(
  "/",
  async (
    _request,
    response,
    next
  ) => {
    try {
      const organisations =
        await listOrganisations();

      response.json({
        data: organisations,
      });
    } catch (error) {
      next(error);
    }
  }
);

organisationRouter.post(
  "/",
  async (
    request,
    response,
    next
  ) => {
    try {
      const input =
        createOrganisationSchema.parse(
          request.body
        );

      const organisation =
        await createOrganisation(
          input
        );

      response.status(201).json({
        data: organisation,
      });
    } catch (error) {
      next(error);
    }
  }
);

organisationRouter.get(
  "/:id",
  async (
    request,
    response,
    next
  ) => {
    try {
      const { id } =
        organisationIdSchema.parse(
          request.params
        );

      const organisation =
        await getOrganisationById(
          id
        );

      response.json({
        data: organisation,
      });
    } catch (error) {
      next(error);
    }
  }
);

organisationRouter.patch(
  "/:id",
  async (
    request,
    response,
    next
  ) => {
    try {
      const { id } =
        organisationIdSchema.parse(
          request.params
        );

      const input =
        updateOrganisationSchema.parse(
          request.body
        );

      const organisation =
        await updateOrganisation(
          id,
          input
        );

      response.json({
        data: organisation,
      });
    } catch (error) {
      next(error);
    }
  }
);

organisationRouter.delete(
  "/:id",
  async (
    request,
    response,
    next
  ) => {
    try {
      const { id } =
        organisationIdSchema.parse(
          request.params
        );

      await deleteOrganisation(id);

      response
        .status(204)
        .send();
    } catch (error) {
      next(error);
    }
  }
);