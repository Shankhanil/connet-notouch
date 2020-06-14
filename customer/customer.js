const express = require('express');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const customermethod = require('./customermethod');
// Get customer login request
router.get('/:resturant/:tableno/begin', customermethod.begin);

// End session
router.get('/:resturant/:tableno/end', customermethod.end);

// get dining status
router.get('/:resturant/:tableno/status', customermethod.status);

module.exports = router;
