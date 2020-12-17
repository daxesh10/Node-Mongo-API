var mongoose = require('mongoose');

//create Order Schema
 var OrderModelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    User_ID: String,
    Products: [{
        ProductId: String,
        Name: String,
        Price: Number,
        Quantity: Number
    }],       
});

module.exports = mongoose.model('Orders', OrderModelSchema);
