import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../repositories/user.repository.js";
import { httpError } from "../utils/httpError.js";

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    req.user = jwt.verify(header.replace("Bearer ", ""), env.jwtSecret);
  } catch {
    req.user = null;
  }

  next();
}

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw httpError(401, "Bearer token obrigatorio");

    const payload = jwt.verify(header.replace("Bearer ", ""), env.jwtSecret);
    const user = await findUserById(payload.id);
    if (!user) throw httpError(401, "Usuario nao encontrado para este token");

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    if (!error.status) error.status = 401;
    next(error);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, "Permissao insuficiente"));
    }
    next();
  };
}
