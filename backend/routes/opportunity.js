const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller.js');
const { protect } = require('../middleware/auth.js'); 


router.post('/', protect, opportunityController.createOpportunity);

router.get('/my', protect, opportunityController.getMyOpportunities);

router.put('/:id', protect, opportunityController.updateOpportunity);

router.delete('/:id', protect, opportunityController.deleteOpportunity);



router.get('/', protect, opportunityController.getAllOpenOpportunities);


router.get('/:id', protect, opportunityController.getOpportunityById);

module.exports = router;

