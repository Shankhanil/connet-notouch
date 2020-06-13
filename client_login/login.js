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

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/client_login/login.html'));
});

app.post('/auth', (request, response) => {
  const { username } = request.body;
  const { password } = request.body;
  if (username && password) {
    // eslint-disable-next-line no-console
    console.log(username + password);
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.get('/home', (request, response) => {
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
