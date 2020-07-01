const path = require('path');
const db = require('../dbconfig');

const { con } = db;
let resturantName;
let menu = [];
exports.authpost = async (request, response) => {
  const { fssaiCode } = request.body;
  const { password } = request.body;
  //    response.redirect('/inst/insthome');

  if (request.session.loggedin && request.session.username === fssaiCode) {
    response.redirect(`/client/${fssaiCode}/clienthome`);
  } else {
    const sql = 'SELECT name, password, fssai FROM client where fssai = ? and active=1';
    const vars = [fssaiCode];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
      if (result.password === password) {
        if (menu.length === 0) {
          const sql2 = `Select foodName, price, qty from menu_basic_${fssaiCode} where acive=1`;
          const query2 = con.query({
            sql: sql2,
            timeout: 10000,
          });

          query2.on('result', (res) => {
            menu.push(res);
          });
        }
        request.session.loggedin = true;
        request.session.username = fssaiCode;
        resturantName = result.name;
        response.redirect(`/client/${fssaiCode}/clienthome`);
        response.end();
      } else {
        response.send('wrong password');
      }
    });
    query.on('err', (err) => {
      response.send(`Error:${err}`);
    });
  }
};
exports.clienthome = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    response.render(path.join(`${__dirname}/clientdashboard.ejs`), { client: resturantName });
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.end = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    request.session.destroy();
    menu = [];
  }
  response.redirect('/client/clientauth');
  response.end();
};

exports.updatemenu = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    response.render(path.join(`${__dirname}/clientmenu.ejs`), { client: resturantName, menu });
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};
