const express = require('express');
const path = require('path');

const router = express.Router();
// const cacheMiddleware = require('../middlewares/cache');
const clientmethod = require('./clientmethod');


router.get('/clientauth', async (request, response) => {
  response.sendFile(path.join(`${__dirname}/clientlogin.html`));
});


router.post('/clientauth', clientmethod.authpost);
router.get('/clienthome', clientmethod.clienthome);

router.get('/end', async (request, response) => {
  if (request.session.loggedin && request.session.username === 'client') {
    request.session.destroy();
  }
  response.redirect('/client/clientauth');
  response.end();
});
router.post('/end', async (request, response) => {
  if (request.session.loggedin && request.session.username === 'client') {
    request.session.destroy();
  }
  response.redirect('/client/clientauth');
  response.end();
});

module.exports = router;
