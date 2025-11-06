const Application = require('../models/application.js');
const Opportunity = require('../models/opportunity.js');

/**
 * @desc    Apply for an opportunity
 * @route   POST /api/applications/apply/:opportunityId
 * @access  Private (Volunteer only)
 */
module.exports.applyToOpportunity = async (req, res) => {
    try {
        if (req.user.role !== 'volunteer') {
            return res.status(403).json({ error: 'Forbidden: Only volunteers can apply.' });
        }

        const opportunityId = req.params.opportunityId;
        const volunteerId = req.user._id;

       
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity || opportunity.status !== 'open') {
            return res.status(404).json({ error: 'Opportunity not found or is closed.' });
        }

        
        const existingApplication = await Application.findOne({
            opportunity: opportunityId,
            volunteer: volunteerId
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this opportunity.' });
        }

       
        const application = await Application.create({
            opportunity: opportunityId,
            volunteer: volunteerId,
            status: 'pending'
        });

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        console.error("Apply Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get all applications for the logged-in volunteer
 * @route   GET /api/applications/my
 * @access  Private (Volunteer only)
 */
module.exports.getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== 'volunteer') {
            return res.status(403).json({ error: 'Forbidden: Not authorized.' });
        }

        const applications = await Application.find({ volunteer: req.user._id })
            .populate({
                path: 'opportunity', 
                select: 'title description location status'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Get all applications for the logged-in NGO
 * @route   GET /api/applications/ngo
 * @access  Private (NGO only)
 */
module.exports.getNgoApplications = async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Not authorized.' });
        }

       
        const ngoOpportunities = await Opportunity.find({ ngo: req.user._id });

        
        const opportunityIds = ngoOpportunities.map(opp => opp._id);

       
        const applications = await Application.find({ 
            opportunity: { $in: opportunityIds } 
        })
        .populate('volunteer', 'name email skills')
        .populate('opportunity') 
        
        .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (error) {
        console.error("Get NGO Apps Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc    Update an application's status (accept/reject)
 * @route   PUT /api/applications/:id
 * @access  Private (NGO only)
 */
module.exports.updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Not authorized.' });
        }

        const { status } = req.body;
        const applicationId = req.params.id;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected".' });
        }

        const application = await Application.findById(applicationId).populate('opportunity');
        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        
        if (application.opportunity.ngo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to update this application.' });
        }
        

       
        application.status = status;
        await application.save();

        res.status(200).json({ message: "Application status updated", application });
    } catch (error) {
        console.error("Update App Status Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};
