import { Router } from "express";
import { estimate } from "../controllers/estimate.controller.js";

const router = Router();

router.post("/", estimate);

export default router;
