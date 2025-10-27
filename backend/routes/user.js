const express = require('express');
const router = express.Router(); // Define router at the top
const userController = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.js'); // Import authentication middleware

// --- Define Profile Routes ---

// GET /api/users/profile - Get the logged-in user's profile
// 'protect' middleware runs first to ensure the user is logged in
router.get('/profile', protect, userController.getUserProfile);

// PUT /api/users/profile - Update the logged-in user's profile
// 'protect' middleware runs first
router.put('/profile', protect, userController.updateUserProfile);

// (Optional: Route to get a specific user's public profile by ID, if needed)
// router.get('/:id', userController.getUserById);

// --- Export the router ---
module.exports = router; // Export at the end

