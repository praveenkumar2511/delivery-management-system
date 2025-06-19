const express = require('express');
const router = express.Router();
const { allocateOrders } = require('../controllers/allocateController');

router.post('/allocateOrders', allocateOrders);

module.exports = router;
