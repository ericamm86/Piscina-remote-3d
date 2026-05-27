import { z } from "zod";
import { createProject, listProjectsByOwner } from "../repositories/project.repository.js";

const projectSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(6),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  poolModelId: z.string(),
  poolConfig: z.record(z.any()),
  estimate: z.record(z.any()).nullable().optional(),
  remoteSensing: z.record(z.any()).optional()
});

export async function listProjects(req, res) {
  const projects = await listProjectsByOwner(req.user.id, req.user.role);
  res.json(projects);
}

export async function saveProject(req, res) {
  const project = projectSchema.parse(req.body);
  const saved = await createProject({
    ...project,
    ownerId: req.user.id
  });
  res.status(201).json(saved);
}
