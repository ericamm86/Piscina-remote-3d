import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { hasDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";
import geocodeRoutes from "./routes/geocode.routes.js";
import poolRoutes from "./routes/pools.routes.js";
import projectRoutes from "./routes/projects.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = env.clientOrigin.split(",").map((item) => item.trim());
      const isLocalDev = /^http:\/\/localhost:517\d$/.test(origin || "");
      if (!origin || allowedOrigins.includes(origin) || isLocalDev) return callback(null, true);
      return callback(new Error("Origem nao permitida por CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PoolSight Remote 3D API",
    database: hasDatabase ? "postgres" : "memory-fallback",
    remoteSensing: ["geocoding", "satellite-imagery", "gis", "3d-visualization"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/pools", poolRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    error: err.message || "Erro interno",
    details: err.details
  });
});
