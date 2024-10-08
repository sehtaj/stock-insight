import express from 'express';
import apiRoutes from './routes/api';
import dotenv from 'dotenv';
import path from 'path';  // Import the path module

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 3001;
// Print the specific environment variable (e.g., POLYGON_API_KEY)

console.log('POLYGON_API_KEY:', process.env.POLYGON_API_KEY);

app.use('/', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

