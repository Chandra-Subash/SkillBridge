const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller.js');
const { protect } = require('../middleware/auth.js');

router.post('/apply/:opportunityId', protect, applicationController.applyToOpportunity);

router.get('/my', protect, applicationController.getMyApplications);



router.get('/ngo', protect, applicationController.getNgoApplications);


router.put('/:id', protect, applicationController.updateApplicationStatus);

module.exports = router;
