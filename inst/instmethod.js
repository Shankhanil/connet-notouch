const path = require('path');
const mailer = require('../extras/mailer');
const passwordGen = require('../extras/passwordGen');

exports.authget = async (request, response) => {
  response.sendFile(path.join(`${__dirname}/instLogin.html`));
};
exports.authpost = async (request, response) => {
  const { password } = request.body;
  if (password === '21232f297a57a5a743894a0e4a801fc3') {
    request.session.loggedin = true;
    request.session.username = 'admin';
    response.redirect('/inst/insthome');
  } else {
    response.send('Incorrect Username and/or Password!');
  }
  response.end();
};

exports.insthome = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/insthome.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.new = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/clientinstaller.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
exports.registerClient = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    const {
      fssaiCode, resturantName, email, phoneNumber,
    } = request.body;
    const password = passwordGen.generatePassword(fssaiCode);
    mailer.mailClient(email, { fssaiCode, password });
    response.send(`${fssaiCode}, ${resturantName}, ${email}, ${phoneNumber}, ${password} Client details`);
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
