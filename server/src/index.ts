import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./db/mongoose.js";
import { contactRouter } from "./routes/contact.js";
import { authRouter } from "./routes/auth.js";
import { contentRouter } from "./routes/content.js";
import { adminPortfolioRouter } from "./routes/admin/portfolio.js";
import { adminServicesRouter } from "./routes/admin/services.js";
import { adminProjectsRouter } from "./routes/admin/projects.js";
import { adminBlogRouter } from "./routes/admin/blog.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT ?? 4000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

app.use(
  cors({
    origin: [
      CLIENT_URL,
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", async (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.json({ status: "ok", service: "portfolio-api", database: "connected" });
  } else {
    res.status(503).json({ status: "degraded", service: "portfolio-api", database: "disconnected" });
  }
});

app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);

app.use("/api/admin/portfolio", adminPortfolioRouter);
app.use("/api/admin/services", adminServicesRouter);
app.use("/api/admin/projects", adminProjectsRouter);
app.use("/api/admin/blog", adminBlogRouter);

app.get("/api/auth/me", (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const payload = verifyToken(header.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  res.json({ user: { id: payload.userId, email: payload.email } });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Portfolio API running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

