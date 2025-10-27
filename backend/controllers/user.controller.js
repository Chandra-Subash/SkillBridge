const User = require('../models/user.js');

// --- Get Logged-in User's Profile ---
module.exports.getUserProfile = async (req, res) => {
    try {
        // req.user.id is attached by the 'protect' middleware
        // .select('-password') excludes the password hash from the result
        const profile = await User.findById(req.user.id).select('-password'); 
        
        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.status(200).json(profile); // Send the full profile data back
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile." });
    }
};

// --- Update Logged-in User's Profile ---
module.exports.updateUserProfile = async (req, res) => {
    try {
        // Get the fields to update from the request body
        // Destructure only the fields we allow users to update
        const { 
            name, location, bio, skills, 
            organization_name, organization_description, website_url, avatarUrl // Allow avatarUrl update
        } = req.body;

        // Construct update object - only include fields that were provided
        const updates = {};
        if (name) updates.name = name;
        if (location) updates.location = location;
        if (bio) updates.bio = bio;
        if (avatarUrl) updates.avatarUrl = avatarUrl; // If new avatar URL sent from frontend

        // Only allow updating role-specific fields based on the user's current role
        // Find the user first to check their role
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        if (user.role === 'volunteer' && skills) updates.skills = skills;
        if (user.role === 'ngo') {
            if (organization_name) updates.organization_name = organization_name;
            if (organization_description) updates.organization_description = organization_description;
            if (website_url) updates.website_url = website_url;
        }
        
        // Prevent password/email/role changes via this route
        delete updates.password; 
        delete updates.email;
        delete updates.role;

        // Perform the update
        const updatedProfile = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updates }, // Use $set to only update provided fields
            { new: true, runValidators: true } // Return the updated doc, run schema validators
        ).select('-password'); 

        if (!updatedProfile) {
            // This case might be redundant if the user check above passed, but good practice
            return res.status(404).json({ error: 'User profile not found during update' });
        }

        res.status(200).json(updatedProfile); // Send back the updated profile

    } catch (err) {
        console.error("Error updating profile:", err);
         // Handle potential validation errors
         if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Failed to update profile." });
    }
};
