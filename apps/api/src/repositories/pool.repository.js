import { hasDatabase, query } from "../config/db.js";
import { poolModels } from "../services/pools.service.js";

function mapPool(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    dimensions: {
      width: Number(row.width_m),
      length: Number(row.length_m),
      depth: Number(row.depth_m)
    },
    basePrice: Math.round(Number(row.base_price_cents) / 100),
    finish: row.metadata?.finish || row.finish || ""
  };
}

export async function listPoolModels() {
  if (!hasDatabase) return poolModels;

  const result = await query("SELECT * FROM pool_models ORDER BY category, name");
  return result.rows.map(mapPool);
}

export async function findPoolModelById(id) {
  if (!hasDatabase) return poolModels.find((model) => model.id === id) || null;

  const result = await query("SELECT * FROM pool_models WHERE id = $1 LIMIT 1", [id]);
  return result.rows[0] ? mapPool(result.rows[0]) : null;
}
