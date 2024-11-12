const express = require('express');
<<<<<<< HEAD
const { authMiddleware } = require('../middlewares/authMiddleware');
const { login, register, getProfile, editProfile, changePassword, logout } = require('../controllers/userController');
=======
const {authUser,authCoordinator} = require('../middlewares/authMiddleware'); 
const {login,register,getProfile,editProfile,changePassword,logout,coordinatorLogin} = require('../controllers/userController');
>>>>>>> 2e235f84013e0f807f2c77e0225ec69ebc80ccc7


const router = express.Router();

<<<<<<< HEAD
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile/edit', authMiddleware, editProfile);
router.patch('/change-password', authMiddleware, changePassword);
=======
router.post('/login',login);
router.post('/register',register);
router.post('/coordinator-login',coordinatorLogin);
router.post('/logout',logout);
router.get('/profile',authUser,getProfile);
router.patch('/profile/edit',authUser,editProfile);
router.patch('/change-password',authUser,changePassword);



>>>>>>> 2e235f84013e0f807f2c77e0225ec69ebc80ccc7
module.exports = router;