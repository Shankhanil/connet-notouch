const mysql = require('mysql');

exports.con = mysql.createConnection({
  host: 'connetdb.cbndeljvlxvj.ap-south-1.rds.amazonaws.com',
  user: 'connettech',
  password: 'Shankhanil1998',
  port: 3306,
  database: 'connetdb',
});

exports.sgst = 2.5;
exports.cgst = 2.5;
