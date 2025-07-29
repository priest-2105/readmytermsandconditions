# Terms & Conditions Analyzer

A full-stack React application that helps users understand terms and conditions by providing AI-powered analysis and categorization.

## Architecture

This project uses a **separated frontend/backend architecture**:

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 3001)
- **AI Service**: OpenRouter API

## Features

- **File Upload**: Support for PDF, DOCX, DOC, and TXT files (max 5MB)
- **Text Input**: Direct text input with 800 character limit
- **AI Analysis**: Categorizes content into 6 key sections:
  - Things to Know
  - Important Points
  - Risks
  - User Obligations
  - User Rights
  - Additional Notes
- **Collapsible UI**: Clean, organized display of analysis results
- **Drag & Drop**: Intuitive file upload interface
- **Real-time Validation**: File size and format validation
- **Loading States**: Visual feedback during processing

## Tech Stack

### Frontend
- **Framework**: React 19.1.0 + Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite 7.0.4

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **File Processing**: 
  - `pdf-parse` for PDF files
  - `mammoth` for DOCX files
  - Native FileReader for TXT files
- **File Upload**: Multer
- **CORS**: Enabled for frontend communication

### AI Service
- **Provider**: OpenRouter
- **Model**: Claude 3.5 Sonnet
- **API**: RESTful endpoints

## Getting Started

### Prerequisites

- Node.js (v20.12.2 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd readmytermsandconditions
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables:

**Backend** (create `backend/.env`):
```env
PORT=3001
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Frontend** (create `.env`):
```env
VITE_API_URL=http://localhost:3001
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. In a new terminal, start the frontend:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Backend (Port 3001)

- `GET /api/health` - Health check
- `POST /api/analyze` - Analyze text content
- `POST /api/upload` - Upload and analyze file

### Request/Response Format

**Text Analysis** (`POST /api/analyze`):
```json
{
  "text": "Your terms and conditions text here..."
}
```

**File Upload** (`POST /api/upload`):
```
Content-Type: multipart/form-data
file: [file object]
```

**Response Format**:
```json
{
  "ThingsToKnow": ["item1", "item2"],
  "ImportantPoints": ["item1", "item2"],
  "Risks": ["item1", "item2"],
  "UserObligations": ["item1", "item2"],
  "UserRights": ["item1", "item2"],
  "OptionalNotes": ["item1", "item2"]
}
```

## Project Structure

```
readmytermsandconditions/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploadArea.jsx
│   │   │   ├── TextAreaInput.jsx
│   │   │   ├── SummaryDisplay.jsx
│   │   │   └── CollapsibleSection.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/                     # Node.js server
│   ├── server.js               # Main server file
│   ├── package.json
│   └── env.example
├── package.json
└── README.md
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## File Processing Details

### Backend Processing
- **PDF Files**: Uses `pdf-parse` library
- **DOCX Files**: Uses `mammoth` library
- **TXT Files**: Native Node.js file reading
- **DOC Files**: Currently shows error (requires conversion)

### Security Features
- File size validation (5MB limit)
- File type validation
- CORS configuration
- Error handling middleware

## API Configuration

### OpenRouter Setup

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create an account and generate an API key
3. Add the key to `backend/.env`:
```env
OPENROUTER_API_KEY=your_actual_api_key_here
```

### Backend Configuration

The backend uses these default settings:
- **Model**: `anthropic/claude-3.5-sonnet`
- **Max Tokens**: 2000
- **Temperature**: 0.3
- **Port**: 3001

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev` (in root directory)
3. **Test**: Upload files or paste text to test analysis
4. **Monitor**: Check backend console for API calls and errors

## Error Handling

The application handles various error scenarios:
- File size exceeds 5MB limit
- Unsupported file formats
- Empty text input
- Network errors during API calls
- File processing errors
- OpenRouter API errors

## Browser Support

- Modern browsers with ES6+ support
- File API support for uploads
- Drag and drop API support

## Security Considerations

- Files are processed in-memory only
- No files are stored on the server
- Text content is sent to OpenRouter API for analysis
- CORS is configured for localhost development
- API keys are stored server-side only

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your Node.js hosting service
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for informational purposes only. The AI analysis should not be considered as legal advice. Always consult with a legal professional for specific legal matters.
