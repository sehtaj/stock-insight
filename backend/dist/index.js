"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import cors
const path_1 = __importDefault(require("path")); // Import the path module
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') }); // Load environment variables from .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const allowedOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000';
// Use CORS to allow requests from your frontend
app.use((0, cors_1.default)({ origin: allowedOrigins }));
// Use API routes
app.use('/', api_1.default);
// Only run app.listen() when not in production (e.g., for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
