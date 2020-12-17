const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoute = require("./routes/users");
const indexRoute = require("./routes/index");
let taskRoute =  require("./routes/tasks.js");
let productRoute =  require("./routes/products.js");
let orderRoute = require('./routes/orders.js');

let env = {
    "MONGO_ATLAS_User": "test",
    "MONGO_ATLAS_Password": "test",
    "MONGO_ATLAS_DB_Name": "Users_DB",
    "Salt":10
};
let dbUrl = 'mongodb+srv://'+ env.MONGO_ATLAS_User + ':' + env.MONGO_ATLAS_Password+ '@cluster0.fvzf9.mongodb.net/'+ env.MONGO_ATLAS_DB_Name +'?retryWrites=true&w=majority'

mongoose.connect(dbUrl , {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/", indexRoute);
app.use("/api", taskRoute);
app.use("/api/user", usersRoute);
app.use("/api/product", productRoute);
app.use('/api/order',orderRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;