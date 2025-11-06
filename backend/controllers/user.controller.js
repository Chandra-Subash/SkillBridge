const User = require('../models/user.js');
const Application = require('../models/application.js');
const Opportunity = require('../models/opportunity.js'); 

/**
 * @desc    Get the logged-in user's profile
 * @route   GET /api/users/profile
 * @access  Private (Both roles)
 */
module.exports.getUserProfile = async (req, res) => {
    try {
      
        const profile = await User.findById(req.user._id).select('-password'); 

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        res.status(200).json(profile); 
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile." });
    }
};

/**
 * @desc    Update the logged-in user's profile
 * @route   PUT /api/users/profile
 * @access  Private (Both roles)
 */
module.exports.updateUserProfile = async (req, res) => {
    try {
        const { 
            name, location, bio, skills, 
            organization_name, organization_description, website_url, avatarUrl
        } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (location) updates.location = location;
        if (bio) updates.bio = bio;
        if (avatarUrl) updates.avatarUrl = avatarUrl;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        if (user.role === 'volunteer' && skills) updates.skills = skills;
        if (user.role === 'ngo') {
            if (organization_name) updates.organization_name = organization_name;
            if (organization_description) updates.organization_description = organization_description;
            if (website_url) updates.website_url = website_url;
        }
        
        delete updates.password; 
        delete updates.email;
        delete updates.role;

        const updatedProfile = await User.findByIdAndUpdate(
            req.user._id, 
            { $set: updates }, 
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found during update' });
        }

        res.status(200).json(updatedProfile); 

    } catch (err) {
        console.error("Error updating profile:", err);
         if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
       }
        res.status(500).json({ error: "Failed to update profile." });
    }
};

module.exports.getVolunteerDashboard = async(req,res) => {
    try{
        if(req.user.role!=='volunteer'){
            return res.status(403).json({error:'access restricted'});
        }
        const volunteerId=req.user._id;
        const [applicationCount,acceptedCount,pendingCount,userSkills]=await Promise.all([
            Application.countDocuments({volunteer:volunteerId}),
            Application.countDocuments({volunteer:volunteerId,status:'accepted'}),
            Application.countDocuments({volunteer:volunteerId,status:'pending'}),
            User.findById(volunteerId).select('skills')
        ]);
        const stats={
            applications:applicationCount,
            accepted:acceptedCount,
            pending:pendingCount,
            skills:userSkills.skills?userSkills.skills.length:0
        };
        const opportunities = await Opportunity.find({status:'open'}) 
            .populate('ngo','organization_name')
            .sort({createdAt:-1})
            .limit(3);

        res.status(200).json({stats, opportunities});  
    }catch(error){
         console.error("Get Volunteer Dashboard Error:", error);
        res.status(500).json({ error: 'Server error while fetching dashboard data.' });
    }
};

/**
 * @desc    Get data for the NGO dashboard (stats + recent apps)
 * @route   GET /api/users/dashboard-ngo
 * @access  Private (NGO only)
 */
module.exports.getNgoDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Access restricted to NGOs.' });
        }

        const ngoId = req.user._id;

        const ngoOpportunities = await Opportunity.find({ ngo: ngoId }).select('_id');
        const opportunityIds = ngoOpportunities.map(opp => opp._id);

        const [
            activeOpportunities,
            applicationsReceived,
            activeVolunteers,
            pendingApplications
        ] = await Promise.all([
            Opportunity.countDocuments({ ngo: ngoId, status: 'open' }),
            Application.countDocuments({ opportunity: { $in: opportunityIds } }),
            Application.distinct('volunteer', { opportunity: { $in: opportunityIds }, status: 'accepted' }).then(users => users.length),
            Application.countDocuments({ opportunity: { $in: opportunityIds }, status: 'pending' })
        ]);

        const stats = {
            activeOpportunities,
            applicationsReceived,
            activeVolunteers,
            pendingApplications
        };

        const recentApplications = await Application.find({ 
            opportunity: { $in: opportunityIds },
            status: 'pending' 
        })
        .populate('volunteer', 'name bio skills') 
        .populate('opportunity', 'title') 
        .sort({ createdAt: -1 }) 
        .limit(5); 

        res.status(200).json({ stats, recentApplications });

    } catch (error) {
        console.error("Get NGO Dashboard Error:", error);
        res.status(500).json({ error: 'Server error while fetching dashboard data.' });
    }
};

