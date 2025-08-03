# Terms Analyzer Chrome Extension

A Chrome extension that uses AI to analyze terms and conditions, making legal documents easier to understand.

## Features

- **Text Analysis**: Paste terms and conditions text directly
- **File Upload**: Upload .txt or .pdf documents
- **Page Analysis**: Analyze content from the current webpage
- **AI-Powered**: Uses backend API for intelligent analysis
- **Clean UI**: Modern, compact interface designed for extension popup

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build:extension
```

## Installation

### Development Mode

1. Build the extension:
```bash
npm run build:extension
```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the `dist` folder

5. The extension should now appear in your extensions list

### Using the Extension

1. Click the extension icon in your Chrome toolbar
2. Choose your input method:
   - **Text**: Paste terms and conditions text
   - **File**: Upload a document (.txt or .pdf)
   - **Page**: Analyze the current webpage
3. Click "Analyze" to get AI-powered insights
4. Review the results showing risks, obligations, rights, and key points

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Analyzer.jsx          # Main analyzer interface
│   │   ├── Header.jsx            # Extension header
│   │   ├── TextInput.jsx         # Text input component
│   │   ├── FileUpload.jsx        # File upload component
│   │   ├── PageAnalyzer.jsx      # Page analysis component
│   │   └── Results.jsx           # Results display component
│   ├── content.js                 # Content script for page interaction
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── manifest.json                  # Chrome extension manifest
├── icons/                        # Extension icons
└── dist/                         # Built extension (after build)
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001
```

### Backend API

The extension requires a running backend API. Make sure your backend server is running on the configured URL.

## Customization

### Icons

Replace the placeholder files in `icons/` with actual PNG icons:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

### Styling

The extension uses Tailwind CSS. Modify `src/index.css` for custom styles.

## Troubleshooting

### Extension Not Loading

1. Check that the build completed successfully
2. Verify the `dist` folder contains all necessary files
3. Check Chrome's extension page for error messages
4. Try reloading the extension

### API Connection Issues

1. Ensure your backend server is running
2. Check the `VITE_API_URL` environment variable
3. Verify CORS settings on your backend
4. Check browser console for network errors

### Build Issues

1. Clear the `dist` folder and rebuild
2. Check for any missing dependencies
3. Verify Node.js version compatibility

## License

This project is for educational purposes. Please ensure compliance with Chrome's extension policies when distributing.
