const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {subcribeHandler} = require("../utils/mailchimp");
const {ensureAuth, ensureGuest, ensureToken} = require("../middleware/auth");
const User = require("../models/User");
const Story = require("../models/Story");


mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

// Passport config
require("../config/passport")(passport);

// define storage for images
const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "/public/uploads/images");
  },
  //fileName
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage
});



router.post("/posts", async (req, res) => {
  const subscribingUser = {
    firstName: "",
    lastName: "",
    email: req.body.subscriber
  };
  try{
    await subcribeHandler(subscribingUser);
    req.flash("user", subscribingUser.email);
    res.redirect(req.originalUrl);
  }catch(e){
    console.log(e)
  }
  
  
});

router.get("/posts", async (req, res) => {
  const title = "blog posts";
  const userEmail = req.flash("user");
  res.render("blogHome.ejs", { title , userEmail});
});

router.get("/category", async (req, res) => {
  const title = "category";
  const userEmail = req.flash("user");
  res.render("blogCategory", { title, userEmail });
});

router.get("/compose", ensureAuth,  async (req, res) => {
  const title = "compose";
  res.render("compose", { title });
});

router.post("/compose", ensureAuth, upload.single("photo") , async (req, res) => {
  try{
    req.body.user = req.user.id;
    console.log(req.body)
    await Story.create(req.body);
    res.redirect("/blog/posts");

  }catch(err){
    console.error(err)
  }
});

router.get("/edit", ensureAuth, async (req, res) => {
  const title = "edit post";
  res.render("editblog", { title });
});

router.get("/post", async (req, res) => {
  const title = "post";
  const userEmail = req.flash("user");
  res.render("post", { title, userEmail });
});


router.get("/register", ensureGuest,  async (req, res) => {
  const title = "register";
  res.render("register", { title });
});

router.get("/login", ensureGuest, async (req, res) => {
  const title = "Login";
  res.render("login", { title });
});

router.get("/profile", ensureAuth, async (req, res) => {
  const title = "Edit profile";
  res.render("profile", { title });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  const title = "dashboard";
  res.render("dashboard", { title });
});

router.post("/register", ensureToken, function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/blog/dashboard");
        });
      }
    }
  );
});

router.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    passsword: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/blog/dashboard");
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/blog/posts');
  });
});


module.exports = router;
