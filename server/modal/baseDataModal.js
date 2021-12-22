var mongoose = require('mongoose');
// 基础数据
var baseDataSchemas = mongoose.Schema({
  name: String,                       // 基础数据名称
  data: Object,                       // 基础数据
  aceData: String,                    // ace源数据
  type: String,                       // 基础数据类型
}, { minimize: false });

var BaseDataModal = mongoose.model('baseData', baseDataSchemas);

module.exports = BaseDataModal;