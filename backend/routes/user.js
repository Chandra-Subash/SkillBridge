const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.js'); 

router.get('/dashboard', protect, userController.getVolunteerDashboard);
router.get('/dashboard-ngo',protect,userController.getNgoDashboard);

router.get('/profile', protect, userController.getUserProfile);

router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;
