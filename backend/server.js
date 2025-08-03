const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// File processing utilities
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromFile = async (file) => {
  const fileType = file.mimetype;
  
  try {
    if (fileType === 'application/pdf') {
      const result = await pdfParse(file.buffer);
      return result.text;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else if (fileType === 'application/msword') {
      // Note: mammoth doesn't support .doc files directly
      throw new Error('DOC files are not supported. Please convert to DOCX or PDF.');
    } else if (fileType === 'text/plain') {
      return file.buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

// OpenRouter API integration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const analyzeTextWithOpenRouter = async (text) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  const prompt = `Please analyze the following terms and conditions text and categorize the information into these 6 sections:

1. ThingsToKnow - Key information the user should be aware of
2. ImportantPoints - Critical points that require attention
3. Risks - Potential risks or concerns for the user
4. UserObligations - What the user is required to do or not do
5. UserRights - What rights and protections the user has
6. OptionalNotes - Additional notes or clarifications

Please return the analysis as a JSON object with these exact keys, each containing an array of strings (bullet points).

Text to analyze:
${text}

Respond only with valid JSON in this exact format:
{
  "ThingsToKnow": ["point1", "point2"],
  "ImportantPoints": ["point1", "point2"],
  "Risks": ["point1", "point2"],
  "UserObligations": ["point1", "point2"],
  "UserRights": ["point1", "point2"],
  "OptionalNotes": ["point1", "point2"]
}`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Terms & Conditions Analyzer'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Check for specific error conditions and provide cleaner messages
      if (response.status === 402) {
        throw new Error('Credit limit reached. Please try again later or contact support.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your API configuration.');
      } else {
        throw new Error(`Analysis failed: ${errorData.error?.message || 'Unknown error occurred'}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    const content = data.choices[0].message.content;
    
    // Try to parse the JSON response
    try {
      const parsedResponse = JSON.parse(content);
      
      // Validate the response structure
      const requiredKeys = ['ThingsToKnow', 'ImportantPoints', 'Risks', 'UserObligations', 'UserRights', 'OptionalNotes'];
      const hasAllKeys = requiredKeys.every(key => Array.isArray(parsedResponse[key]));
      
      if (!hasAllKeys) {
        throw new Error('Invalid response structure from AI');
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('AI response could not be parsed. Please try again.');
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

// Mock analysis for development
const mockAnalyzeText = async (text) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    ThingsToKnow: [
      "This is a terms and conditions document",
      "You are agreeing to the company's policies",
      "Your data may be collected and processed",
      "The service is provided 'as is'"
    ],
    ImportantPoints: [
      "You must be 18 or older to use this service",
      "You are responsible for maintaining account security",
      "The company reserves the right to modify terms",
      "You can terminate your account at any time"
    ],
    Risks: [
      "Your personal information may be shared with third parties",
      "The service may be unavailable at times",
      "You may lose access to your account if terms are violated",
      "Data breaches are possible despite security measures"
    ],
    UserObligations: [
      "You must provide accurate information",
      "You must not share your account credentials",
      "You must comply with all applicable laws",
      "You must not use the service for illegal purposes"
    ],
    UserRights: [
      "You have the right to access your personal data",
      "You can request deletion of your account",
      "You have the right to file complaints",
      "You can opt out of marketing communications"
    ],
    OptionalNotes: [
      "This analysis is for informational purposes only",
      "Always read the full terms before agreeing",
      "Consider consulting with a legal professional",
      "Keep a copy of the terms for your records"
    ]
  };
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Analyze text endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let analysis;
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (apiKey) {
      analysis = await analyzeTextWithOpenRouter(text);
    } else {
      console.log('No API key found, using mock analysis');
      analysis = await mockAnalyzeText(text);
    }
    
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload and analyze file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from file
    const text = await extractTextFromFile(req.file);
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No readable text found in the uploaded file' });
    }

    // Analyze the extracted text
    let analysis;
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (apiKey) {
      analysis = await analyzeTextWithOpenRouter(text);
    } else {
      console.log('No API key found, using mock analysis');
      analysis = await mockAnalyzeText(text);
    }
    
    res.json(analysis);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 