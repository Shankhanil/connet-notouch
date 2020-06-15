const path = require('path');

exports.authget = async (request, response) => {
  response.sendFile(path.join(`${__dirname}/clientlogin.html`));
};
exports.authpost = async (request, response) => {
  const { fssaiCode } = request.body;
  const { password } = request.body;
  if (request.session.loggedin && request.session.username === 'client') {
    response.redirect('/client/clienthome');
  }
  if (fssaiCode && password) {
    request.session.loggedin = true;
    request.session.username = 'client';
    response.redirect('/client/clienthome');
  } else {
    response.send('Please enter Username and Password!');
  }
  response.end();
};
exports.clienthome = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'client') {
    //    response.send(`Welcome back, ${request.session.username}!`);
    response.sendFile(path.join(`${__dirname}/clientdashboard.html`));
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};
