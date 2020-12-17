  
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("./models/user");
var fs = require('fs'); 
var parse = require('csv-parse');
var _ = require('underscore');
const { encrypt } = require('./crypto');




User.find()
.exec()
.then(docs => {
  if(_.isEmpty(docs)){            
    var csvData=[];
    const userList = [];   
    fs.createReadStream('./public/eComchain_Mock_Data.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {           
            csvData.push(csvrow);        
    })
    .on('end',function() {                    
        _.map(csvData,(rowData , index)=>
        {                
                if(index > 0 && rowData){   
                  const hash = encrypt(rowData[3]);                
                  const user = {
                    _id: new mongoose.Types.ObjectId(),
                    First_Name: rowData[0],
                    Last_Name: rowData[1],
                    Email: rowData[2].trim(),
                    Password: {
                      iv:  hash.iv,
                      content:  hash.content,
                    },
                    Gender: rowData[4],
                    Phone_Number: rowData[5],
                    Credit_Card_Number: rowData[6],
                    };
                    userList.push(user);                                    
                };
            });  
            User.collection.insert(userList , (err, docs)=>{
              if (err) {
                // TODO: handle error
                console.info('users handle error from csv.', err);
            } else {
                console.info('users were successfully added from csv.', docs.length);
            }
            })  
            
      });
         
  };  
})
.catch(error => {
  console.log('error',error); 
});



router.get("/", (req, res, next) => {
    User
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


router.post("/", (req, res, next) => {
  const hash = encrypt(req.body.password); 
  console.log('creating user', req.body);
  const user = new User({
   _id: new mongoose.Types.ObjectId(),
    First_Name: req.body.firstName,
    Last_Name: req.body.lastName,
    Email: req.body.email,
    Password: {
      iv:  hash.iv,
      content:  hash.content,
    },
    Gender: req.body.gender,
    Phone_Number: req.body.phoneNumber,
    Credit_Card_Number: req.body.cardNumber,
  });
  console.log('creating user', user);
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /users",
        createdUser: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User
    .findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/:userId", (req, res, next) => {
  const id = req.params.userId;  
  const hash = encrypt(req.body.password); 
  const updateUserPayload = new User({
    _id: id,
     First_Name: req.body.firstName,
     Last_Name: req.body.lastName,
     Email: req.body.email,
     Password: {
      iv:  hash.iv,
      content:  hash.content,
    },
     Gender: req.body.gender,
     Phone_Number: req.body.phoneNumber,
     Credit_Card_Number: req.body.cardNumber,
   });
  console.log('patch', updateUserPayload);
  User
    .update({ _id: id }, { $set: updateUserPayload })
    .exec()
    .then(result => {
      console.log('router.patch' , result);
      res.status(200).json({
        message: "Handling POST requests to /users",
        updatedUser: updateUserPayload
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