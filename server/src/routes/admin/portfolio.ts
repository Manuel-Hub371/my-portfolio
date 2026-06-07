import { Router } from "express";
import { z } from "zod";
import { PortfolioProfile } from "../../models/PortfolioProfile.js";
import { requireAuth } from "../../middleware/auth.js";

const portfolioSchema = z.object({
  siteConfig: z.record(z.unknown()),
  aboutContent: z.record(z.unknown()),
});

export const adminPortfolioRouter = Router();
adminPortfolioRouter.use(requireAuth);

adminPortfolioRouter.get("/", async (_req, res) => {
  try {
    const profile = await PortfolioProfile.findOne();
    res.json({
      siteConfig: profile?.siteConfig ?? {},
      aboutContent: profile?.aboutContent ?? {},
      updatedAt: profile?.updatedAt,
    });
  } catch (err) {
    console.error("Admin get portfolio error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminPortfolioRouter.put("/", async (req, res) => {
  const parsed = portfolioSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid portfolio data", details: parsed.error.flatten() });
    return;
  }

  const { siteConfig, aboutContent } = parsed.data;

  try {
    const profile = await PortfolioProfile.findOneAndUpdate(
      {},
      { siteConfig, aboutContent, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, siteConfig: profile.siteConfig, aboutContent: profile.aboutContent });
  } catch (err) {
    console.error("Admin put portfolio error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
