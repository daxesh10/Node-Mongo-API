var mongoose = require('mongoose');

//create Product Schema
var ProductModelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Drug_Name: String,
    Drug_Company: String,
    Drug_Code: String,
    Price: Number,
    Image: String,
    Stocks: Number,        
});

module.exports = mongoose.model('Products', ProductModelSchema);
