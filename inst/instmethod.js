const path = require('path');

exports.authget = async (request, response) => {
      response.sendFile(path.join(`${__dirname}/instlogin.html`));
}
exports.authpost = async (request, response) => {
      const { fssaiCode } = request.body;
  const { password } = request.body;
  if (password == '5f4dcc3b5aa765d61d8327deb882cf99') {
    response.send('Begin installation.');
    response.end();
  } else {
    response.send('Please enter valid Password!');
    response.end();
  }
}
