import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../data/projects.json");

async function readProjects() {
  try {
    const contents = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeProjects(projects) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2), "utf-8");
}

export async function listProjects() {
  return readProjects();
}

export async function createProject(project) {
  const projects = await readProjects();
  const savedProject = {
    id: nanoid(10),
    status: "concept",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...project
  };

  projects.unshift(savedProject);
  await writeProjects(projects);
  return savedProject;
}
