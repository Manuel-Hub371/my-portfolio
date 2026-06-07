import { Router } from "express";
import { z } from "zod";
import { Service } from "../../models/Service.js";
import { requireAuth } from "../../middleware/auth.js";

const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).default("code"),
  sortOrder: z.number().int().optional(),
});

export const adminServicesRouter = Router();
adminServicesRouter.use(requireAuth);

adminServicesRouter.get("/", async (_req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, _id: 1 });
    const formatted = services.map(s => ({
      id: s._id.toString(),
      title: s.title,
      description: s.description,
      icon: s.icon,
      sort_order: s.sortOrder,
    }));
    res.json({ services: formatted });
  } catch (err) {
    console.error("Admin get services error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminServicesRouter.post("/", async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid service data" });
    return;
  }
  const { title, description, icon, sortOrder } = parsed.data;
  try {
    const service = await Service.create({
      title,
      description,
      icon,
      sortOrder: sortOrder ?? 0,
    });
    res.status(201).json({
      service: {
        id: service._id.toString(),
        title: service.title,
        description: service.description,
        icon: service.icon,
        sort_order: service.sortOrder,
      }
    });
  } catch (err) {
    console.error("Admin post service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminServicesRouter.put("/:id", async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid service data" });
    return;
  }
  const { title, description, icon, sortOrder } = parsed.data;
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, icon, sortOrder: sortOrder ?? 0, updatedAt: new Date() },
      { new: true }
    );
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json({
      service: {
        id: service._id.toString(),
        title: service.title,
        description: service.description,
        icon: service.icon,
        sort_order: service.sortOrder,
      }
    });
  } catch (err) {
    console.error("Admin put service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminServicesRouter.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
