
const express = require('express');

const {authUser} = require('../middlewares/authMiddleware'); 
const {getAssignments,editAssignment, addAssignment, removeAssignment} = require('../controllers/assignmentController');


const router = express.Router();


router.get('/',authUser,getAssignments);
router.post('/add',authUser,addAssignment);
router.patch('/edit',authUser,editAssignment);
router.delete('/remove',authUser,removeAssignment);


module.exports = router;