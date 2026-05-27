import { Router } from "express";
import { z } from "zod";
import { optionalAuth } from "../middleware/auth.js";
import { createProject, listProjects } from "../services/projectStore.js";

const router = Router();

const projectSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(6),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  poolModelId: z.string(),
  poolConfig: z.record(z.any()),
  estimate: z.record(z.any()).optional(),
  remoteSensing: z.record(z.any()).optional()
});

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listProjects());
  } catch (error) {
    next(error);
  }
});

router.post("/", optionalAuth, async (req, res, next) => {
  try {
    const project = projectSchema.parse(req.body);
    const saved = await createProject({
      ...project,
      ownerId: req.user?.id || "anonymous-demo"
    });
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

export default router;
