import { Router } from "express";
import { z } from "zod";
import { estimateProjectCost } from "../services/pools.service.js";

const router = Router();

const schema = z.object({
  poolModelId: z.string(),
  features: z
    .object({
      deck: z.boolean().optional(),
      lighting: z.boolean().optional(),
      trees: z.boolean().optional(),
      gourmet: z.boolean().optional()
    })
    .optional(),
  remoteSensing: z
    .object({
      slopeRisk: z.enum(["low", "medium", "high"]).optional()
    })
    .optional()
});

router.post("/", (req, res, next) => {
  try {
    res.json(estimateProjectCost(schema.parse(req.body)));
  } catch (error) {
    next(error);
  }
});

export default router;
