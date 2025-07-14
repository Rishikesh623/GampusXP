const express = require('express');

const { authUser } = require('../middlewares/authMiddleware');
const { globalSearch } = require('../controllers/searchController');

const router = express.Router();

router.get('/',authUser,globalSearch);

module.exports = router;
