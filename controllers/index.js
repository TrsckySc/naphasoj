const express = require('express');
var fs = require('fs');

const router = express.Router();

var mongoose = require('mongoose');

var ejs = require('ejs');

var TodoModal = require('./modal');

mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongodb is connected.')
});

// 客户端页面
router.get('/',(req,res)=>{
    var page = fs.readFileSync('./index.html',{encoding:"utf8"});
    res.send(page);
})

// 保存接口
router.post('/api/add-interface', (req, res) => {

    // 保证url唯一性
    TodoModal.find({ url: req.body.url }, (err, item) => {
        if (err) throw err;
        if (JSON.stringify(item) !== "[]") {
            res.send({
                success: false,
                errorMsg: "已经存在的mock地址",
                data: {}
            })
        } else {
            // 存入数据库
            let reqBody = req.body;
            var todoObj = new TodoModal(reqBody);

            todoObj.save((err, todo) => {
                if (err) {
                    // res.send('this is saved for success.');
                    throw err;
                };
                res.send({
                    success: true
                });
            })
        }

    })

})

// 获取接口列表
router.get('/api/get-interface-list', (req, res) => {
    
    TodoModal.find(req.query,(err, items) => {
        if (err) throw err;
        res.send({
            success: true,
            data: items
        })
    })
})

module.exports = router;

