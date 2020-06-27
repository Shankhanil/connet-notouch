const express = require('express');

const router = express.Router();

const instmethod = require('./instmethod');

// Get inst login request
router.get('/instauth', instmethod.authget);

// Post inst login requst
router.post('/instauth', instmethod.authpost);

// get home
router.get('/insthome', instmethod.insthome);
router.post('/insthome', instmethod.insthome);

router.post('/new', instmethod.new);
router.get('/new', instmethod.new);

router.post('/registerClient', instmethod.registerClient);
router.get('/registerClient', async (request, response) => {
  response.redirect('/inst/new');
});

router.post('/regen', instmethod.regenPasswordCall);
router.get('/regen', async (request, response) => {
  response.redirect('/inst/insthome');
});

router.post('/regenPassword', instmethod.regenPassword);
router.get('/regenPassword', async (request, response) => {
  response.redirect('/inst/insthome');
});

router.post('/:fssai/addmenu/more', instmethod.addmenu);
router.get('/:fssai/addmenu/more', instmethod.addmenu);

router.post('/fssaiauth', instmethod.fssaiauth);
router.get('/fssaiauth', instmethod.fssaiauth);

router.post('/fssaiauthredirect', instmethod.fssaiauthredirect);
router.get('/fssaiauthredirect', instmethod.fssaiauthredirect);

module.exports = router;
