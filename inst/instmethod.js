const path = require('path');

exports.authget = async (request, response) => {
  response.sendFile(path.join(`${__dirname}/instlogin.html`));
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
    response.send(`Welcome back, ${request.session.username}!`);
  } else {
    response.redirect('/inst/instauth');
  }
  response.end();
};
