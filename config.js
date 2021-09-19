module.exports = {
  // 测试环境代理转发地址
  target: 'http://12.168.3.15:80',
  // mongodb链接地址
  mongodb: 'mongodb://localhost/myapp',
  // 是否开启邮件通知
  isSendMail: false,
  // 邮箱SMTP服务器地址
  provideMail: 'smtp.qq.com',
  // 发送邮箱地址(需要邮箱设置开启SMTP服务)
  sendMailName: '656487723@qq.com',
  // 邮箱密码/授权码
  sendMailpass: "xxxxxxxx",
}