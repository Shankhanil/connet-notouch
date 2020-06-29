const path = require('path');
const db = require('../dbconfig');
const misc = require('../extras/misc');
// const io = require('../socket');

const { con } = db;
const menu = [];
let resturantName;

exports.home = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
    response.end();
  } else {
    const sql = 'Select name from client where fssai=?';
    const vars = [request.params.fssai];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
    //    menu.push(result);
      resturantName = result.name;
    response.render(path.join(`${__dirname}/customerhome.ejs`), { resturant: resturantName, tableno: request.params.tableno });
    });
  }
};
exports.begin = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
  }
  request.session.date = misc.today();
  request.session.loggedin = true;
  request.session.tableno = request.params.tableno;
  request.session.fssai = request.params.fssai;
  request.session.order = {
    orderid: 1,
    orderdate: request.session.date = misc.today(),
    ordercount: 0,
    orderbill: 0,
    orderdetails: {},
  };

  const sql = `Select foodName, price, qty from menu_basic_${request.session.fssai} where acive=1`;
  const query = con.query({
    sql,
    timeout: 10000,
  });

  query.on('result', (result) => {
    menu.push(result);
  });

  response.render(path.join(`${__dirname}/customerorder.ejs`), { resturant: resturantName, tableno: request.params.tableno, order: request.session.order });
  response.end();
};

exports.status = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    response.render(path.join(`${__dirname}/customerstatus.ejs`), { resturant: resturantName, tableno: request.params.tableno });
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
  }
  response.end();
};

exports.end = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    request.session.destroy();
  }
  response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
  response.end();
};

exports.getorder = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    response.render(path.join(`${__dirname}/customerorder.ejs`), { resturant: resturantName, tableno: request.params.tableno, order: request.session.order });
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.postorder = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    if (request.session.order.orderdetails.item == null) {
      request.session.order.ordercount += 1;
      request.session.order.orderdetails.item = {};
      request.session.order.orderdetails.item.name = 'Naan';
      request.session.order.orderdetails.item.qty = 1;
    } else {
      request.session.order.orderdetails.item.qty += 1;
    }
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
    response.end();
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.generatebill = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    let bill = 0;
    if (request.session.order.orderdetails.item != null) {
      bill = request.session.order.orderdetails.item.qty * 20;
    }

    response.render(path.join(`${__dirname}/customerbill.ejs`), {
      resturant: resturantName,
      tableno: request.params.tableno,
      order: request.session.order,
      bill,
      date: request.session.date,
    });
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};
