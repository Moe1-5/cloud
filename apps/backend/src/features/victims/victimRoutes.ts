import { Router } from "express";
import { addAssistance, createVictim, getVictim, listVictims, updateVictim } from "./victimRepository.js";
import { addAssistanceSchema, createVictimSchema, updateVictimSchema, victimIdSchema } from "./victimSchemas.js";

export const victimRouter = Router();
victimRouter.get("/", async (request, response, next) => { try { response.json({ data: await listVictims(String(request.query.search ?? "")) }); } catch (error) { next(error); } });
victimRouter.post("/", async (request, response, next) => { try { response.status(201).json({ data: await createVictim(createVictimSchema.parse(request.body)) }); } catch (error) { next(error); } });
victimRouter.get("/:id", async (request, response, next) => { try { const { id } = victimIdSchema.parse(request.params); response.json({ data: await getVictim(id) }); } catch (error) { next(error); } });
victimRouter.patch("/:id", async (request, response, next) => { try { const { id } = victimIdSchema.parse(request.params); response.json({ data: await updateVictim(id, updateVictimSchema.parse(request.body)) }); } catch (error) { next(error); } });
victimRouter.post("/:id/assistance", async (request, response, next) => { try { const { id } = victimIdSchema.parse(request.params); response.status(201).json({ data: await addAssistance(id, addAssistanceSchema.parse(request.body)) }); } catch (error) { next(error); } });
