module.exports = {
  // dev4测试环境代理转发地址
  // target: 'http://dev4.ylhtest.com',
  // dev测试环境代理转发地址
  target: 'http://12.168.3.15:80',

  // mongodb链接地址-docker版
  mongodb: 'mongodb://database/myapp',
  // mongodb链接地址-本地版
  // mongodb: 'mongodb://localhost/myapp',
  
  // 是否开启邮件通知
  isSendMail: false,
  // 邮箱SMTP服务器地址
  provideMail: 'smtp.qq.com',
  // 发送邮箱地址(需要邮箱设置开启SMTP服务)
  sendMailName: '656487723@qq.com',
  // 邮箱密码/授权码
  sendMailpass: "xxxxxxxx",
}