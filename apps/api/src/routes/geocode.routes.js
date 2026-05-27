import { Router } from "express";
import { z } from "zod";
import { geocodeAddress } from "../services/geocode.service.js";

const router = Router();
const schema = z.object({
  address: z.string().min(6, "Informe um endereco mais completo")
});

router.post("/", async (req, res, next) => {
  try {
    const { address } = schema.parse(req.body);
    const result = await geocodeAddress(address);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
