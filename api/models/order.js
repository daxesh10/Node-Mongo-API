var mongoose = require('mongoose');

//create Order Schema
 var OrderModelSchema = new MonogDB_Schema({
    User_ID: String,
    Orders: [Number],       
});

module.exports = mongoose.model('Orders', OrderModelSchema);
