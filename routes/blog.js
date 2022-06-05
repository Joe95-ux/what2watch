const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();


router.get("/posts", async (req, res)=>{
    const title = "blog posts";
    res.render("blogHome", {title});
})




module.exports = router;