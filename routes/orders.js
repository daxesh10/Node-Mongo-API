  
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("./models/order");
var _ = require('underscore');

router.get("/user/:userId", (req, res, next) => {
    const id = req.params.userId;
    Order
    .find({User_ID : id})
    .exec()
    .then(docs => {      
        if (docs.length >= 0) {
      res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.get("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order
    .find({_id : id})
    .exec()
    .then(docs => {      
        if (docs.length >= 0) 
        {
          res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/", (req, res, next) => {
    let productItems =[];
    req.body.products.forEach(element => {
      let productItem = {
        ProductId: element.drugCode,
        Name: element.drugName,
        Price: element.price,
        Quantity: element.quantity,
    };
    productItems.push(productItem);
    });
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        User_ID:  req.body.userId,
        Products: productItems,        
    })
    console.log('creating order', order);
    order
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Handling POST requests to /order",
          createdOrder: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
});


router.get("/", (req, res, next) => {
  Order
  .find()
  .exec()
  .then(docs => {
    console.log(docs);
      if (docs.length >= 0) {
    res.status(200).json(docs);
      } else {
          res.status(404).json({
              message: 'No entries found'
          });
      }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;