const Opportunity = require('../models/opportunity.js');
const User = require('../models/user.js'); 
const mongoose = require('mongoose'); 

/**
 * @desc    Create a new opportunity
 * @route   POST /api/opportunities
 * @access  Private (NGO only)
 */
module.exports.createOpportunity = async (req, res) => {
    try {
        
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Only NGOs can create opportunities.' });
        }

        const { title, description, required_skills, duration, location, status } = req.body;

    
        if (!title || !description || !duration || !location) {
            return res.status(400).json({ error: 'Please provide all required fields: title, description, duration, and location.' });
        }

        const opportunity = await Opportunity.create({
            ngo: req.user._id, 
            title,
            description,
            required_skills: required_skills || [], 
            duration,
            location,
            status: status || 'open' 
        });

        res.status(201).json({ message: "Opportunity created successfully", opportunity });
    } catch (error) {
        console.error("Create Opportunity Error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get all opportunities created by the logged-in NGO
 * @route   GET /api/opportunities/my
 * @access  Private (NGO only)
 */
module.exports.getMyOpportunities = async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Not authorized.' });
        }

        const opportunities = await Opportunity.find({ ngo: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ opportunities });
    } catch (error) {
        console.error("Get My Opportunities Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get all *open* opportunities for volunteers to browse
 * @route   GET /api/opportunities
 * @access  Private (All roles can view)
 */
module.exports.getAllOpenOpportunities = async (req, res) => {
    try {
       
        const opportunities = await Opportunity.find({ status: 'open' })
            .populate('ngo', 'organization_name avatarUrl') 
            .sort({ createdAt: -1 });
        
        res.status(200).json({ opportunities });
    } catch (error) {
        console.error("Get All Opportunities Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get details for a single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Private (All roles)
 */
module.exports.getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
                                             .populate('ngo', 'organization_name website_url organization_description'); // Get more NGO details
        
        if (!opportunity) {
            return res.status(4404).json({ error: 'Opportunity not found' });
        }
        
        res.status(200).json({ opportunity });
    } catch (error) {
        console.error("Get Opportunity By ID Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Update an opportunity
 * @route   PUT /api/opportunities/:id
 * @access  Private (NGO owner only)
 */
module.exports.updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }

        
        if (opportunity.ngo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden: You do not own this opportunity.' });
        }

        
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true, runValidators: true } 
        );

        res.status(200).json({ message: "Opportunity updated", opportunity: updatedOpportunity });
    } catch (error) {
        console.error("Update Opportunity Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Delete an opportunity
 * @route   DELETE /api/opportunities/:id
 * @access  Private (NGO owner only)
 */
module.exports.deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }

        if (opportunity.ngo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden: You do not own this opportunity.' });
        }

       
        await mongoose.model('Application').deleteMany({ opportunity: req.params.id });
       
        await Opportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Opportunity and all related applications deleted successfully" });
    } catch (error) {
        console.error("Delete Opportunity Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

