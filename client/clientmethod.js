const path = require('path');
const config = require('../config');

const { con } = config;
let resturantName;
const menu = [];
const orders = [];
const paymenthist = []; const
  unpaidbills = [];

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
        //        }
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
    menu.length = 0;
  }
  response.redirect('/client/clientauth');
  response.end();
};

exports.updatemenu = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    menu.length = 0;
    //        if (menu.length === 0) {
    const sql2 = `Select foodName, price, qty, category from menu_basic_${request.params.fssaiCode} where acive=1 order by category`;
    const query2 = con.query({
      sql: sql2,
      timeout: 10000,
    });

    query2.on('result', (res) => {
      menu.push(res);
    });
    setTimeout(() => {
      response.render(path.join(`${__dirname}/clientmenu.ejs`), { client: resturantName, menu });
    }, 1000);
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.getorders = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    const currentdate = new Date();
    const datetime = `${currentdate.getDate()}/${
      currentdate.getMonth() + 1}/${
      currentdate.getFullYear()} @ ${
      currentdate.getHours()}:${
      currentdate.getMinutes()}:${
      currentdate.getSeconds()}`;

    const sql = `SELECT tableno, item, qty FROM order_${request.params.fssaiCode} WHERE active = 0 ORDER BY tableno`;
    const query = con.query({
      sql,
      timeout: 10000,
    });
    query.on('result', (res) => {
      orders.push(res);
    });
    const sql2 = `SELECT tableno, amount, orderdate FROM payment_${request.params.fssaiCode} WHERE isbilled = 0 ORDER BY orderdate`;
    const query2 = con.query({
      sql: sql2,
      timeout: 10000,
    });
    query2.on('result', (res) => {
      unpaidbills.push(res);
    });

    setTimeout(() => {
      response.render(path.join(`${__dirname}/clientorders.ejs`), {
        resturant: resturantName, tableno: request.params.tableno, orders, datetime, unpaidbills,
      });
    }, 1100);
    orders.length = 0;
    unpaidbills.length = 0;
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.delivered = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    const sql = `UPDATE order_${request.params.fssaiCode} SET active = 1 where tableno = ? and item = ? and qty = ?`;
    const vars = [orders[`${request.params.orderid}`].tableno, orders[`${request.params.orderid}`].item, orders[`${request.params.orderid}`].qty];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);
    query.on('result', () => {
      setTimeout(() => { response.redirect(`/client/${request.params.fssaiCode}/order`); }, 200);
    });
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.paid = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    const sql = `UPDATE payment_${request.params.fssaiCode} SET isbilled = 1 where tableno = ? and amount = ?`;
    const vars = [unpaidbills[`${request.params.orderid}`].tableno,
      unpaidbills[`${request.params.orderid}`].amount,
    ];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);
    query.on('result', () => {
      setTimeout(() => { response.redirect(`/client/${request.params.fssaiCode}/order`); }, 200);
    });
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};

exports.paymenthistory = async (request, response) => {
  if (request.session.loggedin && request.session.username === request.params.fssaiCode) {
    const sql = `SELECT orderdate, orderid, amount FROM payment_${request.params.fssaiCode} order by orderdate`;
    const query = con.query({
      sql,
      timeout: 10000,
    });
    query.on('result', (res) => {
      paymenthist.push(res);
    });
    setTimeout(() => {
      response.render(path.join(`${__dirname}/clientpayment.ejs`), {
        resturant: resturantName, tableno: request.params.tableno, paymenthist,
      });
    }, 1000);
    paymenthist.length = 0;
  } else {
    response.redirect('/client/clientauth');
    response.end();
  }
};
