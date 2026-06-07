import mongoose, { Schema, model } from "mongoose";

export interface IContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, maxlength: 255 },
    email: { type: String, required: true, maxlength: 255 },
    subject: { type: String, required: true, maxlength: 500 },
    message: { type: String, required: true, maxlength: 10000 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

contactSubmissionSchema.index({ createdAt: -1 });

export const ContactSubmission =
  mongoose.models?.ContactSubmission ??
  model<IContactSubmission>("ContactSubmission", contactSubmissionSchema);

