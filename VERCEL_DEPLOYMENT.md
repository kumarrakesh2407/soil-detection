# Vercel Deployment Guide for Soil Detection App

## Problem: 404 NOT_FOUND Error

The 404 error occurs because Vercel is trying to serve your app as a server-side application, but it's actually a static frontend-only application.

## Solution Steps:

### 1. ✅ Fixed Configuration (Already Done)
Created `vercel.json` with proper static site configuration:
- Routes all requests to `frontend/index.html`
- Sets correct output directory to `frontend`
- Configures static build settings

### 2. 🚀 Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd "D:\Projects\Soil Detection"
vercel --prod
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Connect repository to Vercel dashboard
3. Vercel will automatically read `vercel.json`

### 3. ⚙️ Vercel Dashboard Settings

After deployment, check these settings in Vercel dashboard:

1. **Build & Development Settings**:
   - Build Command: `echo 'Static site - no build required'`
   - Output Directory: `frontend`
   - Install Command: `echo 'No build steps needed'`

2. **Framework Preset**: `Other` or `None`

3. **Root Directory**: Leave empty (project root)

### 4. 🔧 Troubleshooting

#### If still getting 404 errors:

1. **Clear Vercel Cache**:
   - Go to Vercel dashboard → Project → Deployments
   - Click "Redeploy" to clear cache

2. **Check File Structure**:
   - Ensure `frontend/index.html` exists
   - Verify all files are in `frontend/` folder

3. **Verify Routes**:
   - The `vercel.json` routes all requests to `index.html`
   - This enables client-side routing for your SPA

### 5. 🌐 Expected URLs After Fix

- Main App: `https://your-app.vercel.app/`
- Direct HTML: `https://your-app.vercel.app/frontend/index.html`
- All routes should redirect to main app

### 6. 📱 Backend Connection

If you need to connect to backend:
- Update API URLs in `script.js` to your backend domain
- Example: `https://your-backend.vercel.app/api/soil-analysis`

## Why This Happens:

Vercel defaults to expecting a Node.js/Next.js app, but your project is:
- **Frontend**: Static HTML/CSS/JS files
- **Backend**: Separate Spring Boot application
- **Routing**: Client-side JavaScript routing

The `vercel.json` tells Vercel to treat it as a static site with SPA routing.

## Quick Fix Checklist:

- [x] `vercel.json` created with static configuration
- [ ] Deploy to Vercel (CLI or GitHub)
- [ ] Verify build settings in Vercel dashboard
- [ ] Test all routes work correctly
- [ ] Check API connectivity if backend deployed separately

After following these steps, your 404 error should be resolved!
