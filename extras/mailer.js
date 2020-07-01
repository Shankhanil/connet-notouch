const nodemailer = require('nodemailer');

exports.mailClient = function mailClient(clientMail, { fssaiCode, password }, isNew) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shankha.rik@gmail.com',
      pass: 'mdxxyfackltvslpg',
    },
  });
  const newMail = `Thank you for registering with Connet. Your login ID is ${fssaiCode}\nAnd your password is ${password}. Please keep the password handy.`;
  const regenMail = `Your password has been regenerated. Your login ID is ${fssaiCode}\nAnd your password is ${password}. Please keep the password handy`;
  const newSub = 'Congratulations on Registering with Connet';
  const regenSub = 'Your password has been regenerated';

  let mailOptions = {};

  if (isNew === true) {
    mailOptions = {
      from: 'shankha.rik@gmail.com',
      to: clientMail,
      subject: newSub,
      text: newMail,
    };
  } else {
    mailOptions = {
      from: 'shankha.rik@gmail.com',
      to: clientMail,
      subject: regenSub,
      text: regenMail,
    };
  }

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // do somethingggggg
    }
  });
};

exports.mailOrder = function mailOrder(clientMail, order, tableno) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shankha.rik@gmail.com',
      pass: 'mdxxyfackltvslpg',
    },
  });
  const mailOptions = {
    from: 'shankha.rik@gmail.com',
    to: clientMail,
    subject: `Order from table ${tableno}`,
    text: order,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // do somethingggggg
    }
  });
};

exports.mailBill = function mailBill(clientMail, message, tableno) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shankha.rik@gmail.com',
      pass: 'mdxxyfackltvslpg',
    },
  });
  const mailOptions = {
    from: 'shankha.rik@gmail.com',
    to: clientMail,
    subject: `Bill for table ${tableno}`,
    text: message,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // do somethingggggg
    }
  });
};
