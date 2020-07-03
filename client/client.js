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

router.get('/:fssaiCode/delivered/:orderid', clientmethod.delivered);
router.post('/:fssaiCode/delivered/:orderid', clientmethod.delivered);

module.exports = router;
