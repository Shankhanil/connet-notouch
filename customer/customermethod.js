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
    let sql = 'Select name from client where fssai=?';
    const vars = [request.params.fssai];
    let query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('result', (result) => {
    //    menu.push(result);
      resturantName = result.name;
      //      if (menu.length === 0) {
      sql = `Select foodName, price, qty from menu_basic_${request.params.fssai} where acive=1`;
      query = con.query({
        sql,
        timeout: 10000,
      });

      query.on('result', (res) => {
        menu.push(res);
      });
      //      }
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
  response.render(path.join(`${__dirname}/customermenu.ejs`), {
    resturant: resturantName, tableno: request.params.tableno, order: request.session.order, menu,
  });
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
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/order`);
    response.end();
    //      console.log(request.session.order);
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};

exports.generatebill = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.fssai === request.params.fssai) {
    let bill = 0;
    for (const key in Object.keys(request.session.order.orderdetails)) {
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
    if (request.session.order.orderdetails[`${index}`] != null) {
      request.session.order.orderdetails[`${index}`].qty -= 1;
    }
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/menu`);
    response.end();
  } else {
    response.redirect(`/customer/${request.params.fssai}/${request.params.tableno}/begin`);
    response.end();
  }
};
