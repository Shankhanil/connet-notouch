const express = require('express');

const router = express.Router();

const instmethod = require('./instmethod');

// Get inst login request
router.get('/instauth', instmethod.authget);

// Post inst login requst
router.post('/instauth', instmethod.authpost);

// get home
router.get('/insthome', instmethod.insthome);

router.post('/new', instmethod.new);
router.get('/new', instmethod.new);

router.post('/registerClient', instmethod.registerClient);
router.get('/registerClient', instmethod.registerClient);

module.exports = router;
