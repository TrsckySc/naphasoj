var nodemailer = require('nodemailer');
var config = require('../config');

var mail = {
  send: function (options) {
    if (!config.isSendMail) return;
    // 发送邮件
    var transport = nodemailer.createTransport(`smtps://${config.sendMailName}:${config.sendMailpass}@${config.provideMail}`);
    transport.sendMail(options, function (err, res) {
      if (err) throw err;
      transport.close(); // 如果没用，关闭连接池
    });
  }
}

module.exports = mail;