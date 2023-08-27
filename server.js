const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
const  fs = require("fs");
app.use(cors());
app.use(express.json());
const controller = require("./db");

let jwtBearerToken;

const RSA_PUBLIC_KEY = fs.readFileSync('./privateKey.key');
const RSA_PRIVATE_KEY = fs.readFileSync('./privateKey.key');

  function checkIfAuthenticated () {
    try{
const verified = jwt.verify(jwtBearerToken, RSA_PUBLIC_KEY);
console.log('user auth status is :: ',verified);
if(verified){
    //return res.send("Successfully Verified");
    console.log('user authenticated :: ');
}else{
    // Access Denied
   // return res.status(401).send(error);
   console.log('user not authenticated :: ');
}
 }
catch(error){
  console.log('error is ',error)
}
  }


app.route('/getStudentDetails')
    .get(checkIfAuthenticated, getAllUser);


     function getAllUser(){
      console.log('all user loaded');
    }

try {
  app.post("/validateUserDetails", (req, res) => {
    console.log("req payload is ::  ", req.body);
    controller.query(
      "SELECT * FROM user where username = ? AND password = ?",
      [req.body.userName, req.body.password],
      function(err, data, fields) {
        if (err) return err;
        console.log('data is ',data.length);
        if(data.length > 0){
          const userId = req.body.userName;
          jwtBearerToken = jwt.sign({},RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn:10,
          subject: userId
  });
          res.status(200).json({
            status: "success",
            data: {
              "isAuthenticatedUser": true,
              "authToken": jwtBearerToken,
            }
          });   
        }else{
         res.status(200).json({
          status: "fail",
          data: {
            "isAuthenticatedUser":false,
          }
        });
      }
      }
    );
  });
} catch (e) {
  console.log("error is : ", e);
}

try {
  app.post("/getUserToken", (req, res) => {
    console.log("*** req payload is ****::  ", req.body);
    const userId = req.body.username;
     jwtBearerToken = jwt.sign({},RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn:10,
      subject: userId
  });

  // return new user
  res.status(200).json({
     status:"success",
     token :jwtBearerToken
    });
  });
} catch (e) {
  console.log("error is : ", e);
}
 app.use(express.static('angulardemoapp'))

app.get("/",(req,res)=>{
    res.send('</h2>node js is running<h2>');
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
