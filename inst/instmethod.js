const path = require('path');
const mysql = require('mysql');
const mailer = require('../extras/mailer');
const passwordGen = require('../extras/passwordGen');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'connetdb',
});

exports.authget = async (request, response) => {
  response.sendFile(path.join(`${__dirname}/instLogin.html`));
};
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
    con.connect((err) => {
      if (err) throw err;
      const sql = 'INSERT INTO CLIENT (fssai, name, email, phone, password) VALUES (?, ?, ?, ?, ?)';
      con.query(sql, [fssaiCode, resturantName, email, phoneNumber, password], (_err) => {
        if (_err) throw _err;
        //    console.log("1 record inserted");
        mailer.mailClient(email, { fssaiCode, password }, true);
//        response.send(`${fssaiCode}, ${resturantName}, ${email}, ${phoneNumber}, ${password} Client details`);
          response.redirect('/inst/insthome');
      });
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
    mailer.mailClient(email, { fssaiCode, password }, false);
    response.send('New password emailed');
  } else {
    response.redirect('/inst/instauth');
    response.end();
  }
};
