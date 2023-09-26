//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");

const app=express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User=new mongoose.model("User", userSchema);



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch(err => {
            console.error(err);
        });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({ email: username })
        .then(function(foundUser) {
            if (foundUser.email==username && foundUser.password === password) {
                res.render("secrets");
            } else {
                // Handle incorrect username or password
                res.send("Incorrect username or password");
            }
        })
        .catch(function(err) {
            console.error(err);
            res.send("An error occurred");
        });
});

app.get("/logout", function(req,res){
    res.redirect("/");
});


app.listen(3000,function(){
    console.log("Server started on port 3000.");
});