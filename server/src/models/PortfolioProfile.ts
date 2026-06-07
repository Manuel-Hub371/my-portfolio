import mongoose, { Schema, model } from "mongoose";

export interface IPortfolioProfile {
  siteConfig: Record<string, unknown>;
  aboutContent: Record<string, unknown>;
  updatedAt: Date;
}

const portfolioProfileSchema = new Schema<IPortfolioProfile>(
  {
    siteConfig: { type: Schema.Types.Mixed, default: {} },
    aboutContent: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

export const PortfolioProfile =
  mongoose.models?.PortfolioProfile ??
  model<IPortfolioProfile>("PortfolioProfile", portfolioProfileSchema);

