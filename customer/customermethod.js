const path = require('path');
const config = require('../config');
const misc = require('../extras/misc');
const {invoiceNo} = require('../extras/invoiceNo');

const { con, sgst, cgst } = config;
const menu = [];
let resturantName; let
  gstin;
let orderid = 0;
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
      resturant: resturantName,
      tableno: request.params.tableno,
      bill: request.session.order.orderbill,
    });
  } else {
    //    const blockedSql = 'Select tableno, fssai from blocked where fssai=? and tableno = ?';
    //    const blockedVars = [request.params.fssai, request.params.tableno];
    //    const blockedQuery = con.query({
    //      sql: blockedSql,
    //      timeout: 10000,
    //    }, blockedVars);
    //    let isBlocked = 0;
    //
    //    blockedQuery.on('result', () => { isBlocked = 1; response.send('blocked'); response.end(); });
    //    if (isBlocked === 0) {
    menu.length = 0;
    let sql = 'Select name, gst from client where fssai=? and active = 1';
    const vars = [request.params.fssai];
    let query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
      //    menu.push(result);
      resturantName = result.name;
      gstin = result.gst;
      if (menu.length === 0) {
        sql = `Select foodName, price, qty, category from menu_basic_${request.params.fssai} where acive=1 order by category`;
        query = con.query({
          sql,
          timeout: 10000,
        });

        query.on('result', (res) => {
          menu.push(res);
        });
      }
      setTimeout(() => {
        response.render(path.join(`${__dirname}/customerhome.ejs`), { resturant: resturantName, tableno: request.params.tableno });
      }, 500);
    });
    //    }
    //    });
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
      resturant: resturantName,
      tableno: request.params.tableno,
      bill: request.session.order.orderbill,
    });
  } else {
    //    const blockedSql = 'Select tableno, fssai from blocked where fssai=? and tableno = ?';
    //    const blockedVars = [request.params.fssai, request.params.tableno];
    //    const blockedQuery = con.query({
    //      sql: blockedSql,
    //      timeout: 10000,
    //    }, blockedVars);
    //    let isblocked = 0;
    //
    //    blockedQuery.on('result', () => { isblocked = 1; response.send('blocked'); response.end(); });
    //    if (isblocked === 0) {
    request.session.date = misc.today();
    request.session.loggedin = true;
    request.session.tableno = request.params.tableno;
    request.session.fssai = request.params.fssai;
    request.session.order = {
      orderid: invoiceNo(),
      orderstatus: 'order',
      orderdate: request.session.date = misc.today(),
      ordercount: 0,
      orderbill: 0,
      orderdetails: {},
    };
    const sql2 = `delete from order_${request.params.fssai} where tableno = ?`;
    const vars2 = [request.params.tableno];
    const query2 = con.query({
      sql: sql2,
      timeout: 10000,
    }, vars2);
    query2.on('result', () => {});

    //      const blockSql = 'insert into blocked (fssai, tableno) values (?, ?) ';
    //      const blockVars = [request.params.fssai, request.params.tableno];
    //      const blockQuery = con.query({
    //        sql: blockSql,
    //        timeout: 10000,
    //      }, blockVars);
    //
    //      blockQuery.on('result', () => {
    //        // table blocked.
    //      });
      

    response.render(path.join(`${__dirname}/customermenu.ejs`), {
      resturant: resturantName, tableno: request.params.tableno, order: request.session.order, menu,
    });
    //    }
  }
  orderid += 1;
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
      menu.length = 0;
      //      const blockedSQL = 'delete from blocked where fssai=? and tableno=?';
      //      const blockedVars = [request.params.fssai, request.params.tableno];
      //      const blockedQuery = con.query({
      //        sql: blockedSQL,
      //        timeout: 10000,
      //      }, blockedVars);
      //
      //      blockedQuery.on('result', () => {});
      response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/thankyou`);
      response.end();
    }
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/thankyou`);
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
    const sgstamt = (sgst / 100) * bill;
    const cgstamt = (cgst / 100) * bill;
    request.session.order.orderbill = Math.ceil(bill + sgstamt + cgstamt);
    response.render(path.join(`${__dirname}/customerbill.ejs`), {
      resturant: resturantName,
      tableno: request.params.tableno,
      order: request.session.order,
      bill: request.session.order.orderbill,
      date: request.session.date,
      sgst,
      cgst,
      sgstamt,
      cgstamt,
      gstin,
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
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    for (const key in request.session.order.orderdetails) {
      if (request.session.order.orderdetails[key]
        && request.session.order.orderdetails[key].qty > 0) {
        const sql = `insert into order_${request.params.fssai} (tableno, item, qty) values (?,?,?)`;
        const vars = [
          request.params.tableno,
          request.session.order.orderdetails[key].name,
          request.session.order.orderdetails[key].qty,
        ];
        const query = con.query({
          sql,
          timeout: 10000,
        }, vars);
        query.on('result', () => {});
      }
    }
    //  mailer.mailOrder(clientMail, message, request.params.tableno);
    request.session.order.orderstatus = 'placed';
    response.render(path.join(`${__dirname}/customerpayment.ejs`), {
      resturant: resturantName,
      tableno: request.params.tableno,
      bill: request.session.order.orderbill,
    });
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.requestbill = async (request, response) => {
  if (request.session.loggedin
      && request.session.tableno === request.params.tableno
      && request.session.fssai === request.params.fssai) {
    request.session.order.orderstatus = 'billed';
    const sql2 = `insert into payment_${request.params.fssai} (orderid, amount, orderdate, tableno) values (?, ?, ?, ?)`;
    const vars2 = [request.session.order.orderid,
      request.session.order.orderbill,
      request.session.order.orderdate,
      request.params.tableno,
    ];
    const query2 = con.query({
      sql: sql2,
      timeout: 10000,
    }, vars2);
    query2.on('result', () => {});
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/end`);
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};
