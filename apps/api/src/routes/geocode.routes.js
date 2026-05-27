import { Router } from "express";
import { geocode } from "../controllers/geocode.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(geocode));

export default router;
