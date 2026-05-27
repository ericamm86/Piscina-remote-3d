import { listPoolModels } from "../repositories/pool.repository.js";

export async function listPools(_req, res) {
  res.json(await listPoolModels());
}
