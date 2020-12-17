  
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
var fs = require('fs'); 
var parse = require('csv-parse');
var _ = require('underscore');

Product.find()
.exec()
.then(docs => {
  if(_.isEmpty(docs)){
    var csvData=[];
    fs.createReadStream('./public/eComchain_Mock_Data.csv')
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {           
            csvData.push(csvrow);        
        })
        .on('end',function() {
            const productList = [];
            _.map(csvData,(rowData , index)=>{
                if(index > 0 && rowData){                  
                    const product = {
                      _id: new mongoose.Types.ObjectId(),   
                      Drug_Name: rowData[7],
                      Drug_Company: rowData[8],                      
                      Price: parseInt(rowData[9]),
                      Image: rowData[10],
                      Stocks: parseInt(rowData[11]),
                      Drug_Code: rowData[12],
                    };
                    productList.push(product);                  
                };
            });                
            Product.collection.insert(productList , (err, docs)=>{
              if (err) {
                // TODO: handle error
            } else {
                console.info('products were successfully added from csv.', docs.length);
            }
            })        
        });
        };  
})
.catch(error => {
  console.log('error',error); 
});



router.get("/", (req, res, next) => {
  Product.find()
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


router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),   
    Drug_Name:  req.body.name,
    Drug_Company:  req.body.company,
    Drug_Code:  req.body.code,
    Price:  req.body.price,
    Image:  req.body.imageUrl,
    Stocks:  req.body.stocks,
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;