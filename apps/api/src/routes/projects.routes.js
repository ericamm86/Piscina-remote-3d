import { Router } from "express";
import { listProjects, saveProject } from "../controllers/projects.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listProjects));
router.post("/", asyncHandler(saveProject));

export default router;
