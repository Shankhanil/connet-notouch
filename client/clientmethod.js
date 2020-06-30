const path = require('path');
const db = require('../dbconfig');

const { con } = db;

exports.authpost = async (request, response) => {
  const { fssaiCode } = request.body;
  const { password } = request.body;
  //    response.redirect('/inst/insthome');

  if (request.session.loggedin && request.session.username === 'client') {
    response.redirect('/client/clienthome');
  } else {
    const sql = 'SELECT name, password, fssai FROM client where fssai = ? and active=1';
    const vars = [fssaiCode];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
      if (result.password === password) {
        request.session.loggedin = true;
        request.session.username = 'client';
        response.redirect('/client/clienthome');
        response.end();
      } else {
        response.send('wrong password');
      }
    });
    query.on('err', (err) => {
      response.send(`Error:${err}`);
    });
  }
  //  response.send('no query result. WTF');*/
};
exports.clienthome = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'client') {
    response.render(path.join(`${__dirname}/clientdashboard.ejs`));
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.end = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'client') {
    request.session.destroy();
  }
  response.redirect('/client/clientauth');
  response.end();
};
