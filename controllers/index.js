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
router.get('/', (req, res) => {
  var page = fs.readFileSync('./index.html', { encoding: "utf8" });
  res.send(page);
});

// 新增保存接口
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
      reqBody.url = reqBody.prefix + reqBody.path;
      var todoObj = new TodoModal(reqBody);

      todoObj.save((err, todo) => {
        if (err) throw err;
        res.send({
          success: true
        });
      })
    }
  })
});

// 获取接口列表
router.get('/api/get-interface-list', (req, res) => {
  var param = {};
  // 添加接口名称入参
  if (req.query && req.query.name) {
    param.name = { $regex: req.query.name }
  }
  // 添加接口地址入参
  if (req.query && req.query.url) {
    param.url = { $regex: req.query.url }
  }

  TodoModal.find(param, (err, items) => {
    if (err) throw err;
    res.send({
      success: true,
      data: items
    })
  })
});

// 删除接口
router.post('/api/delete-interface', (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  TodoModal.deleteOne({ _id: req.body.id }, (err) => {
    if (err) throw err;
    res.send({
      success: true
    })
  })
});

// 获取单个接口详情
router.post('/api/get-interface-detail', (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  TodoModal.findById(req.body.id, (err, item) => {
    if (err) throw err;
    res.send({
      success: true,
      data: item
    })
  })
});

// 更新单个接口
router.post('/api/update-interface', (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  TodoModal.findById(req.body.id, (err, item) => {
    if (err) throw err;
    item.name = req.body.name;
    item.path = req.body.path;
    item.prefix = req.body.prefix;
    item.url = req.body.prefix + req.body.path;
    item.data = req.body.data;
    item.sourceData = req.body.sourceData;
    item.method = req.body.method;

    item.save((err) => {
      if (err) throw err;
      res.send({
        success: true
      })
    })

  })
});

// 修改接口mock状态
router.post('/api/change-interface-mock-status', (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  TodoModal.findById(req.body.id, (err, item) => {
    if (err) throw err;
    item.isOpen = req.body.isOpen;
    item.save((err) => {
      if (err) throw err;
      res.send({
        success: true
      })
    })
  })
});

module.exports = router;

