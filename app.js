const express = require('express');
// const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const session = require('express-session');

// Imports
const client = require('./client/client');
const inst = require('./inst/inst');
const customer = require('./customer/customer');

// Database connection

// session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(express.static('public'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
}));

// view engine
app.set('view engine', 'ejs');

// static variables
app.use('/public', express.static(`${__dirname}/public`));

app.use('/client', client);
app.use('/inst', inst);
app.use('/customer', customer);

app.use('/', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  //    res.sendFile(__dirname + '/public/index.html');
  res.send('connet notouch is working');
  next();
});

module.exports = app;
