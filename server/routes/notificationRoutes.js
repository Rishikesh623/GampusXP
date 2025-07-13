const express = require('express');
const {authCoordinator, authUser} = require('../middlewares/authMiddleware'); 
const {getNotifications,addNotification,markRead,notifyCoordinator} = require('../controllers/notificationController');


const router = express.Router();


router.get('/',authUser,getNotifications);
router.post('/add',addNotification);
router.patch('/mark-read',authUser,markRead);
router.post('/registration-change-request',authUser,notifyCoordinator);

module.exports = router;