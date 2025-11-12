# Farmer AI Search

An AI-powered search engine designed specifically for farmers to ask questions and get helpful agricultural advice.

## Features

- Simple, minimalistic UI with light colors
- AI-powered responses using OpenRouter AI
- Clean search interface
- Responsive design

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Create a `.env` file in the root directory:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   PORT=5000
   ```

3. Get an OpenRouter API key:
   - Visit https://openrouter.ai/keys
   - Create a new API key
   - Add it to your `.env` file

4. Run the application:
```bash
npm run dev
```

This will start both the backend server (port 5000) and the React frontend (port 3000).

**Important**: Make sure your `.env` file is in the root directory and contains your OpenRouter API key. The frontend calls the backend API, which then calls OpenRouter - this keeps your API key secure.

## Project Structure

```
├── server/
│   └── index.js          # Express backend server
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js        # Main React component
│       ├── App.css       # Styles
│       ├── index.js      # React entry point
│       └── index.css     # Global styles
├── package.json
└── README.md
```

## Usage

1. Open your browser to `http://localhost:3000`
2. Type your farming question in the search bar
3. Press Enter or click the arrow button
4. Get AI-powered responses tailored for farmers

## Notes

- The AI is configured with a system prompt focused on agriculture and farming
- Currently uses `openai/gpt-3.5-turbo` model via OpenRouter (can be changed in `server/index.js`)
- You can switch to free models like `meta-llama/llama-3.1-8b-instruct:free` in the server code
- OpenRouter provides access to multiple AI models - check https://openrouter.ai/models for available models

