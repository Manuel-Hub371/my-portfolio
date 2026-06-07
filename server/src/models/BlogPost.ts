import mongoose, { Schema, model } from "mongoose";

export interface IBlogPost {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, default: "" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogPostSchema.index({ published: 1, publishedAt: -1 });

export const BlogPost = mongoose.models?.BlogPost ?? model<IBlogPost>("BlogPost", blogPostSchema);

