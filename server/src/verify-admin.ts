import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db/mongoose.js";
import { AdminUser } from "./models/AdminUser.js";
import mongoose from "mongoose";

async function verifyAdmin() {
  await connectDB();

  console.log("\n=== ADMIN USER VERIFICATION ===\n");

  // Get all admin users
  const users = await AdminUser.find({});
  console.log(`Total admin users in database: ${users.length}\n`);

  if (users.length === 0) {
    console.log("❌ NO ADMIN USERS FOUND!");
    console.log("Run: npm run db:seed\n");
    await mongoose.connection.close();
    return;
  }

  // Check each user
  for (const user of users) {
    console.log("--- User Found ---");
    console.log(`Email (stored): ${user.email}`);
    console.log(`Email (from env): ${(process.env.ADMIN_EMAIL ?? "").toLowerCase()}`);
    console.log(`Password Hash: ${user.passwordHash.substring(0, 20)}...`);
    console.log(`Created At: ${user.createdAt}\n`);

    // Test password from .env
    const testPassword = process.env.ADMIN_PASSWORD ?? "";
    console.log(`Testing password from ADMIN_PASSWORD env...`);
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    
    if (isValid) {
      console.log(`✅ PASSWORD MATCHES! Login should work with:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${testPassword}\n`);
    } else {
      console.log(`❌ PASSWORD DOES NOT MATCH!`);
      console.log(`   Stored hash doesn't match ADMIN_PASSWORD in .env`);
      console.log(`   Run: npm run db:seed to fix\n`);
    }

    // Test some common password issues
    console.log("--- Testing Common Issues ---");
    
    // Test with extra spaces
    const trimmedPass = testPassword.trim();
    if (trimmedPass !== testPassword) {
      console.log(`⚠️  Warning: Password has leading/trailing spaces`);
    }

    // Test email case sensitivity
    const envEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
    if (user.email !== envEmail) {
      console.log(`⚠️  Warning: Email mismatch!`);
      console.log(`   Database: ${user.email}`);
      console.log(`   .env:     ${envEmail}`);
    }
  }

  await mongoose.connection.close();
  console.log("\n=== VERIFICATION COMPLETE ===\n");
}

verifyAdmin().catch(async (err) => {
  console.error("Error:", err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
