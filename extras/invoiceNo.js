exports.invoiceNo = function invoiceNO() {
    const length = Math.random() * (12 - 8) + 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; i += 1) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };