# Frontend Deployment Guide

## Vercel Deployment

This React app is configured for deployment on Vercel with proper client-side routing support.

### Configuration Files

#### `vercel.json`
Handles React Router client-side routing by redirecting all requests to `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works

1. **Client-Side Routing**: React Router handles navigation within the app
2. **Direct URL Access**: Users can access `/analyze` directly without 404 errors
3. **Page Reloads**: Reloading any page works correctly
4. **Extension Integration**: Extension redirects to `/analyze?results=...` work seamlessly

### Routes

- `/` - Landing page
- `/analyze` - Analysis page (accepts URL parameters for results)

### Environment Variables

Set these in your Vercel project settings:

```env
VITE_API_URL=https://your-backend-url.com
```

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the React app
3. The `vercel.json` file ensures proper routing
4. Deploy and test direct URL access

### Testing

After deployment, test these scenarios:

- ✅ Homepage loads: `https://your-app.vercel.app/`
- ✅ Direct analyze page: `https://your-app.vercel.app/analyze`
- ✅ Extension redirect: `https://your-app.vercel.app/analyze?results=...`
- ✅ Page reloads work on all routes
- ✅ Browser back/forward buttons work correctly 