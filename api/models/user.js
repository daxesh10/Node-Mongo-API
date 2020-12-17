var mongoose = require('mongoose');

//create Product Schema
var UserModelSchema = mongoose.Schema({
    First_Name: String,
    Last_Name: String,
    Email: String,
    Password: {
        iv:  String,
        content:  String,
    },
    Gender: String,
    Phone_Number: String,
    Credit_Card_Number: String,
});

module.exports = mongoose.model('Users', UserModelSchema);
