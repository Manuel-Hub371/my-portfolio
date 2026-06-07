import mongoose, { Schema, model } from "mongoose";

export interface IAdminUser {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const AdminUser = mongoose.models?.AdminUser ?? model<IAdminUser>("AdminUser", adminUserSchema);

