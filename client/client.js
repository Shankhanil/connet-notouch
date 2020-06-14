const express = require('express');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const clientmethod = require('./clientmethod');
// Get client login request
router.get('/clientauth', clientmethod.authget);

// Post client login requst
router.post('/clientauth', clientmethod.authpost);

// get client home
router.get('/clienthome', clientmethod.clienthome);

module.exports = router;