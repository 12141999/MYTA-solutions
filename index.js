var express = require("express");
var path=require('path');
var passport = require("passport");
var LocalStrategy  = require("passport-local");
var passportLocalMongoose  = require("passport-local-mongoose");
var request = require("request");
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require("./user");
 mongoose.connect("mongodb://localhost/myta_intern");
app.use(bodyParser.urlencoded({extended : true}));
app.use('', express.static(path.join(__dirname + '')));
app.set('views', path.join(__dirname, 'views'));
app.use(require("express-session")({
    secret: "books page",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});

app.post("/signup",function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   var newuser = {username : username , password : password};
   User.register(new User({username : username}) , password , function(err,user){
      if(err){
      	console.log(err);
      	return res.render("signup.ejs");
      }
      	passport.authenticate("local")(req,res,function(){
           res.render("book.ejs");
      	});
   });
});

app.post("/login",passport.authenticate("local" , {
   successRedirect : "/book",
   failureRedirect : "/login"
}) , function(req,res){
});

app.get("/electric",function(req,res){
  fs.readFile('k.json', (err, data) => {  
    if (err) 
    {
    	console.log(err);
    }
    let book = JSON.parse(data);
    res.render("test.ejs",{a : book["gradesList"][0]["subjectList"][0]["chapterList"][0]["questionList"][0]["question"] , b : book["gradesList"][0]["subjectList"][0]["chapterList"][0]["questionList"][0]["answer"] , c : book["gradesList"][0]["subjectList"][0]["chapterList"][0]["questionList"][1]["question"] , d :  book["gradesList"][0]["subjectList"][0]["chapterList"][0]["questionList"][1]["answer"] });
  });
});

app.get("/line",function(req,res){
  fs.readFile('k.json', (err, data) => {  
    if (err) 
    {
    	console.log(err);
    }
    let book = JSON.parse(data);
    res.render("test.ejs",{a : book["gradesList"][0]["subjectList"][1]["chapterList"][0]["questionList"][0]["question"] , b : book["gradesList"][0]["subjectList"][1]["chapterList"][0]["questionList"][0]["answer"] , c : book["gradesList"][0]["subjectList"][1]["chapterList"][0]["questionList"][1]["question"] , d :  book["gradesList"][0]["subjectList"][1]["chapterList"][0]["questionList"][1]["answer"] });
   
  });
});

app.get("/usa",function(req,res){
  fs.readFile('k.json', (err, data) => {  
    if (err) 
    {
    	console.log(err);
    }
    let book = JSON.parse(data);	
    res.render("test.ejs",{a : book["gradesList"][1]["subjectList"][0]["chapterList"][0]["questionList"][0]["question"] , b : book["gradesList"][1]["subjectList"][0]["chapterList"][0]["questionList"][0]["answer"] , c : book["gradesList"][1]["subjectList"][0]["chapterList"][0]["questionList"][1]["question"] , d :  book["gradesList"][1]["subjectList"][0]["chapterList"][0]["questionList"][1]["answer"] });
  });
});

app.get("/logout",function(req,res){
   req.logout();
   res.render("home.ejs");
});

function isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
       return next();
	}
	res.render("login.ejs");
}

app.get("/",function(req,res){
   res.render("home.ejs");
});

app.get("/book", isLoggedIn , function(req,res){
  res.render("book.ejs");
});

app.get("/login",function(req,res){
  res.render("login.ejs");
});

app.get("/signup",function(req,res){
   res.render("signup.ejs");
});

app.listen("5000",function(req,res){
   console.log("server is started");
});