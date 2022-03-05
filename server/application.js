var express = require("express");
const httpProxy = require("http-proxy");
const path = require("path");
const request = require("request");

var router = require("./controllers/index");

var TodoModal = require("./modal/modal");
var ConfigModal = require("./modal/configModal");

var config = require("../config");

var app = new express();

app.use("/mock", express.static(path.join(__dirname, "../client/build")));

app.use(router);

app.use((req, res, next) => {
  ConfigModal.find({}, (err, item) => {
    if (err) throw err;
    var data = item[0] || {};

    req.target = data.target;
    req.changeOrigin = !!data.changeOrigin;
    if (data.mock) {
      // 拿到地址，去数据库中查询，如果没有则用axios调用接口，否则返回数据库里面的mock数据字段
      TodoModal.find({ url: req.path }, (err, item) => {
        if (err) throw err;
        // 查询到数据并且开启了mock状态，则返回mock数据
        if (JSON.stringify(item) !== "[]" && item[0].isOpen) {
          const itemData = item[0];
          if (itemData.source === 1 || itemData.source === 4) {
            // 自建接口 或开发者工具添加的接口
            setTimeout(() => {
              res.send(itemData.data);
            }, data.delay);
            return;
          } else {
            // 第三方接口
            if (itemData.method === "GET") {
              // get
              request(itemData.threeDataUrl, (error, response, threeData) => {
                if (!error && response.statusCode == 200) {
                  try {
                    JSON.parse(threeData);
                    res.send(threeData);
                  } catch (e) {
                    res.send({
                      success: false,
                      errorMsg: "非JSON数据, 请检查三方平台响应数据是否正确",
                      threeData,
                    });
                  }
                } else {
                  res.send({
                    success: false,
                    errorMsg: error,
                  });
                }
              });
            } else if (itemData.method === "POST") {
              // post
              request(
                {
                  url: itemData.threeDataUrl,
                  method: "POST",
                  json: true,
                  headers: {
                    "content-type": "application/json",
                  },
                  body: req,
                },
                (error, response, threeData) => {
                  if (!error && response.statusCode == 200) {
                    try {
                      JSON.parse(threeData);
                      res.send(threeData);
                    } catch (e) {
                      res.send({
                        success: false,
                        errorMsg: "非JSON数据, 请检查三方平台响应数据是否正确",
                        threeData,
                      });
                    }
                  } else {
                    res.send({
                      success: false,
                      errorMsg: error,
                    });
                  }
                }
              );
            } else {
              // 非get post 请求临时做代理转发
              next();
            }
          }
        }
        // 否则做代理转发
        next();
      });
    } else {
      // 否则做代理转发
      next();
    }
  });
});

// 非挡板接口代理到目标环境
app.use(function (req, res) {
  // if (!req.target) {
  //   res.writeHead(500, {
  //     "Content-Type": "text/plain;charset=UTF-8",
  //   });
  //   res
  //     .status(500)
  //     .end(
  //       `未设置项目代理地址, 请先进入 http://127.0.0.1:${config.port}/config.html 去设置代理地址!`
  //     );
  //   return;
  // }
  //创建代理对象
  var proxy = httpProxy.createProxyServer({
    //代理地址为http时
    target: req.target || "http://12.168.3.15",
    //是否需要改变原始主机头为目标URL
    changeOrigin: req.changeOrigin,
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
  proxy.on("error", function (err, request, response) {
    response.writeHead(500, {
      "Content-Type": "text/plain",
    });
    response.status(500).end("服务器异常！");
  });
  proxy.web(req, res);
  return;
});

app.listen(config.port, () => {
  console.log(
    `service is started. listen to ${config.port} port. open the following address in the browser.\n  http://127.0.0.1:${config.port}/mock`
  );
});
