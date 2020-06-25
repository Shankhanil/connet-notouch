const path = require('path');
// const mysql = require('mysql');
const misc = require('../extras/misc');
/*
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'connetdb',
});
*/
exports.home = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/order`);
    response.end();
  } else {
    response.render(path.join(`${__dirname}/customerhome.ejs`), { resturant: request.params.resturant, tableno: request.params.tableno });
  }
};

exports.begin = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/order`);
  }
  request.session.date = misc.today();
  request.session.loggedin = true;
  request.session.tableno = request.params.tableno;
  request.session.resturant = request.params.resturant;
  request.session.order = {
    orderid: 1,
    orderdate: request.session.date = misc.today(),
    ordercount: 0,
    orderbill: 0,
    orderdetails: {},
  };
  response.render(path.join(`${__dirname}/customerorder.ejs`), { resturant: request.params.resturant, tableno: request.params.tableno, order: request.session.order });
  response.end();
};

exports.status = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.render(path.join(`${__dirname}/customerstatus.ejs`), { resturant: request.params.resturant, tableno: request.params.tableno });
  } else {
    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  }
  response.end();
};

exports.end = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    request.session.destroy();
  }
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  response.end();
};

exports.getorder = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.render(path.join(`${__dirname}/customerorder.ejs`), { resturant: request.params.resturant, tableno: request.params.tableno, order: request.session.order });
  }
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  response.end();
};

exports.postorder = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    if (request.session.order.orderdetails.item == null) {
      request.session.order.ordercount += 1;
      request.session.order.orderdetails.item = {};
      request.session.order.orderdetails.item.name = 'Naan';
      request.session.order.orderdetails.item.qty = 1;
    } else {
      request.session.order.orderdetails.item.qty += 1;
    }

    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/order`);
  }
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  response.end();
};

exports.generatebill = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    let bill = 0;
    if (request.session.order.orderdetails.item != null) {
      bill = request.session.order.orderdetails.item.qty * 20;
    }

    response.render(path.join(`${__dirname}/customerbill.ejs`), {
      resturant: request.params.resturant,
      tableno: request.params.tableno,
      order: request.session.order,
      bill,
      date: request.session.date,
    });
  }
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  response.end();
};
