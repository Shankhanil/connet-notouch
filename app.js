const express = require('express');
// const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const session = require('express-session');

// Imports
const client = require('./client/client');
const inst = require('./inst/inst');
const customer = require('./customer/customer');

// session
app.use(session({
  secret: '5ebe2294ecd0e0f08eab7690d2a6ee69',
  resave: true,
  saveUninitialized: true,
  maxAge: 5000,
}));

app.use(express.static('public'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/`);

// static variables
app.use('/public', express.static(`${__dirname}/public`));

app.use('/client', client);
app.use('/inst', inst);
app.use('/customer', customer);

app.use('/', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.send('connet notouch is working');
  next();
});

module.exports = app;
