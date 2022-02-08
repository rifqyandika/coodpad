const express = require('express');
const { getFoods } = require('../controllers');
const router = express.Router();


router.get('/food', getFoods)


module.exports = router;