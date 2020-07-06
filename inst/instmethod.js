const path = require('path');
const config = require('../config');
const mailer = require('../extras/mailer');
const passwordGen = require('../extras/passwordGen');

const { con } = config;

exports.authpost = async (request, response) => {
  const { password } = request.body;
  if (password === '21232f297a57a5a743894a0e4a801fc3') {
    request.session.loggedin = true;
    request.session.username = 'admin';
    response.redirect('/inst/insthome');
  } else {
    response.send('Incorrect Username and/or Password!');
  }
  response.end();
};

exports.insthome = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/insthome.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.new = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/clientinstaller.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.registerClient = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    const {
      fssaiCode, resturantName, gst, email, phoneNumber,
    } = request.body;
    const password = passwordGen.generatePassword(fssaiCode);

    const sql = 'INSERT INTO client (fssai, name, gst, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
    const vars = [fssaiCode, resturantName, gst, email, phoneNumber, password];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('error', (err) => {
      if (err) {
        response.send(`Error:${err}`);
      }
    });

    query.on('result', () => {
      const createTableSQL = `CREATE TABLE menu_basic_${fssaiCode} (foodID integer AUTO_INCREMENT, foodName varchar(100) not NULL, qty varchar (10), isVeg varchar(7) default 'non veg', price integer not NULL, category varchar(30), acive bool not null default 1, primary key(foodID))`;
      const createOrderSQL = `CREATE TABLE IF NOT EXISTS order_${fssaiCode} ( tableno int(11) DEFAULT NULL, item varchar(100) DEFAULT NULL, qty int(11) DEFAULT NULL, active tinyint(1) DEFAULT '0')`;
      const createPaymentSQL = `CREATE TABLE IF NOT EXISTS payment_${fssaiCode} ( orderID int(11) not NULL, amount int(11) not NULL, isbilled tinyint(1) DEFAULT '0', tableno int not null)`;
      const query2 = con.query({
        sql: createTableSQL,
        timeout: 10000,
      });
      query2.on('result', () => {
        response.redirect('/inst/insthome');
        mailer.mailClient(email, { fssaiCode, password }, true);
      });
      query2.on('error', (error) => {
        response.send(error.toString());
      });
      const query3 = con.query({
        sql: createOrderSQL,
        timeout: 10000,
      });
      const query4 = con.query({
        sql: createPaymentSQL,
        timeout: 10000,
      });
      query3.on('result', () => {});
      query4.on('result', () => {});
    });
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.regenPasswordCall = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/clientregen.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.regenPassword = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    const {
      fssaiCode, email,
    } = request.body;
    const password = passwordGen.generatePassword(fssaiCode);
    const sql = 'UPDATE client SET password = ? WHERE fssai=?';
    const vars = [password, fssaiCode];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);

    query.on('error', (err) => {
      if (err) {
        response.send(`Error:${err}`);
      }
    });
    query.on('result', () => {
      mailer.mailClient(email, { fssaiCode, password }, true);
      response.redirect('/inst/insthome');
    });

    query.on('end', () => {
      //      con.release();
    });
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.addmenu = async (request, response) => {
  let vars;
  if (request.session.loggedin && request.session.username === 'admin') {
    const { fssai } = request.params;
    const sql = 'SELECT name FROM client where fssai=?';
    vars = [fssai];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);
    const { foodName, foodPrice } = request.body;
    let {
      isVeg, qty,
    } = request.body;
    if (!isVeg) {
      isVeg = 'non veg';
    }
    if (!qty) {
      qty = '';
    }
    query.on('result', (result) => {
      if (foodName) {
        const addMenuSQL = `INSERT INTO menu_basic_${fssai} (foodName, qty, isVeg, price) VALUES (?,?, ?, ?)`;
        vars = [foodName, qty, isVeg, foodPrice];

        const query2 = con.query({
          sql: addMenuSQL,
          timeout: 10000,
        }, vars);
        //        query2.on('result', () => {
        //        });
        query2.on('error', (error) => {
          response.send(error.toString());
        });
      }
      response.render(path.join(`${__dirname}/menuadder.ejs`), { resturant: result.name });
    });
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};

exports.fssaiauth = async (request, response) => {
  if (request.session.loggedin && request.session.username === 'admin') {
    response.render(path.join(`${__dirname}/fssaiauth.ejs`));
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
exports.finish = async (request, response) => {
  let vars;
  if (request.session.loggedin && request.session.username === 'admin') {
    const { fssai } = request.params;
    const sql = 'SELECT name FROM client where fssai=?';
    vars = [fssai];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);
    const { foodName, foodPrice } = request.body;
    let {
      isVeg, qty,
    } = request.body;
    if (!isVeg) {
      isVeg = 'non veg';
    }
    if (!qty) {
      qty = '';
    }
    query.on('result', () => {
      if (foodName) {
        const addMenuSQL = `INSERT INTO menu_basic_${fssai} (foodName, qty, isVeg, price) VALUES (?,?, ?, ?)`;
        vars = [foodName, qty, isVeg, foodPrice];

        const query2 = con.query({
          sql: addMenuSQL,
          timeout: 10000,
        }, vars);
        //        query2.on('result', () => {
        //        });
        query2.on('error', (error) => {
          response.send(error.toString());
        });
      }
      response.redirect('/inst/insthome');
    });
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
