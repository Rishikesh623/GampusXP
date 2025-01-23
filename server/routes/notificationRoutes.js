const express = require('express');
const {authCoordinator, authUser} = require('../middlewares/authMiddleware'); 
const {getNotifications,addNotification,markRead} = require('../controllers/notificationController');


const router = express.Router();


router.get('/',authUser,getNotifications);
router.post('/add',addNotification);
router.patch('/mark-read',authUser,markRead);

module.exports = router;