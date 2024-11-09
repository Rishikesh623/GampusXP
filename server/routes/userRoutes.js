
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware'); 
const {login,register,getProfile,editProfile,changePassword,logout} = require('../controllers/userController');


const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.post('/logout',logout);
router.get('/profile',authMiddleware,getProfile);
router.patch('/profile/edit',authMiddleware,editProfile);
router.patch('/change-password',authMiddleware,changePassword);
module.exports = router;