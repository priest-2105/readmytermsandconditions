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

// Groq API integration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const analyzeTextWithGroq = async (text) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Groq API key is required');
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

  console.log('=== GROQ API REQUEST ===');
  console.log('Model:', GROQ_MODEL);
  console.log('API Key present:', !!apiKey);
  console.log('Text length:', text.length);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    console.log('=== GROQ API RESPONSE ===');
    console.log('Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error response:', JSON.stringify(errorData, null, 2));

      if (response.status === 400) {
        throw new Error('Invalid request to Groq API. Please check your API configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your Groq API key.');
      } else {
        throw new Error(`Analysis failed: ${errorData.error?.message || 'Unknown error occurred'}`);
      }
    }

    const data = await response.json();
    console.log('=== RAW GROQ RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from Groq API');
    }

    const content = data.choices[0].message.content;
    console.log('=== EXTRACTED CONTENT ===');
    console.log('Content length:', content.length);
    console.log('---START---');
    console.log(content);
    console.log('---END---');

    // Try to parse the JSON response
    try {
      let cleanedContent = content.trim();

      // Remove markdown code blocks if present
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedResponse = JSON.parse(cleanedContent);

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
      console.error('Parse error:', parseError.message);

      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          const requiredKeys = ['ThingsToKnow', 'ImportantPoints', 'Risks', 'UserObligations', 'UserRights', 'OptionalNotes'];
          if (requiredKeys.every(key => Array.isArray(parsedResponse[key]))) {
            return parsedResponse;
          }
        } catch (extractError) {
          console.error('Failed to extract JSON:', extractError.message);
        }
      }

      throw new Error(`AI response could not be parsed. Raw response: ${content.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error('=== GROQ API ERROR ===');
    console.error('Groq API error:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

// Utility: normalize text by collapsing excessive whitespace
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/[\r\t]+/g, ' ')
    .replace(/\u00A0/g, ' ') // non-breaking space
    .replace(/\s{2,}/g, ' ') // collapse multiple spaces
    .replace(/\n{2,}/g, '\n')
    .trim();
};

// Utility: chunk long text into reasonably sized slices for the model
const chunkText = (text, chunkSize = 6000, overlap = 200) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(text.length, start + chunkSize);
    const slice = text.slice(start, end);
    chunks.push(slice);
    if (end === text.length) break;
    start = end - overlap; // overlap to preserve context
  }
  return chunks;
};

// Utility: merge multiple analysis objects into one, de-duplicating entries
const mergeAnalyses = (analyses) => {
  const keys = ['ThingsToKnow', 'ImportantPoints', 'Risks', 'UserObligations', 'UserRights', 'OptionalNotes'];
  const result = Object.fromEntries(keys.map((k) => [k, []]));
  const seenPerKey = Object.fromEntries(keys.map((k) => [k, new Set()]));

  for (const analysis of analyses) {
    for (const key of keys) {
      const items = Array.isArray(analysis[key]) ? analysis[key] : [];
      for (const rawItem of items) {
        const item = String(rawItem).trim();
        if (item.length === 0) continue;
        if (!seenPerKey[key].has(item)) {
          seenPerKey[key].add(item);
          result[key].push(item);
        }
      }
    }
  }

  // Optionally cap list sizes to keep responses concise
  const MAX_ITEMS_PER_KEY = 50;
  for (const key of keys) {
    if (result[key].length > MAX_ITEMS_PER_KEY) {
      result[key] = result[key].slice(0, MAX_ITEMS_PER_KEY);
    }
  }

  return result;
};

// Analyze possibly large text by chunking when necessary
const analyzePossiblyLargeText = async (text) => {
  const cleaned = normalizeText(text);
  const CHUNK_CHAR_LIMIT = 6000; // conservative for prompt + content

  if (cleaned.length <= CHUNK_CHAR_LIMIT) {
    return analyzeTextWithGroq(cleaned);
  }

  const chunks = chunkText(cleaned, CHUNK_CHAR_LIMIT, 200);
  const analyses = [];

  // Sequential to avoid rate-limits
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Analyzing chunk ${i + 1}/${chunks.length}, length=${chunk.length}`);
    const analysis = await analyzeTextWithGroq(chunk);
    analyses.push(analysis);
  }

  return mergeAnalyses(analyses);
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
    const analysis = await analyzePossiblyLargeText(text);
    
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
    const analysis = await analyzePossiblyLargeText(text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Upload error:', error);
    // Provide clearer client error for known cases
    if (/DOC files are not supported/i.test(error.message)) {
      return res.status(400).json({ error: 'DOC files are not supported. Please convert to DOCX or PDF.' });
    }
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