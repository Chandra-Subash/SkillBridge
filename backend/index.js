const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load .env variables

// Import routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js'); // Renamed from profileRoutes

const app = express();
const PORT = process.env.PORT || 8080;

// --- Database Connection ---
const MONGO_URL = process.env.MONGO_URL; // Get from .env file

if (!MONGO_URL) {
    console.error("FATAL ERROR: MONGO_URL is not defined in .env file.");
    process.exit(1); // Exit if DB connection string is missing
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit if connection fails
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// --- Middleware ---
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Parse JSON request bodies

// --- API Routes ---
app.use('/api/auth', authRoutes); // Auth routes (register, login)
app.use('/api/users', userRoutes); // User routes (get profile, update profile)

// Basic error handling (optional but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

