const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); // Use User model to check if user still exists

// Middleware function to protect routes
module.exports.protect = async (req, res, next) => {
    let token;
    const secret = process.env.JWT_SECRET; // Get secret key from environment variables

    // Check if the JWT_SECRET is configured in the .env file
    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env file. Authentication cannot proceed securely.");
        // In production, you might want to prevent the server from starting without this
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Check if the request has an 'Authorization' header and if it starts with 'Bearer '
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            // This will throw an error if the token is invalid or expired
            const decoded = jwt.verify(token, secret);

            // Token is valid, find the user associated with the token's ID
            // We select '-password' to ensure the password hash is never attached to the request object
            const currentUser = await User.findById(decoded.id).select('-password');

            // Check if the user still exists in the database
            if (!currentUser) {
                // If the user associated with the token no longer exists
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }
            
            // Attach the user object (without the password) to the request object (`req`)
            // This makes the user information available to the next function (the controller)
            req.user = currentUser; 
            
            // Call `next()` to pass control to the next middleware or the route handler (controller)
            next(); 

        } catch (error) {
            // Handle errors during token verification (e.g., invalid signature, expired token)
            console.error("Token verification failed:", error.message);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    // If no token was found in the 'Authorization' header
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

