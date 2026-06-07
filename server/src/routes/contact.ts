import { Router } from "express";
import { z } from "zod";
import { ContactSubmission } from "../models/ContactSubmission.js";

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(500),
  message: z.string().min(1).max(10000),
});

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid form data", details: parsed.error.flatten() });
    return;
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await ContactSubmission.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: "Contact form submitted successfully." });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Failed to save submission." });
  }
});

contactRouter.get("/", async (_req, res) => {
  try {
    const submissions = await ContactSubmission.find()
      .select("id name email subject createdAt")
      .sort({ createdAt: -1 })
      .limit(50);
    
    // map _id to id to keep the API payload backward compatible
    const formatted = submissions.map(sub => ({
      id: sub._id.toString(),
      name: sub.name,
      email: sub.email,
      subject: sub.subject,
      created_at: sub.createdAt,
    }));
    
    res.json({ submissions: formatted });
  } catch (err) {
    console.error("Get contact submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});
