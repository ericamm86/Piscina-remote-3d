import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../../..");

if (!pool) {
  console.error("DATABASE_URL nao configurada. Configure a string do Neon antes de rodar este script.");
  process.exit(1);
}

const schema = await fs.readFile(path.join(root, "database/schema.sql"), "utf-8");
const seed = await fs.readFile(path.join(root, "database/seed.sql"), "utf-8");

await pool.query(schema);
await pool.query(seed);
await pool.end();

console.log("Banco PostgreSQL/Neon inicializado com sucesso.");
