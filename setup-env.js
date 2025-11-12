const fs = require('fs');
const path = require('path');

// Read the API key from env.example (if user has added it there)
const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

// API key from env.example (user should have added it)
let apiKey = 'your_openai_api_key_here';

if (fs.existsSync(envExamplePath)) {
  const content = fs.readFileSync(envExamplePath, 'utf8');
  const match = content.match(/OPENAI_API_KEY=(.+)/);
  if (match && match[1] && !match[1].includes('your_openai')) {
    apiKey = match[1].trim();
  }
}

// Create .env file
const envContent = `OPENAI_API_KEY=${apiKey}
PORT=5000
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ .env file created successfully!');
console.log('📝 Make sure your OpenAI API key is correct in the .env file.');


