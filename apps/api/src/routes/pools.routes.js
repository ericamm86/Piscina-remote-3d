import { Router } from "express";
import { listPools } from "../controllers/pools.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listPools));

export default router;
