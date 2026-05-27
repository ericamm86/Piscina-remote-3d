import { z } from "zod";
import { geocodeAddress } from "../services/geocode.service.js";

const schema = z.object({
  address: z.string().min(6, "Informe um endereco mais completo")
});

export async function geocode(req, res) {
  const { address } = schema.parse(req.body);
  const result = await geocodeAddress(address);
  res.json(result);
}
