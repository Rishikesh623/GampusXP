
const express = require('express');
const {authUser,authCoordinator} = require('../middlewares/authMiddleware');
const {createChallenge,updateChallenge,proposeChallenge,inviteOthers,acceptChallenge,getChallenges,
        markComplete,deleteChallenge} = require('../controllers/challengesController');
       
const router = express.Router();

router.get('/',authCoordinator,authUser,getChallenges);
router.post('/create',authCoordinator,createChallenge);
router.post('/propose',authUser,proposeChallenge);
router.patch('/invite',authUser,inviteOthers);
router.patch('/accept',authUser,acceptChallenge);
router.patch('/edit',authCoordinator,updateChallenge);
router.patch('/complete',authUser,markComplete);
router.delete('/delete',authCoordinator,deleteChallenge);

module.exports = router;
