import express from 'express';
import apiRoutes from './routes/api';
import cors from 'cors';  // Import cors

const app = express();
const PORT = process.env.PORT || 3001; // Not necessary for Vercel

const allowedOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Use CORS to allow requests from your frontend
app.use(cors({ origin: allowedOrigins }));

// Use API routes
app.use('/', apiRoutes);

// Export the app for Vercel to use
export default app;

// No need to call app.listen() in Vercel
