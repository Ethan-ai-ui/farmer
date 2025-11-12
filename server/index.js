const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your .env file.' 
      });
    }

    // Create a farmer-focused system prompt
    const systemPrompt = `You are a helpful AI assistant specialized in agriculture and farming. 
    You provide accurate, practical advice to farmers about:
    - Crop cultivation and management
    - Livestock care
    - Soil health and fertilizers
    - Pest and disease management
    - Weather and seasonal farming
    - Agricultural best practices
    - Market information and farming economics
    
    Always provide clear, actionable advice suitable for farmers.`;

    // Use OpenRouter API
    const openrouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // You can change this to other models like 'meta-llama/llama-3.1-8b-instruct:free' for free
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Optional: for analytics
          'X-Title': 'Farmer AI Search' // Optional: for analytics
        }
      }
    );

    const response = openrouterResponse.data.choices[0].message.content;

    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    
    // More detailed error messages
    let errorMessage = 'Failed to get response from AI.';
    let statusCode = 500;
    
    if (error.response) {
      // OpenRouter API error
      const apiError = error.response.data?.error;
      console.error('OpenRouter API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 429) {
        errorMessage = 'API quota exceeded. Please check your OpenRouter account at https://openrouter.ai/';
        statusCode = 429;
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid OpenRouter API key. Please check your API key in the .env file.';
        statusCode = 401;
      } else {
        errorMessage = `OpenRouter API error: ${apiError?.message || error.message}`;
      }
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenRouter API Key configured: ${process.env.OPENROUTER_API_KEY ? 'Yes' : 'No'}`);
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('⚠️  WARNING: OPENROUTER_API_KEY not found in .env file!');
  }
});

