const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    // --- Common Fields ---
    name: { type: String, required: true }, // Changed from fullName
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['volunteer', 'ngo'] }, // Enforce specific roles
    location: { type: String },
    bio: { type: String },
    avatarUrl: { type: String, default: '/images/default-avatar.png' }, // Added avatar here
    
    // --- Volunteer Specific (can be empty for NGOs) ---
    skills: { type: [String], default: [] }, 

    // --- NGO Specific (will only exist if role is 'ngo') ---
    organization_name: { 
        type: String, 
        required: function() { return this.role === 'ngo'; } // Required only for NGOs
    },
    organization_description: { type: String },
    website_url: { type: String }

}, { timestamps: true }); // Adds createdAt and updatedAt fields

// --- Password Hashing Middleware ---
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass error to the next middleware/handler
    }
});

// --- Method to Compare Passwords ---
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
