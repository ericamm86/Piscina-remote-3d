import { Router } from "express";
import { poolModels } from "../services/pools.service.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(poolModels);
});

export default router;
