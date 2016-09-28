const express = require('express');
const router = express.Router();

const ctrlIndex = require('../controllers/index');

/* GET home page. */
router.get('/', ctrlIndex);

module.exports = router;
