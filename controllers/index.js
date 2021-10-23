const express = require('express');
var mail = require('./sendMail');

const router = express.Router();

var mongoose = require('mongoose');

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json({ limit: '50mb' });
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ limit: '50mb', extended: true });

var config = require('../config');

var TodoModal = require('./modal');
var BaseDataModal = require('./baseDataModal');
var prefixModal = require('./prefixModal');

mongoose.connect(config.mongodb, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // console.log('mongodb is connected.')
});

// 新增批量保存接口
router.post('/api/import-interface', jsonParser, (req, res) => {
  let reqBody = req.body;
  const param = [];
  // 去重
  TodoModal.find({}, (err, items) => {
    if (err) throw err;
    reqBody.forEach(data => {
      data.url = data.prefix + data.path;
      data.isLock = false;
      let emp = false;
      items.forEach(item => {
        if (item.url === data.url) {
          emp = true;
        }
      })
      if (!emp) param.push(data);
    })

    TodoModal.insertMany(param, (err, items) => {
      if (err) throw err;
      res.send({
        success: true,
        errorMsg: "",
      })
    })
  })
})

// 新增保存接口
router.post('/api/add-interface', jsonParser, (req, res) => {
  let reqBody = req.body;
  reqBody.url = reqBody.prefix + reqBody.path;
  reqBody.isLock = false;

  // 保证url唯一性
  TodoModal.find({ url: reqBody.url }, (err, item) => {
    if (err) throw err;
    if (JSON.stringify(item) !== "[]") {
      res.send({
        success: false,
        errorMsg: "已经存在的mock地址",
        data: {}
      })
    } else {
      // 存入数据库
      var todoObj = new TodoModal(reqBody);

      todoObj.save((err, todo) => {
        if (err) throw err;
        res.send({
          success: true
        });
      })

      // 发送邮件通知
      mail.send({
        from: `JSHA-邮件小助手<${config.sendMailName}>`,
        to: '1625125333@qq.com,iseebin@dingtalk.com',
        subject: 'JSHA接口挡板工程 - 新接口通知',
        text: `新增接口通知\n接口名称：${reqBody.name}\n接口地址：${reqBody.url} \n设计人员已将你添加为收件人，如果是你开发者，请及时关注接口状态。`,
        // html: '<b>Hello world, I am a test mail!</b>'
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

  if (!req.query.page) req.query.page = 1;
  if (!req.query.rows) req.query.rows = 5;

  TodoModal.find(param, (err, items) => {
    if (err) throw err;
    var total = items.length;
    var pages = Math.ceil(total / req.query.rows);
    TodoModal.find(param)
      .skip((req.query.page - 1) * req.query.rows)
      .limit(req.query.rows * 1)
      .exec((err, items) => {
        if (err) throw err;

        res.send({
          success: true,
          data: {
            pages: pages,
            total: total,
            page: req.query.page,
            rows: req.query.rows,
            list: items
          }
        })
      });
  })
});

// 删除接口
router.post('/api/delete-interface', jsonParser, (req, res) => {
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

// 清空接口
router.get('/api/delete-all-interface', jsonParser, (req, res) => {
  TodoModal.deleteMany({ isLock: false }, (err) => {
    if (err) throw err;
    res.send({
      success: true
    })
  })
});

// 获取单个接口详情
router.post('/api/get-interface-detail', jsonParser, (req, res) => {
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
router.post('/api/update-interface', jsonParser, (req, res) => {
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
router.post('/api/change-interface-mock-status', jsonParser, (req, res) => {
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

// 修改接口锁状态
router.post('/api/change-interface-lock-status', jsonParser, (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  if (req.body.isLock === undefined || req.body.isLock === null || typeof req.body.isLock !== 'boolean') {
    res.send({
      success: false,
      errorMsg: "参数isLock未传或数据类型错误 应为boolean类型"
    })
  }
  TodoModal.findById(req.body.id, (err, item) => {
    if (err) throw err;
    item.isLock = req.body.isLock;
    item.save((err) => {
      if (err) throw err;
      res.send({
        success: true
      })
    })
  })
});

// 查询所有基础数据
router.get('/api/get-base-list', (req, res) => {
  BaseDataModal.find({}, (err, items) => {
    if (err) throw err;
    res.send({
      success: true,
      data: items
    })
  })
})

// 更新单个基础数据
router.post('/api/update-base-data', jsonParser, (req, res) => {
  if (!req.body.id) {
    // 置为新增
    var todoObj = new BaseDataModal(req.body);

    todoObj.save((err, todo) => {
      if (err) throw err;
      res.send({
        success: true
      });
    })
  } else {
    // 更新数据
    BaseDataModal.findById(req.body.id, (err, item) => {
      if (err) throw err;
      item.aceData = req.body.aceData;
      item.data = req.body.data;

      item.save((err) => {
        if (err) throw err;
        res.send({
          success: true
        })
      })

    })
  }

});

// 查询单个基础数据
router.post('/api/get-base-data-by-id', jsonParser, (req, res) => {
  if (!req.body || !req.body.id) {
    res.send({
      success: false,
      errorMsg: "缺少接口id"
    })
  }
  BaseDataModal.findById(req.body.id, (err, item) => {
    if (err) throw err;
    res.send({
      success: true,
      data: item
    })
  })
});

// 查询前缀数据
router.get('/api/get-prefix-list', (req, res) => {
  prefixModal.find({}, (err, items) => {
    if (err) throw err;
    res.send({
      success: true,
      data: items
    })
  })
})

// 新增前缀数据保存
router.post('/api/add-prefix', jsonParser, (req, res) => {
  let reqBody = req.body;

  // 保证url唯一性
  prefixModal.find({ code: reqBody.code }, (err, item) => {
    if (err) throw err;
    if (JSON.stringify(item) !== "[]") {
      res.send({
        success: false,
        errorMsg: "已经存在的前缀",
        data: {}
      })
    } else {
      // 存入数据库
      var prefixObj = new prefixModal(reqBody);

      prefixObj.save((err, todo) => {
        if (err) throw err;
        res.send({
          success: true
        });
      })
    }
  })
});

// 删除前缀数据
router.post('/api/delete-prefix', jsonParser, (req, res) => {
  if (!req.body || !req.body.code) {
    res.send({
      success: false,
      errorMsg: "缺少前缀code"
    })
  }
  prefixModal.deleteOne({ code: req.body.code }, (err) => {
    if (err) throw err;
    res.send({
      success: true
    })
  })
});

module.exports = router;

