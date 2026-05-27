import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import estimateRoutes from "./routes/estimate.routes.js";
import geocodeRoutes from "./routes/geocode.routes.js";
import poolRoutes from "./routes/pools.routes.js";
import projectRoutes from "./routes/projects.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4200;

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
      const isLocalDev = /^http:\/\/localhost:517\d$/.test(origin || "");
      if (!origin || origin === allowedOrigin || isLocalDev) return callback(null, true);
      return callback(new Error("Origem nao permitida por CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PoolSight Remote 3D API",
    remoteSensing: ["geocoding", "satellite-imagery", "gis", "3d-visualization"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/pools", poolRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/estimate", estimateRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Erro interno",
    details: err.details
  });
});

app.listen(port, () => {
  console.log(`PoolSight API running at http://localhost:${port}`);
});
