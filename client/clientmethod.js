const path = require('path');

exports.authget = async (request, response) => {
      response.sendFile(path.join(`${__dirname}/clientlogin.html`));
}
exports.authpost = async (request, response) => {
      const { fssaiCode } = request.body;
  const { password } = request.body;
  if (fssaiCode && password) {
    response.send('Client login working.');
    response.end();
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
}
