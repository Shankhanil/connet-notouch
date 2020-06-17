const nodemailer = require('nodemailer');

exports.mailClient = function mailClient(clientMail, { fssaiCode, password }) {
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
    subject: 'Congratulations on Registering with Connet',
    text: `Your login ID is ${fssaiCode}\nAnd your password is ${password}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // do somethingggggg
    }
  });
};
