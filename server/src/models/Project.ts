import mongoose, { Schema, model } from "mongoose";

export interface IProject {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  challenges: string[];
  results: string[];
  github: string;
  demo: string;
  image: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    results: { type: [String], default: [] },
    github: { type: String, default: "" },
    demo: { type: String, default: "" },
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ sortOrder: 1 });

export const Project = mongoose.models?.Project ?? model<IProject>("Project", projectSchema);

