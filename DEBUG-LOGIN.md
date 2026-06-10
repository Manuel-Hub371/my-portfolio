# Debug Login Issue - Step by Step

## ✅ Backend is Working!

I just tested your backend API directly and it works perfectly:
```bash
curl -X POST https://my-portfolio-1-jvzw.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a94jnr200@gmail.com","password":"Darkovybz123"}'

# Response: ✅ 200 OK with JWT token
```

**This means:**
- ✅ Backend server is running
- ✅ MongoDB is connected
- ✅ Admin user exists in database
- ✅ Password verification works
- ✅ Credentials are correct

---

## 🔍 The Problem is Frontend → Backend Connection

Since backend works but frontend login fails, the issue is:

### Possible Causes:
1. **Netlify hasn't rebuilt with new environment variable**
2. **CORS is blocking requests** 
3. **Frontend is calling wrong URL**
4. **Environment variable not set on Netlify**

---

## 🛠️ How to Fix:

### Step 1: Check Netlify Environment Variables

1. Go to: https://app.netlify.com
2. Select your site: `emmanuleportfolio`
3. Go to **Site configuration** → **Environment variables**
4. Check if `NEXT_PUBLIC_API_URL` exists
5. If missing or wrong, add/update it:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://my-portfolio-1-jvzw.onrender.com
   ```
6. **Save** (this will trigger a rebuild)

### Step 2: Verify Render Environment Variables

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Verify these variables exist:
   ```
   CLIENT_URL = https://emmanuleportfolio.netlify.app
   ADMIN_EMAIL = a94jnr200@gmail.com
   ADMIN_PASSWORD = Darkovybz123
   MONGODB_URI = mongodb+srv://emmanuelsite:Darkovybz123@cluster0.5m8indr.mongodb.net/?appName=Cluster0
   JWT_SECRET = use-a-long-random-secret-in-production
   PORT = 4000
   ```
5. If `CLIENT_URL` is wrong/missing, update it and **redeploy**

### Step 3: Force Netlify Rebuild

After setting environment variables:
1. Go to **Deploys** tab on Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for build to complete (3-5 minutes)

### Step 4: Test Again

After rebuild completes:
1. Visit: https://emmanuleportfolio.netlify.app/admin/login
2. Open browser **Developer Tools** (F12)
3. Go to **Network** tab
4. Try logging in with:
   - Email: `a94jnr200@gmail.com`
   - Password: `Darkovybz123`
5. Watch the Network tab for the login request

---

## 🔍 What to Look For in Network Tab:

### If Request Shows:
- **URL:** Should be `https://my-portfolio-1-jvzw.onrender.com/api/auth/login`
- **Status:** Should be `200 OK` (not 401, 404, or CORS error)
- **Response:** Should contain `{"token":"...", "user":{...}}`

### Common Issues:

#### ❌ CORS Error:
```
Access to fetch at 'https://my-portfolio-1-jvzw.onrender.com/api/auth/login' 
from origin 'https://emmanuleportfolio.netlify.app' has been blocked by CORS policy
```
**Fix:** Update `CLIENT_URL` on Render and redeploy backend

#### ❌ Wrong URL (404):
```
POST http://localhost:4000/api/auth/login - Failed to fetch
```
**Fix:** Environment variable not set on Netlify - see Step 1

#### ❌ 401 Unauthorized:
```
Status: 401
Response: {"error":"Invalid email or password"}
```
**Fix:** Check you're typing credentials exactly:
- Email: `a94jnr200@gmail.com` (lowercase, no spaces)
- Password: `Darkovybz123` (case-sensitive, exact match)

---

## Quick Test - Try This Now:

1. Open a new browser tab (incognito/private mode)
2. Open Developer Tools (F12) → Network tab
3. Go to: https://emmanuleportfolio.netlify.app/admin/login
4. Try logging in
5. Look at the Network request to `/api/auth/login`
6. **Screenshot the error** and check what it says

---

## Most Likely Issue:

Based on your symptoms, **I believe the environment variable `NEXT_PUBLIC_API_URL` is not set on Netlify**.

This means the frontend is trying to call `http://localhost:4000` instead of `https://my-portfolio-1-jvzw.onrender.com`.

**Follow Step 1 above to fix this!**

---

## After You Fix:

The login should work immediately. You'll be able to:
- ✅ Login with `a94jnr200@gmail.com` / `Darkovybz123`
- ✅ Access admin dashboard
- ✅ Manage portfolio content
- ✅ Create/edit blog posts
- ✅ Update services and projects
