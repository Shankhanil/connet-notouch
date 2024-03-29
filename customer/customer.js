const express = require('express');
const path = require('path');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const customermethod = require('./customermethod');

// Get customer login request

router.get('/:fssai/:tableno/thankyou', async (req, res) => {
  res.render(path.join(`${__dirname}/customerbye.ejs`));
});

router.post('/:fssai/:tableno/begin', customermethod.begin);
router.get('/:fssai/:tableno/begin', customermethod.home);

// End session
router.post('/:fssai/:tableno/end', customermethod.end);
router.get('/:fssai/:tableno/end', customermethod.end);

router.get('/:fssai/:tableno/status', customermethod.status);
router.post('/:fssai/:tableno/status', customermethod.status);

router.get('/:fssai/:tableno/order', customermethod.getorder);
router.post('/:fssai/:tableno/order', customermethod.postorder);

router.post('/:fssai/:tableno/bill', customermethod.generatebill);
router.get('/:fssai/:tableno/bill', customermethod.generatebill);

router.post('/:fssai/:tableno/menu', customermethod.menuRedirect);
router.get('/:fssai/:tableno/menu', customermethod.menuRedirect);

router.get('/:fssai/:tableno/additem/:itemno', customermethod.additem);
router.post('/:fssai/:tableno/additem/:itemno', customermethod.additem);

router.get('/:fssai/:tableno/removeitem/:itemno', customermethod.removeitem);
router.post('/:fssai/:tableno/removeitem/:itemno', customermethod.removeitem);

router.get('/:fssai/:tableno/place', customermethod.placeorder);
router.post('/:fssai/:tableno/place', customermethod.placeorder);

router.get('/:fssai/:tableno/pay', customermethod.requestbill);
router.post('/:fssai/:tableno/pay', customermethod.requestbill);

module.exports = router;
