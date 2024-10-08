import express from 'express';
import apiRoutes from './routes/api';
import dotenv from 'dotenv';
import cors from 'cors';  // Import cors
import path from 'path';  // Import the path module

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS to allow requests from your frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// Use API routes
app.use('/', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
