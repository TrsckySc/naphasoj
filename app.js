var express = require('express');
const httpProxy = require('http-proxy');

var router = require('./controllers/index');

var TodoModal = require('./controllers/modal');

var config = require('./config');

var app = new express();

app.use('/mock', express.static('client'));


app.use(router);

//创建代理对象
let proxy = httpProxy.createProxyServer({
  //代理地址为http时
  target: config.target,
  //是否需要改变原始主机头为目标URL
  changeOrigin: true,
  // 重写cookie的作用域
  // cookieDomainRewrite: {
  //   '*': 'dev.yilihuo.com'
  // }

  // 当地址为https时加上秘钥和
  // ssl: {
  //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
  //     cert: fs.readFileSync('server.crt', 'utf8')
  // },
  // if you want to verify the SSL Certs
  // secure: false
});
//配置错误处理
proxy.on('error', function (err, request, response) {
  response.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  response.status(500).end('服务器异常！');
});

app.use((req, res, next) => {
  // 拿到地址，去数据库中查询，如果没有则用axios调用接口，否则返回数据库里面的mock数据字段
  TodoModal.find({ url: req.path }, (err, item) => {
    if (err) throw err;
    // 查询到数据并且开启了mock状态，则返回mock数据
    if (JSON.stringify(item) !== "[]" && item[0].isOpen) {
      setTimeout(()=>{
        res.send(item[0].data);
      }, config.delay)
      return;
    }
    // 否则做代理转发
    next();
  })
});

// 非挡板接口代理到目标环境
app.use(function (req, res) {
  proxy.web(req, res);
  return;
})

app.listen(3004, () => {
  console.log('service is started. listen to 3004 port. open the following address in the browser.\n  http://127.0.0.1:3004/mock');
});