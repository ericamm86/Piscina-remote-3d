import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();
const demoPasswordHash = bcrypt.hashSync("demo123", 8);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

router.post("/login", (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const passwordOk = bcrypt.compareSync(credentials.password, demoPasswordHash);

    if (!passwordOk) {
      const err = new Error("Credenciais invalidas");
      err.status = 401;
      throw err;
    }

    const user = {
      id: "demo-user",
      name: "Cliente Demo",
      email: credentials.email,
      role: "client"
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || "dev-secret", { expiresIn: "2h" });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

export default router;
