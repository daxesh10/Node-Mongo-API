let express = require('express');
let router = express.Router();
var _ = require('underscore');
const User = require("../models/user");
const { decrypt } = require('./crypto');



router.post("/login", (req, res, next) => { 
    const email = req.body.email;
    const password = req.body.password;    
    User
      .find({Email : email})
      .exec()
      .then(doc => {
        const data = _.first(doc);
        if(!_.isEmpty(data)){
            const text = decrypt(data.Password);           
            if(_.isEqual(text, password)){
                res.status(200).json({user : data});
            }else{
                res
                .status(404)
                .json({ message: "Invalid Password" });
            }
        }else{
                 res
                .status(404)
                .json({ message: "Invalid Email" });
        };    
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
})

module.exports = router;