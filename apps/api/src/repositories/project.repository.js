import { nanoid } from "nanoid";
import { hasDatabase, query } from "../config/db.js";

const memoryProjects = [];

function mapProject(row) {
  return {
    id: row.id,
    ownerId: row.owner_id ?? row.ownerId,
    name: row.name,
    address: row.address,
    coordinates: row.lat && row.lng ? { lat: Number(row.lat), lng: Number(row.lng) } : row.coordinates,
    poolModelId: row.pool_model_id ?? row.poolModelId,
    poolConfig: row.pool_config ?? row.poolConfig,
    remoteSensing: row.remote_sensing ?? row.remoteSensing,
    estimate: row.estimate,
    status: row.status,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt
  };
}

export async function listProjectsByOwner(ownerId, role = "client") {
  if (!hasDatabase) {
    return memoryProjects.filter((project) => role === "admin" || project.ownerId === ownerId);
  }

  const sql =
    role === "admin"
      ? `SELECT id, owner_id, name, address, ST_Y(coordinate::geometry) AS lat, ST_X(coordinate::geometry) AS lng,
          pool_model_id, pool_config, remote_sensing, estimate, status, created_at, updated_at
         FROM projects ORDER BY created_at DESC`
      : `SELECT id, owner_id, name, address, ST_Y(coordinate::geometry) AS lat, ST_X(coordinate::geometry) AS lng,
          pool_model_id, pool_config, remote_sensing, estimate, status, created_at, updated_at
         FROM projects WHERE owner_id = $1 ORDER BY created_at DESC`;

  const result = await query(sql, role === "admin" ? [] : [ownerId]);
  return result.rows.map(mapProject);
}

export async function createProject(project) {
  if (!hasDatabase) {
    const savedProject = {
      id: nanoid(10),
      status: "concept",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...project
    };
    memoryProjects.unshift(savedProject);
    return savedProject;
  }

  const result = await query(
    `INSERT INTO projects (
      owner_id, name, address, coordinate, pool_model_id, pool_config, remote_sensing, estimate, status
    ) VALUES (
      $1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, $6, $7, $8, $9, $10
    )
    RETURNING id, owner_id, name, address, ST_Y(coordinate::geometry) AS lat, ST_X(coordinate::geometry) AS lng,
      pool_model_id, pool_config, remote_sensing, estimate, status, created_at, updated_at`,
    [
      project.ownerId,
      project.name,
      project.address,
      project.coordinates.lng,
      project.coordinates.lat,
      project.poolModelId,
      project.poolConfig,
      project.remoteSensing || {},
      project.estimate || null,
      "concept"
    ]
  );

  return mapProject(result.rows[0]);
}
