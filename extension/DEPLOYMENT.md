# Chrome Extension Deployment Guide

## Quick Start

### 1. Build the Extension

```bash
cd frontend
npm install
npm run build:extension
```

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `frontend/dist` folder
5. The extension should now appear in your toolbar

### 3. Test the Extension

1. Click the extension icon in your Chrome toolbar
2. Try the different input methods:
   - **Text**: Paste some terms and conditions text
   - **File**: Upload a .txt or .pdf file
   - **Page**: Navigate to a page with terms and conditions

## Development Workflow

### Making Changes

1. Edit the React components in `src/components/`
2. Run `npm run dev` for development with hot reload
3. Run `npm run build:extension` to build for Chrome
4. Go to `chrome://extensions/` and click the refresh icon on your extension

### Backend Integration

Make sure your backend server is running and accessible. The extension will make API calls to:
- `http://localhost:3001/api/analyze` (default)
- Or set `VITE_API_URL` in your environment

## Troubleshooting

### Extension Not Loading

- Check that all files are in the `dist` folder
- Verify `manifest.json` is valid
- Look for errors in Chrome's extension page
- Check the browser console for JavaScript errors

### API Connection Issues

- Ensure your backend server is running
- Check CORS settings on your backend
- Verify the API URL in environment variables
- Test the API endpoint directly

### Build Issues

- Clear the `dist` folder and rebuild
- Check for missing dependencies
- Verify Node.js version (v16+)

## Production Deployment

### Chrome Web Store (Optional)

1. Create a developer account on the Chrome Web Store
2. Package your extension as a .zip file
3. Upload and submit for review
4. Wait for approval (can take several days)

### Self-Distribution

1. Build the extension: `npm run build:extension`
2. Zip the `dist` folder
3. Share the zip file with users
4. Users can load it manually in Chrome

## Security Considerations

- The extension only requests `activeTab` permission
- No sensitive data is stored locally
- API calls are made to your controlled backend
- Consider implementing rate limiting on your API

## Performance Tips

- Keep the popup size reasonable (384x384px)
- Minimize bundle size by removing unused dependencies
- Use efficient React patterns (memo, useCallback)
- Consider lazy loading for large components

## Customization

### Icons

Replace the placeholder files in `icons/` with actual PNG files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

### Styling

Modify `src/index.css` for custom styles. The extension uses Tailwind CSS.

### Manifest

Edit `manifest.json` to change:
- Extension name and description
- Permissions
- Popup dimensions
- Content script behavior 