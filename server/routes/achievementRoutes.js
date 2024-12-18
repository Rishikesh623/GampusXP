const express = require('express');
const { getAchievements } = require('../controllers/achievementController');
const {authUser} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/achievements', authUser, getAchievements);

module.exports = router;
