# Fix Admin Login - Seed Database

## Problem
The admin user doesn't exist in your MongoDB database yet. The password verification is failing because there's no user record to compare against.

## Solution: Seed the Database

### Option 1: Seed Locally (Recommended)

1. **Make sure your `.env` is correct:**
```env
ADMIN_EMAIL=a94jnr200@gmail.com
ADMIN_PASSWORD=Darkovybz123
MONGODB_URI="mongodb+srv://emmanuelsite:Darkovybz123@cluster0.5m8indr.mongodb.net/?appName=Cluster0"
```

2. **Run the seed script:**
```bash
cd server
npm run db:seed
```

This will:
- ✅ Clear existing admin users
- ✅ Hash the password from `ADMIN_PASSWORD`
- ✅ Create admin user with email: `a94jnr200@gmail.com`
- ✅ Seed default portfolio content
- ✅ Create sample services, projects, and blog posts

3. **Verify it worked:**
You should see:
```
Database seeded successfully with MongoDB.
Admin login: a94jnr200@gmail.com / (password from ADMIN_PASSWORD env)
```

### Option 2: Seed on Render (Production)

If you want to seed the production database directly:

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Go to Shell tab**
4. **Run the seed command:**
```bash
npm run db:seed
```

---

## After Seeding

### Test Login Locally:
```bash
# In server directory
npm run dev
```

Then try logging in at: `http://localhost:3001/admin/login`

**Credentials:**
- Email: `a94jnr200@gmail.com`
- Password: `Darkovybz123`

### Test Login on Production:
After seeding, visit: `https://emmanuleportfolio.netlify.app/admin/login`

**Credentials:**
- Email: `a94jnr200@gmail.com`
- Password: `Darkovybz123`

---

## How It Works

The seed script:
1. Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
2. Uses `bcrypt.hash(password, 12)` to hash the password
3. Stores the hashed password in MongoDB
4. When you login, it uses `bcrypt.compare(enteredPassword, storedHash)` to verify

---

## Troubleshooting

### "Database seeded successfully" but still can't login:
1. Check you're using the exact email: `a94jnr200@gmail.com` (lowercase)
2. Check you're using the exact password: `Darkovybz123`
3. Clear browser cache and cookies
4. Check network tab in browser dev tools for API errors

### Connection Error:
If you see "Cannot connect to MongoDB", check:
1. MongoDB URI is correct
2. IP whitelist on MongoDB Atlas (allow all: `0.0.0.0/0`)
3. Network connectivity

### Wrong Database:
If you seeded the wrong database, check the `MONGODB_URI` in both:
- Local `.env` (for local seeding)
- Render environment variables (for production)

Make sure they point to the same database if you want the same admin user.
