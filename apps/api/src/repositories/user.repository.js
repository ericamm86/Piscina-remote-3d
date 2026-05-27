import { nanoid } from "nanoid";
import { hasDatabase, query } from "../config/db.js";

const memoryUsers = [];

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash ?? row.passwordHash,
    role: row.role,
    createdAt: row.created_at ?? row.createdAt
  };
}

export async function findUserByEmail(email) {
  if (!hasDatabase) {
    return memoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  const result = await query("SELECT * FROM users WHERE lower(email) = lower($1) LIMIT 1", [email]);
  return mapUser(result.rows[0]);
}

export async function findUserById(id) {
  if (!hasDatabase) {
    return memoryUsers.find((user) => user.id === id) || null;
  }

  const result = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
  return mapUser(result.rows[0]);
}

export async function createUser({ name, email, passwordHash, role = "client" }) {
  if (!hasDatabase) {
    const user = {
      id: nanoid(12),
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString()
    };
    memoryUsers.push(user);
    return user;
  }

  const result = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, passwordHash, role]
  );
  return mapUser(result.rows[0]);
}

export async function listUsers() {
  if (!hasDatabase) {
    return memoryUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
  }

  const result = await query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  }));
}
