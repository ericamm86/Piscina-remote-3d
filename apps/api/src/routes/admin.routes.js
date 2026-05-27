import { Router } from "express";
import { adminOverview } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/overview", requireAuth, requireRole("admin"), asyncHandler(adminOverview));

export default router;
