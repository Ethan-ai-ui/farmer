# Environment Variables Guide

## 📍 Where to Add Environment Variables

### 1. **Local Development (.env file)**

Your local `.env` file should be in the root directory (`farmer/` folder).

**To view/edit it:**
- Open it with any text editor: `notepad .env` (Windows)
- Or open it in VS Code/Cursor

**Format:**
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
PORT=5000
```

**⚠️ Important:** The `.env` file is in `.gitignore`, so it won't be pushed to GitHub (this is good for security).

---

### 2. **Vercel (Frontend Deployment)**

**Steps to add environment variables:**

1. Go to [vercel.com](https://vercel.com) and log in
2. Select your project
3. Click **"Settings"** (top menu)
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add New"**
6. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (your Render backend URL)
   - **Environment:** Select all (Production, Preview, Development)
7. Click **"Save"**

**To see your variables:**
- Settings → Environment Variables
- You'll see a list of all your environment variables (values are hidden for security)

---

### 3. **Render (Backend Deployment)**

**Steps to add environment variables:**

1. Go to [render.com](https://render.com) and log in
2. Click on your **Web Service** (backend)
3. Click **"Environment"** (left sidebar)
4. Scroll down to **"Environment Variables"** section
5. Click **"Add Environment Variable"**
6. Add:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** `sk-or-v1-your-key-here` (paste your actual key)
   - Click **"Save Changes"**
7. Add another:
   - **Key:** `PORT`
   - **Value:** `10000` (or leave Render's default)
   - Click **"Save Changes"**

**To see your variables:**
- Environment tab → Environment Variables section
- You'll see all variables listed (values are hidden/masked)

---

## 🔍 How to Check Your Current Environment Variables

### Local (.env file):
```powershell
# Windows PowerShell
notepad .env

# Or in VS Code/Cursor
# Just open the .env file in your editor
```

### Vercel:
- Go to: Project → Settings → Environment Variables
- You'll see all variables listed (values are masked with dots)

### Render:
- Go to: Your Service → Environment → Environment Variables
- You'll see all variables listed (values are partially masked)

---

## 📋 Summary of Environment Variables Needed

### Frontend (Vercel):
- `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

### Backend (Render):
- `OPENROUTER_API_KEY` = `sk-or-v1-your-actual-key`
- `PORT` = `10000` (optional, Render assigns one automatically)

---

## 🔐 Security Notes

- ✅ Never commit `.env` to GitHub (it's in `.gitignore`)
- ✅ Never share your API keys publicly
- ✅ Environment variables in Vercel/Render are encrypted and secure
- ✅ Values in deployment platforms are masked when viewing

---

## 🚀 After Adding Variables

**Render (Backend):**
- Variables are saved immediately
- Your service will automatically redeploy if needed
- Check logs to confirm the API key is being read

**Vercel (Frontend):**
- Variables are saved immediately
- You may need to redeploy:
  - Go to Deployments tab
  - Click "..." on the latest deployment
  - Click "Redeploy"


