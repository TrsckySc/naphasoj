var mongoose = require('mongoose');

var todoSchemas = mongoose.Schema({
    url: String,
    name: String,
    data: mongoose.Schema.Types.Mixed
})

var TodoModal = mongoose.model('Interface', todoSchemas);

module.exports = TodoModal;