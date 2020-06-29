const express = require('express');
const path = require('path');

const router = express.Router();

const instmethod = require('./instmethod');

// Get inst login request
router.get('/instauth', async (request, response) => {
  response.sendFile(path.join(`${__dirname}/instLogin.html`));
});

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

router.post('/fssaiauthredirect', async (request, response) => {
  response.redirect(`/inst/${request.body.fssaiCode}/addmenu/more`);
});
router.get('/fssaiauthredirect', async (request, response) => {
  response.redirect(`/inst/${request.body.fssaiCode}/addmenu/more`);
});

router.get('/:fssai/addmenu/finish', async (request, response) => {
  response.redirect(`/inst/${request.body.fssaiCode}/addmenu/more`);
});

router.post('/:fssai/addmenu/finish', instmethod.finish);

module.exports = router;
