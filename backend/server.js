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

// Gemini API integration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const analyzeTextWithGemini = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const prompt = `Analyze the following terms and conditions text and return ONLY a valid JSON object with exactly these 6 keys, each containing an array of strings:

{
  "ThingsToKnow": ["Key information the user should be aware of"],
  "ImportantPoints": ["Critical points that require attention"],
  "Risks": ["Potential risks or concerns for the user"],
  "UserObligations": ["What the user is required to do or not do"],
  "UserRights": ["What rights and protections the user has"],
  "OptionalNotes": ["Additional notes or clarifications"]
}

Text to analyze:
${text}

IMPORTANT: Return ONLY the JSON object, no additional text, no markdown formatting, no explanations. The response must be valid JSON that can be parsed directly.`;

  console.log('=== GEMINI API REQUEST ===');
  console.log('URL:', GEMINI_API_URL);
  console.log('API Key present:', !!apiKey);
  console.log('Text length:', text.length);
  console.log('Prompt:', prompt);

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    console.log('=== GEMINI API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error response:', JSON.stringify(errorData, null, 2));
      
      // Check for specific error conditions and provide cleaner messages
      if (response.status === 400) {
        throw new Error('Invalid request to Gemini API. Please check your API configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your Gemini API key.');
      } else {
        throw new Error(`Analysis failed: ${errorData.error?.message || 'Unknown error occurred'}`);
      }
    }

    const data = await response.json();
    console.log('=== RAW GEMINI RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    console.log('=== EXTRACTED CONTENT ===');
    console.log('Content type:', typeof content);
    console.log('Content length:', content.length);
    console.log('Raw content:');
    console.log('---START---');
    console.log(content);
    console.log('---END---');
    
    // Try to parse the JSON response
    try {
      // Clean the content - remove any markdown formatting
      let cleanedContent = content.trim();
      
      // Remove markdown code blocks if present
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        console.log('Removed ```json wrapper');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
        console.log('Removed ``` wrapper');
      }
      
      console.log('=== CLEANED CONTENT ===');
      console.log('Cleaned content:');
      console.log('---START---');
      console.log(cleanedContent);
      console.log('---END---');
      
      const parsedResponse = JSON.parse(cleanedContent);
      console.log('=== PARSED JSON ===');
      console.log(JSON.stringify(parsedResponse, null, 2));
      
      // Validate the response structure
      const requiredKeys = ['ThingsToKnow', 'ImportantPoints', 'Risks', 'UserObligations', 'UserRights', 'OptionalNotes'];
      const hasAllKeys = requiredKeys.every(key => Array.isArray(parsedResponse[key]));
      
      if (!hasAllKeys) {
        console.error('Missing required keys in response:', Object.keys(parsedResponse));
        throw new Error('Invalid response structure from AI - missing required keys');
      }
      
      console.log('=== SUCCESS - RETURNING PARSED RESPONSE ===');
      return parsedResponse;
    } catch (parseError) {
      console.error('=== PARSE ERROR ===');
      console.error('Parse error:', parseError.message);
      console.error('Failed to parse Gemini response:', content);
      
      // Try to extract JSON from the response if it's wrapped in text
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          console.log('=== EXTRACTED JSON ATTEMPT ===');
          console.log('Attempting to parse extracted JSON:', extractedJson);
          const parsedResponse = JSON.parse(extractedJson);
          
          // Validate the response structure
          const requiredKeys = ['ThingsToKnow', 'ImportantPoints', 'Risks', 'UserObligations', 'UserRights', 'OptionalNotes'];
          const hasAllKeys = requiredKeys.every(key => Array.isArray(parsedResponse[key]));
          
          if (hasAllKeys) {
            console.log('=== SUCCESS - EXTRACTED JSON WORKED ===');
            return parsedResponse;
          }
        }
      } catch (extractError) {
        console.error('Failed to extract JSON:', extractError.message);
      }
      
      throw new Error(`AI response could not be parsed. Raw response: ${content.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error('=== GEMINI API ERROR ===');
    console.error('Gemini API error:', error);
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
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      analysis = await analyzeTextWithGemini(text);
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
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      analysis = await analyzeTextWithGemini(text);
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