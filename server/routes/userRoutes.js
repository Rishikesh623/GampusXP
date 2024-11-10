
const express = require('express');
const {authUser,authCoordinator} = require('../middlewares/authMiddleware'); 
const {login,register,getProfile,editProfile,changePassword,logout,coordinatorLogin} = require('../controllers/userController');


const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.post('/coordinator-login',coordinatorLogin);
router.post('/logout',logout);
router.get('/profile',authUser,getProfile);
router.patch('/profile/edit',authUser,editProfile);
router.patch('/change-password',authUser,changePassword);



module.exports = router;