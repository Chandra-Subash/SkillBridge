const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is imported if comparePassword isn't on model

// Helper to create JWT token
const createToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined. Authentication cannot proceed securely.");
        // Throw an error or use a default only in NON-PRODUCTION environments
        // For production, the server should ideally not start without a secret.
        throw new Error("JWT_SECRET must be configured"); 
    }
    // Standard payload includes user ID, token expires in 3 days
    return jwt.sign({ id }, secret, { expiresIn: '3d' }); 
};

// --- Unified Registration ---
// (Your registration logic was mostly correct, minor cleanup)
module.exports.register = async (req, res) => {
    const { 
        name, email, password, role, location, bio, skills, 
        organization_name, organization_description, website_url 
    } = req.body;

    // --- Basic Validation ---
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Name, email, password, and role are required." });
    }
    if (role !== 'volunteer' && role !== 'ngo') {
        return res.status(400).json({ error: "Role must be 'volunteer' or 'ngo'." });
    }
    // For NGO role, specific fields are required
    if (role === 'ngo' && (!organization_name || !organization_description)) {
        return res.status(400).json({ error: "Organization name and description are required for NGOs." });
    }
     // For Volunteer role, skills might be required (adjust as needed)
    if (role === 'volunteer' && (!skills || skills.length === 0)) {
       // return res.status(400).json({ error: "Skills are required for volunteers." });
       // Or allow registration without skills initially
    }


    try {
        // --- Prepare User Data ---
        // Consolidate data based on role
        const userData = {
            name, email, password, role, location, bio,
            // Include fields conditionally based on the role
            ...(role === 'volunteer' && { skills }), // Add skills if volunteer
            ...(role === 'ngo' && { organization_name, organization_description, website_url }), // Add NGO fields if ngo
        };

        // --- Create User ---
        // Password hashing should happen via the pre-save hook in your user.js model
        const user = await User.create(userData);

        // --- Generate Token ---
        const token = createToken(user._id);

        // --- Send Success Response ---
        res.status(201).json({ 
            message: "Registration successful", 
            token, 
            role: user.role,
            // Optionally send back some non-sensitive user info
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (err) {
        // --- Handle Errors ---
        // Specific error for duplicate email (MongoDB error code 11000)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({ error: "Email address already exists." });
        }
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ error: messages.join(', ') });
        }
        // Generic server error for other issues
        console.error("Registration Error:", err); // Log the full error for debugging
        res.status(500).json({ error: "Server error during registration." });
    }
};


// --- Login ---
// (This is the corrected version of your login logic)
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // 2. Find User by Email
        // Make sure to select the password field as it might be excluded by default in your schema
        const user = await User.findOne({ email }).select('+password'); 

        // 3. Check if User Exists and Password is Correct
        // Assumes you have a 'comparePassword' method on your User model (using bcrypt.compare)
        if (!user || !(await user.comparePassword(password))) {
             // If user not found OR password doesn't match, send generic error
            return res.status(401).json({ error: "Invalid email or password" }); 
        }

        // 4. User is valid, Password matches - Create Token
        const token = createToken(user._id);

        // 5. Send Success Response
        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role, // Send role back to frontend
            // Optionally send back some user details (excluding password)
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (err) {
        // 6. Handle Server Errors during login process
        console.error("Login Error:", err); // Log the full error for debugging
        res.status(500).json({ error: "Server error during login." });
    }
};

