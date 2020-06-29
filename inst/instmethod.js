const path = require('path');
const db = require('../dbconfig');
const mailer = require('../extras/mailer');
const passwordGen = require('../extras/passwordGen');

const { con } = db;

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
      fssaiCode, resturantName, email, phoneNumber,
    } = request.body;
    const password = passwordGen.generatePassword(fssaiCode);

    const sql = 'INSERT INTO CLIENT (fssai, name, email, phone, password) VALUES (?, ?, ?, ?, ?)';
    const vars = [fssaiCode, resturantName, email, phoneNumber, password];
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
      const createTableSQL = `CREATE TABLE menu_basic_${fssaiCode} (foodID integer AUTO_INCREMENT, foodName varchar(100) not NULL, qty varchar (10), isVeg varchar(7) default 'non veg', price integer not NULL, acive bool not null default 1, primary key(foodID))`;
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
    });

    query.on('end', () => {
      //      con.release();
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
    const sql = 'UPDATE CLIENT SET password = ? WHERE fssai=?';
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
    const sql = 'SELECT name FROM Client where fssai=?';
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
  if (request.session.loggedin && request.session.username === 'admin') {
    const { fssai } = request.params;
    const sql = 'SELECT name FROM Client where fssai=?';
    const vars = [fssai];
    const query = con.query({
      sql,
      timeout: 10000,
    }, vars);
    query.on('result', () => {
      response.redirect('/inst/insthome');
    });
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
