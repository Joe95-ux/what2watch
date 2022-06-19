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

router.get("/edit", async (req,res)=>{
    const title = "edit post";
    res.render("editblog", {title});

    
})

router.get("/post", async (req,res)=>{
    const title = "post";
    res.render("post", {title});

    
})

router.get("/login", async (req,res)=>{
    const title = "Login";
    res.render("login", {title});

    
})

router.get("/register", async (req,res)=>{
    const title = "register";
    res.render("register", {title});  
})

router.get("/dashboard", async (req,res)=>{
    const title = "dashboard";
    res.render("dashboard", {title});

    
})






module.exports = router;