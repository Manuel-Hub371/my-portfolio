import mongoose, { Schema, model } from "mongoose";

export interface IService {
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "code" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ sortOrder: 1 });

export const Service = mongoose.models?.Service ?? model<IService>("Service", serviceSchema);

