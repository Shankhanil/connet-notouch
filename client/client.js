const express = require('express');
const path = require('path');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const clientmethod = require('./clientmethod');

router.get('/clientauth', async (request, response) => {
  response.sendFile(path.join(`${__dirname}/clientlogin.html`));
});

router.post('/clientauth', clientmethod.authpost);
router.get('/:fssaiCode/clienthome', clientmethod.clienthome);
router.post('/:fssaiCode/clienthome', clientmethod.clienthome);

router.get('/:fssaiCode/end', clientmethod.end);
router.post('/:fssaiCode/end', clientmethod.end);

router.get('/:fssaiCode/menu', clientmethod.updatemenu);
router.post('/:fssaiCode/menu', clientmethod.updatemenu);

router.get('/:fssaiCode/order', clientmethod.getorders);
router.post('/:fssaiCode/order', clientmethod.getorders);

router.get('/:fssaiCode/delivered/:tableno', clientmethod.delivered);
router.post('/:fssaiCode/delivered/:tableno', clientmethod.delivered);

router.get('/:fssaiCode/paid/:orderid', clientmethod.paid);
router.post('/:fssaiCode/paid/:orderid', clientmethod.paid);

router.get('/:fssaiCode/paymenthist', clientmethod.paymenthistory);
router.post('/:fssaiCode/paymenthist', clientmethod.paymenthistory);

module.exports = router;
