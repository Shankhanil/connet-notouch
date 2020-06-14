// const path = require('path');

exports.begin = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.redirect(`/customer/${request.params.resturant}/${request.params.tableno}/status`);
  }
  request.session.loggedin = true;
  request.session.tableno = request.params.tableno;
  request.session.resturant = request.params.resturant;
  response.send(`Welcome,${request.session.tableno}You began your dining at ${request.session.resturant}`);
  response.end();
};

exports.status = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    response.send(`You are currently dining at ${request.session.resturant} at ${request.session.tableno} table`);
  } else {
    response.send('NO SESSION ACTIVE');
  }
  response.end();
};

exports.end = async (request, response) => {
  // eslint-disable-next-line max-len
  if (request.session.loggedin && request.session.tableno === request.params.tableno && request.session.resturant === request.params.resturant) {
    request.session.destroy();
    response.send('the table is freed');
  } else {
    response.send('NO SESSION ACTIVE');
  }
  response.end();
};
