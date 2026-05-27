import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const webDistDir = resolve(rootDir, "apps", "web", "dist");
const publicDir = resolve(rootDir, "public");

if (!existsSync(webDistDir)) {
  throw new Error(`Web build output not found: ${webDistDir}`);
}

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });
cpSync(webDistDir, publicDir, { recursive: true });

console.log("Vercel static output prepared in /public");
