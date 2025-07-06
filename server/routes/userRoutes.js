const express = require('express');
const {authUser} = require('../middlewares/authMiddleware'); 
const {getUsers,login,register,getProfile,getOtherUserProfile,editProfile,changePassword,logout,coordinatorLogin} = require('../controllers/userController');
const { getUserActivity } = require('../controllers/activityController');
const { getAchievements } = require('../controllers/achievementController');


const router = express.Router();

router.get('/',getUsers);
router.post('/login',login);
router.post('/register',register);
router.post('/coordinator-login',coordinatorLogin);
router.post('/logout',logout);
router.get('/profile',authUser,getProfile);
router.get('/profile/:reg_no',getOtherUserProfile);
router.patch('/profile/edit',authUser,editProfile);
router.patch('/change-password',authUser,changePassword);
router.get('/activity',authUser,getUserActivity);
router.get('/achievements',authUser,getAchievements);



module.exports = router;