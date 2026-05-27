import jwt from "jsonwebtoken";

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    req.user = jwt.verify(header.replace("Bearer ", ""), process.env.JWT_SECRET || "dev-secret");
  } catch {
    req.user = null;
  }

  next();
}
