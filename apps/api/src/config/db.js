import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const hasDatabase = Boolean(env.databaseUrl);

export const pool = hasDatabase
  ? new Pool({
      connectionString: env.databaseUrl,
      ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : false
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    const error = new Error("DATABASE_URL nao configurada");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }

  return pool.query(text, params);
}
