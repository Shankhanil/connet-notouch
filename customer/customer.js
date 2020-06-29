const express = require('express');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const customermethod = require('./customermethod');

// Get customer login request
router.post('/:fssai/:tableno/begin', customermethod.begin);

// End session
router.post('/:fssai/:tableno/end', customermethod.end);
router.get('/:fssai/:tableno/end', customermethod.end);

router.get('/:fssai/:tableno/status', customermethod.status);
router.post('/:fssai/:tableno/status', customermethod.status);

router.get('/:fssai/:tableno/begin', customermethod.home);

router.get('/:fssai/:tableno/order', customermethod.getorder);
router.post('/:fssai/:tableno/order', customermethod.postorder);

router.post('/:fssai/:tableno/bill', customermethod.generatebill);
router.get('/:fssai/:tableno/bill', customermethod.generatebill);

module.exports = router;
