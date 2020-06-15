const express = require('express');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const customermethod = require('./customermethod');

// Get customer login request
router.post('/:resturant/:tableno/begin', customermethod.begin);

// End session
router.post('/:resturant/:tableno/end', customermethod.end);

router.get('/:resturant/:tableno/status', customermethod.status);
router.post('/:resturant/:tableno/status', customermethod.status);

router.get('/:resturant/:tableno/begin', customermethod.home);

module.exports = router;
