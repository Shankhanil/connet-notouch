const path = require('path');
const db = require('../dbconfig');
const misc = require('../extras/misc');
const mailer = require('../extras/mailer');

const { con } = db;
let menu = [];
let resturantName;
let clientMail;
let orderid  = 0;

exports.home = async (request, response) => {
  // eslint-disable-next-line max-len

  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai
     && request.session.order.orderstatus === 'order') {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
    response.end();
  } else if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai
             && request.session.order.orderstatus === 'placed') {
    response.render(path.join(`${__dirname}/customerpayment.ejs`), {
      resturant: resturantName, tableno: request.params.tableno, bill: request.session.order.orderbill,
    });
  } else {
    let sql = 'Select name, email from client where fssai=? and active = 1';
    const vars = [request.params.fssai];
    let query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
    //    menu.push(result);
      resturantName = result.name;
      clientMail = result.email;
      if (menu.length === 0) {
        sql = `Select foodName, price, qty from menu_basic_${request.params.fssai} where acive=1`;
        query = con.query({
          sql,
          timeout: 10000,
        });

        query.on('result', (res) => {
          menu.push(res);
        });
      }
      response.render(path.join(`${__dirname}/customerhome.ejs`), { resturant: resturantName, tableno: request.params.tableno });
    });
  }
};
exports.begin = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai
     && request.session.order.orderstatus === 'order') {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
  } else if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai
     && request.session.order.orderstatus === 'placed') {
    response.render(path.join(`${__dirname}/customerpayment.ejs`), {
      resturant: resturantName, tableno: request.params.tableno, bill: request.session.order.orderbill,
    });
  } else {
    request.session.date = misc.today();
    request.session.loggedin = true;
    request.session.tableno = request.params.tableno;
    request.session.fssai = request.params.fssai;
    request.session.order = {
      orderid: orderid +1,
      orderstatus: 'order',
      orderdate: request.session.date = misc.today(),
      ordercount: 0,
      orderbill: 0,
      orderdetails: {},
    };
    response.render(path.join(`${__dirname}/customermenu.ejs`), {
      resturant: resturantName, tableno: request.params.tableno, order: request.session.order, menu,
    });
  }
    orderid+=1;
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
    if (request.session.order.orderstatus === 'placed') {
      response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    } else {
      request.session.destroy();
      menu = [];
      response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
      response.end();
    }
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
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
    for (const key in request.session.order.orderdetails) {
      if (request.session.order.orderdetails[key]) {
        bill += request.session.order.orderdetails[key].qty
            * request.session.order.orderdetails[key].price;
      }
    }
    request.session.order.orderbill = bill;
    response.render(path.join(`${__dirname}/customerbill.ejs`), {
      resturant: resturantName,
      tableno: request.params.tableno,
      order: request.session.order,
      bill: request.session.order.orderbill,
      date: request.session.date,
    });
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.menuRedirect = async (request, response) => {
  response.render(path.join(`${__dirname}/customermenu.ejs`), {
    resturant: resturantName, tableno: request.params.tableno, order: request.session.order, menu,
  });
};

exports.additem = async (request, response) => {
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    const index = request.params.itemno;
    if (request.session.order.orderdetails[`${index}`] == null) {
      request.session.order.ordercount += 1;
      request.session.order.orderdetails[`${index}`] = {};
      request.session.order.orderdetails[`${index}`].name = menu[index].foodName;
      request.session.order.orderdetails[`${index}`].price = menu[index].price;
      request.session.order.orderdetails[`${index}`].qty = 1;
    } else {
      request.session.order.orderdetails[`${index}`].qty += 1;
    }
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/menu`);
    response.end();
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};
exports.removeitem = async (request, response) => {
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    const index = request.params.itemno;
    if (request.session.order.orderdetails[`${index}`] != null
        && request.session.order.orderdetails[`${index}`].qty >= 1) {
      request.session.order.orderdetails[`${index}`].qty -= 1;
    }
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/menu`);
    response.end();
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.placeorder = async (request, response) => {
  const message = '';
  for (const key in request.session.order.orderdetails) {
    if (request.session.order.orderdetails[key] && request.session.order.orderdetails[key].qty > 0) {
      //      message += `Item: ${request.session.order.orderdetails[key].name}---${request.session.order.orderdetails[key].qty} \n`;
      const sql = `insert into order_${request.params.fssai} (tableno, item, qty) values (?,?,?)`;
      const vars = [request.params.tableno, request.session.order.orderdetails[key].name, request.session.order.orderdetails[key].qty];
      const query = con.query({
        sql,
        timeout: 10000,
      }, vars);
    }
  }
  //  mailer.mailOrder(clientMail, message, request.params.tableno);
  request.session.order.orderstatus = 'placed';
  response.render(path.join(`${__dirname}/customerpayment.ejs`), {
    resturant: resturantName, tableno: request.params.tableno, bill: request.session.order.orderbill,
  });
};

exports.requestbill = async (request, response) => {
  const message = `Please send bill to table ${request.params.tableno}. Total bill is Rs. ${request.session.order.orderbill} `;
  mailer.mailBill(clientMail, message, request.params.tableno);
  request.session.order.orderstatus = 'billed';
  const sql = `delete from order_${request.params.fssai} where tableno = ?`;
  const vars = [request.params.tableno];
  const query = con.query({
    sql,
    timeout: 10000,
  }, vars);
    
    const sql2 = `insert into payment_${request.params.fssai} (orderid, amount) values (?, ?)`;
    const vars2 = [request.session.order.orderid, request.session.order.orderbill];
    const query2 = con.query({
        sql: sql2,
        timeout:10000
    }, vars2);
  response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/end`);
};
