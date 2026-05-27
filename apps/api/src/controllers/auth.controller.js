import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import { httpError } from "../utils/httpError.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "admin"]).optional()
});

const loginSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4)
});

function signToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function register(req, res) {
  const input = registerSchema.parse(req.body);
  const existing = await findUserByEmail(input.email);
  if (existing) throw httpError(409, "Email ja cadastrado");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role || "client"
  });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const credentials = loginSchema.parse(req.body);
  let user = await findUserByEmail(credentials.email);
  if (!user && credentials.email === "cliente@demo.com" && credentials.password === "demo123") {
    user = await createUser({
      name: credentials.name,
      email: credentials.email,
      passwordHash: await bcrypt.hash(credentials.password, 10),
      role: "client"
    });
  }
  if (!user) throw httpError(401, "Credenciais invalidas");
  if (user.name.trim().toLowerCase() !== credentials.name.trim().toLowerCase()) {
    throw httpError(401, "Nome, email ou senha invalidos");
  }

  const passwordOk = await bcrypt.compare(credentials.password, user.passwordHash);
  if (!passwordOk) throw httpError(401, "Credenciais invalidas");

  res.json({ token: signToken(user), user: publicUser(user) });
}

export function me(req, res) {
  res.json({ user: req.user });
}
