const path = require('path');

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
  request.session.loggedin = true;
  request.session.tableno = request.params.tableno;
  request.session.resturant = request.params.resturant;
  request.session.order = 0;
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
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/order`);
  response.end();
};

exports.postorder = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    request.session.order += 1;
    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/order`);
  }
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/begin`);
  response.end();
};

exports.pay = async (request, response) => {
  response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/end`);
};
