"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // Import the path module
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') }); // Load environment variables from .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Print the specific environment variable (e.g., POLYGON_API_KEY)
console.log('POLYGON_API_KEY:', process.env.POLYGON_API_KEY);
app.use('/', api_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
