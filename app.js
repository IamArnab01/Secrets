
require('dotenv').config(); // to secure all passwrod fields
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const bcrypt = require("bcrypt"); // for salting + hashing ... more security than only hashing... level4
const saltRounds = 10; 

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true ,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

// redirects to home page after logout
app.get("/logout",function(req,res){
  res.redirect("/");
})

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
      email:req.body.email,
      password:hash // assigning the value to generated hash 
    });
   // rendering secrets page once user registered
    newUser.save(function(err){
      if(!err){
        res.render("secrets");
      } else{
        console.log(err);
      }
    });
  })
});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if (err){
      console.log(err);
    }
    else{
         if(foundUser) {
      // checking the password and mathching
         bcrypt.compare(password,foundUser.password,function(err,result){
           if (result === true){
          res.render("secrets");
            }
         });
    }
  } 
  });
});

app.listen(3000,function(){
  console.log("server started at port 3000");
  
});