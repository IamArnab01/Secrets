require('dotenv').config(); // to secure all passwrod fields
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true ,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});
// ------ for encryption of password-----
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);

// const user1 = new User({
//   email:"1@2.com",
//   password:"123"
// });

// const user2 = new User({
//   email:"test@email.com",
//   password:"test123"
// });

// const items = [user1,user2];
// User.insertMany(items,function(err){
//   if(err){
//       console.log(err);
//   } else{
//       console.log("Successfully saved into the db");
//   }
// });

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
  const newUser = new User({
    email:req.body.email,
    password:req.body.password
  });
 // rendering secrets page once user registered
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    } else{
      console.log(err);
    }
  });
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
        if(foundUser.password === password){
          res.render("secrets");
        } 
    }
  } 
  });
});

app.listen(3000,function(){
  console.log("server started at port 3000");
  
});