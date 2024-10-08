import express from 'express';
import apiRoutes from './routes/api';
import dotenv from 'dotenv';
import cors from 'cors';  // Import cors
import path from 'path';  // Import the path module

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Use CORS to allow requests from your frontend
app.use(cors({ origin: allowedOrigins }));

// Use API routes
app.use('/', apiRoutes);

// Only run app.listen() when not in production (e.g., for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
