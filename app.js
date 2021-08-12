var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var request = require('request');

var router = require('./controllers/index');

var TodoModal = require('./controllers/modal');

var app = new express();

app.set('view engine', 'ejs');

app.use(express.static('./client'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);

app.use((req, res, next) => {
  // 拿到地址，去数据库中查询，如果没有则用axios调用接口，否则返回数据库里面的mock数据字段
  TodoModal.find({ url: req.path }, (err, item) => {
    if (err) throw err;
    // 查询到数据并且开启了mock状态，则返回mock数据
    if (JSON.stringify(item) !== "[]" && item[0].data.isOpen) {
      res.send({
        success: true,
        data: item[0].data
      });
      return;
    }

    // 否则做接口转发
    if (req.url.indexOf('/lib/') >= 0 || req.url.indexOf('/favicon') >= 0) {
      // 针对map文件与favicon文件做了下错误终止
      axios.get(req.url)
        .then(function (response) {
          res.send(response);
        })
        .catch(function (error) {
          res.status(404).end();
        });
    } else if (req.method == "GET") {
      const resp = axios({
        method: "get",
        url: "http://12.168.3.34:8001" + req.url,
        headers: req.headers
      });
      resp.then((response) => {
        res.send(response.data)
      })
    } else if (req.method == "POST") {
      const resp = axios({
        method: "post",
        url: "http://12.168.3.34:8001" + req.url,
        headers: req.headers,
        data: req.body
      });
      resp.then((response) => {
        res.send(response.data)
      })
    } else {
      res.send('error');
    }
  })
});

app.listen(3004, () => {
  console.log('service started.listen to 3004 port.')
});