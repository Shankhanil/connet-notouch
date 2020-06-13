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
    response.send('Client login working.');
    response.end();
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
// ----------------------------------------client login------------------------------------
app.listen(process.env.PORT || 4000, () => {
  // eslint-disable-next-line no-console
  console.log(`Your node js server is running at ${process.env.PORT}`);
});
