const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const {subcribeHandler} = require("../utils/mailchimp");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
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

router.get("/compose", async (req, res) => {
  const title = "compose";
  res.render("compose", { title });
});

router.get("/edit", async (req, res) => {
  const title = "edit post";
  res.render("editblog", { title });
});

router.get("/post", async (req, res) => {
  const title = "post";
  const userEmail = req.flash("user");
  res.render("post", { title, userEmail });
});

router.get("/login", async (req, res) => {
  const title = "Login";
  res.render("login", { title });
});

router.get("/register", async (req, res) => {
  const title = "register";
  res.render("register", { title });
});

router.get("/profile", async (req, res) => {
  const title = "Edit profile";
  res.render("profile", { title });
});

router.get("/dashboard", async (req, res) => {
  const title = "dashboard";
  res.render("dashboard", { title });
});

module.exports = router;
