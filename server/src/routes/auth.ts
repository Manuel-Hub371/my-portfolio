import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AdminUser } from "../models/AdminUser.js";
import { signToken } from "../middleware/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password format" });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const userIdStr = user._id.toString();
    const token = signToken({ userId: userIdStr, email: user.email });
    res.json({
      token,
      user: { id: userIdStr, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(503).json({ error: "Server error during login. Check that MongoDB is running." });
  }
});
