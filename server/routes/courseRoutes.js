
const express = require('express');
const {authCoordinator, authUser} = require('../middlewares/authMiddleware'); 
const {createCourse,editCourse, addCourse, removeCourse} = require('../controllers/courseController');


const router = express.Router();


router.post('/create',authCoordinator,createCourse);
router.post('/edit',authCoordinator,editCourse);
router.patch('/add',authUser,addCourse);
router.patch('/remove',authUser,removeCourse);


module.exports = router;