var mongoose = require('mongoose');

var todoSchemas = mongoose.Schema({
  url: String,                        // 接口地址
  name: String,                       // 接口名称
  data: mongoose.Schema.Types.Mixed,  // 接口响应数据
  sourceData: String,                 // json5源代码
  isOpen: Boolean,                    // mock状态 true为开启mock
});

var TodoModal = mongoose.model('Interface', todoSchemas);

module.exports = TodoModal;