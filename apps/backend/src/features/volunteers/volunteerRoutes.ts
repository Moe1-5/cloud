import { Router } from "express";
import { createVolunteer, listVolunteers, updateVolunteer } from "./volunteerRepository.js";
import { createVolunteerSchema, updateVolunteerSchema, volunteerIdSchema } from "./volunteerSchemas.js";

export const volunteerRouter = Router();
volunteerRouter.get("/", async (_request, response, next) => { try { response.json({ data: await listVolunteers() }); } catch (error) { next(error); } });
volunteerRouter.post("/", async (request, response, next) => { try { response.status(201).json({ data: await createVolunteer(createVolunteerSchema.parse(request.body)) }); } catch (error) { next(error); } });
volunteerRouter.patch("/:id", async (request, response, next) => { try { const { id } = volunteerIdSchema.parse(request.params); response.json({ data: await updateVolunteer(id, updateVolunteerSchema.parse(request.body)) }); } catch (error) { next(error); } });
