const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();


router.get("/posts", async (req, res)=>{
    const title = "blog posts";
    res.render("blogHome", {title});
})

router.get("/category", async (req,res)=>{
    const title = "category";
    res.render("blogCategory", {title});

    
})

router.get("/compose", async (req,res)=>{
    const title = "compose";
    res.render("compose", {title});

    
})

router.get("/post", async (req,res)=>{
    const title = "post";
    res.render("post", {title});

    
})

router.get("/forms", async (req,res)=>{
    const title = "Login/Sign-up form";
    res.render("forms", {title});

    
})






module.exports = router;