var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var request = require('request');

var router = require('./controllers/index');

var TodoModal = require('./controllers/modal');

var app = new express();

app.set('view engine','ejs');

app.use(express.static('./client'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router);

app.use((req, res, next) => {
    // 拿到地址，去数据库中查询，如果没有则用axios调用接口，否则返回数据库里面的mock数据字段
    TodoModal.find({ url: req.path }, (err, item) => {
        if (err) throw err;
        if (JSON.stringify(item) !== "[]") {
            console.log('return mock')
            res.send({
                success: true,
                data: item[0].data
            })
        } else {
            if (req.method == "GET") {
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

            // if (req.method == "GET") {
            //     console.log('get request.')
            //     var opt = {
            //         url:'https://12.168.3.34:8001'+req.url,
            //         method:'get',
            //         headers:req.headers
            //     }
            //     request(opt,function(error, response, body){
            //         res.send(body);
            //     })
            // } else if (req.method == "POST") {
            //     console.log('req.body',req.body)
            //     var opt = {
            //         url:'https://12.168.3.34:8001'+req.url,
            //         method:'post',
            //         headers:req.headers,
            //         data:JSON.stringify(req.body)
            //     }
            //     request(opt,function(error, response, body){
            //         console.log('>>>response',response);
            //         console.log('>>>body',body);
            //         res.send(body);
            //     })
            // } else {
            //     res.send('error')
            // }
        }

    })
})

app.listen(3004, () => {
    console.log('service started.listen to 3004 port.')
})