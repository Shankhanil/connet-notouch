// const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// --------------------------------client login---------------------------------------
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/clientauth', (request, response) => {
  response.sendFile(path.join(`${__dirname}/clientlogin.html`));
});

app.post('/clientauth', (request, response) => {
  const { fssaiCode } = request.body;
  const { password } = request.body;
  
  if (fssaiCode && password) {
    request.session.loggedin = true;
    request.session.username = fssaiCode;
    response.redirect('/clienthome');
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.get('/clienthome', (request, response) => {
  if (request.session.loggedin) {
    response.send(`Welcome back, ${request.session.username}!`);
  } else {
    response.send('Please login to view this page!');
  }
  response.end();
});
// ----------------------------------------Installation login------------------------------------
app.get('/instauth', (request, response) => {
  response.sendFile(path.join(`${__dirname}/installationlogin.html`));
});

app.post('/instauth', (request, response) => {
//  const { fssaiCode } = request.body;
  const { password } = request.body;
  if (password === '21232f297a57a5a743894a0e4a801fc3') {
    request.session.loggedin = true;
    request.session.username = 'admin';
    response.redirect('/insthome');
  } else {
    response.send('Incorrect Username and/or Password!');
  }
  response.end();
});

app.get('/insthome', (request, response) => {
  if (request.session.loggedin) {
    response.send(`Welcome back, ${request.session.username}!`);
    request.session.destroy();
  } else {
    response.redirect('/instauth');
  }
  response.end();
});

// -----------------------------------------SERVER-------------------------
app.listen(process.env.PORT || 4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Your node js server is running at ${process.env.PORT}`);
});
