# Deployment Guide - Vercel + Render

## Option 1: Frontend on Vercel, Backend on Render (Recommended)

### Step 1: Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `farmer-ai-backend` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
   - **Root Directory:** Leave blank (or use `./` if needed)

5. **Add Environment Variables:**
   - Click on "Environment" tab
   - Add:
     - `OPENROUTER_API_KEY` = your OpenRouter API key
     - `PORT` = `10000` (Render assigns a port, but you can set this)
     - `NODE_ENV` = `production`

6. **Click "Create Web Service"**
7. **Copy your Render backend URL** (e.g., `https://farmer-ai-backend.onrender.com`)

### Step 2: Update Frontend API URL

Before deploying to Vercel, you need to update the API URL in your frontend:

1. In `client/src/pages/LandingPage.js`, change line 51:
   ```javascript
   const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/chat';
   ```

2. Create a `.env` file in the `client/` folder:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```

### Step 3: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login with GitHub
2. **Click "Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `client` (IMPORTANT: Set this to `client`)
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `build` (or leave default)
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - `REACT_APP_API_URL` = `https://your-render-backend-url.onrender.com/api` (without `/chat` at the end)

6. **Update `client/src/pages/LandingPage.js` to use:**
   ```javascript
   const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat`;
   ```

7. **Click "Deploy"**

### Step 4: Update CORS on Backend

In your Render backend, make sure CORS allows your Vercel frontend URL:

Update `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

Or allow all origins (less secure, but works):
```javascript
app.use(cors());
```

---

## Option 2: Full-Stack on Vercel (Serverless Functions)

This requires converting your Express server to Vercel serverless functions.

### Step 1: Create Vercel Configuration

Create `vercel.json` in the root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

### Step 2: Update server/index.js for Vercel

Convert Express app to Vercel serverless format (more complex).

---

## Recommended: Option 1 (Vercel + Render)

**Why?**
- ✅ Easier setup
- ✅ Free tiers on both platforms
- ✅ No code changes needed for backend
- ✅ Better separation of concerns

**After deployment:**
- Frontend URL: `https://your-app.vercel.app`
- Backend URL: `https://your-backend.onrender.com`


