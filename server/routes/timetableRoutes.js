
const express = require('express');
const {authUser} = require('../middlewares/authMiddleware'); 
const {createTimetable,addSlot,getTimetable,editSlot,deleteTimetable, deleteSlot} = require('../controllers/timetableController');


const router = express.Router();

router.get('/',authUser,getTimetable);
router.post('/create',authUser,createTimetable);
router.patch('/add-slot',authUser,addSlot);
router.patch('/edit-slot',authUser,editSlot);
router.delete('/delete-slot',authUser,deleteSlot);
router.delete('/delete',authUser,deleteTimetable);


module.exports = router;