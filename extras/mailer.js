const nodemailer = require('nodemailer');

exports.mailClient = function mailClient(clientMail) {
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
    subject: 'Client registration mail from Connet',
    text: 'Tune maari entry aur dil me baji ghanti aurrr teng teng teng teng',
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // do somethingggggg
    }
  });
};
