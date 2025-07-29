# Deployment Guide

## Vercel Deployment Fix

The Rollup error you encountered is a common issue with Vercel deployments. Here's how to fix it:

### 1. Environment Variables

Set these environment variables in your Vercel project:

**Frontend Environment Variables:**
```
VITE_API_URL=https://your-backend-url.vercel.app
```

**Backend Environment Variables:**
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3001
```

### 2. Build Configuration

The project now includes:
- `vercel.json` - Proper build configuration
- Updated `vite.config.js` - Optimized for production
- `.vercelignore` - Excludes unnecessary files

### 3. Deployment Steps

1. **Push your changes to GitHub**
2. **Connect to Vercel** (if not already connected)
3. **Set environment variables** in Vercel dashboard
4. **Deploy** - The build should now work correctly

### 4. Alternative Fix (if still having issues)

If you still encounter the Rollup error, try these steps:

1. **Clear Vercel cache:**
   - Go to your Vercel project settings
   - Find "Build & Development Settings"
   - Click "Clear Build Cache"

2. **Force rebuild:**
   - Make a small change to any file
   - Commit and push
   - Trigger a new deployment

3. **Check Node.js version:**
   - Ensure your project uses Node.js 18+ (specified in package.json)

### 5. Local Development

For local development, create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

### 6. Production URLs

After deployment, update your frontend environment variable to point to your deployed backend URL.

## Troubleshooting

- **Rollup errors**: Usually fixed by the updated vite.config.js
- **API connection issues**: Check environment variables
- **Build failures**: Clear Vercel cache and redeploy

The updated configuration should resolve the deployment issues you encountered. 