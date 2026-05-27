import { z } from "zod";
import { estimateProjectCost } from "../services/pools.service.js";

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
  materials: z
    .object({
      interior: z.string().optional(),
      coping: z.string().optional(),
      deck: z.string().optional(),
      lighting: z.string().optional()
    })
    .optional(),
  remoteSensing: z
    .object({
      slopeRisk: z.enum(["low", "medium", "high"]).optional()
    })
    .optional()
});

export function estimate(req, res) {
  res.json(estimateProjectCost(schema.parse(req.body)));
}
