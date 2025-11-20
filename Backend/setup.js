import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Created uploads directory');
} else {
  console.log('✓ Uploads directory already exists');
}

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n⚠️  .env file not found!');
  console.log('Please create a .env file with the following variables:');
  console.log(`
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sustainably-yours
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
  `);
} else {
  console.log('✓ .env file exists');
}

console.log('\n✓ Setup complete!');
console.log('\nNext steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update your .env file with your configuration');
console.log('3. Run: npm install');
console.log('4. Run: npm start (or npm run dev for development)');

