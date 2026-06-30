// This is the STARTING POINT of our entire backend app
import 'dotenv/config';           // Load .env file variables
import { connectDB } from './config/db.js';
import { createServer } from './server.js';

const PORT = process.env.PORT || 5000;

// First connect to database, then start the server
connectDB().then(() => {
  const app = createServer();
  
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ExpenseWise Server Started!');
    console.log(`📡 Running at: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log('');
  });
});