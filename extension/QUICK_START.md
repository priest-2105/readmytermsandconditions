# Terms Analyzer Extension - Quick Start

## ✅ Extension is Ready!

The Chrome extension has been successfully built and is ready to install.

## 🚀 Installation Steps

### 1. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the `extension/dist` folder
6. The extension should now appear in your extensions list

### 2. Test the Extension

1. Click the extension icon in your Chrome toolbar
2. Try the different input methods:
   - **Text**: Paste terms and conditions text
   - **File**: Upload a .txt or .pdf document
   - **Page**: Analyze the current webpage content
3. Click "Analyze" to get AI-powered insights

## 🔧 Development

### Making Changes

1. Edit files in `extension/src/`
2. Run build: `npm run build:extension`
3. Go to `chrome://extensions/` and click refresh on your extension

### Backend Connection

Make sure your backend server is running on `http://localhost:3001` or set the `VITE_API_URL` environment variable.

## 📁 Project Structure

```
extension/
├── src/
│   ├── components/
│   │   ├── Analyzer.jsx          # Main interface
│   │   ├── Header.jsx            # Extension header
│   │   ├── TextInput.jsx         # Text input
│   │   ├── FileUpload.jsx        # File upload
│   │   ├── PageAnalyzer.jsx      # Page analysis
│   │   └── Results.jsx           # Results display
│   ├── content.js                 # Content script
│   └── App.jsx                   # Main app
├── dist/                         # Built extension
├── manifest.json                 # Extension config
└── icons/                        # Extension icons
```

## 🎯 Features

- **Compact Design**: 384x384px popup optimized for extension
- **Three Input Methods**: Text, File, Page analysis
- **Clean UI**: Modern, professional interface
- **AI Integration**: Connects to your backend API
- **Error Handling**: User-friendly error messages

## 🔄 Updates

To update the extension after making changes:
1. Run `npm run build:extension`
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension

The extension is now ready to use! 🎉 