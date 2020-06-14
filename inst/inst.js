const express = require('express');

const router = express.Router();

const instmethod = require('./instmethod');

// Get inst login request
router.get('/instauth', instmethod.authget);

// Post inst login requst
router.post('/instauth', instmethod.authpost);

// get home
router.get('/insthome', instmethod.insthome);

module.exports = router;
