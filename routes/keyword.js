const express = require("express");
const { parseInt } = require("lodash");
const fetch = require("node-fetch");
const router = express.Router();

const apiKey = process.env.API_KEY;


async function getgenre() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const genres = await data.genres;
    return genres;
  } catch (e) {
    console.log(e);
  }
}


// get movies by a keyword
router.get("/:keyword", async (req, res)=>{
    const keyword = req.params.keyword;
    const keys = keyword.split("-");
    const keyId = keys.slice(0, 1);
    const rawName = keys.slice(1).join("-")
    const keyName = keys.slice(1).join(" ");
    const title = keyName + "movies";
    let page_num = 1;
    if(req.query.page >=1){
      page_num = parseInt(req.query.page);
    }
    try{
      const response = await fetch(
        "https://api.themoviedb.org/3/discover/movie?api_key=" +
          apiKey +
          "&language=en-US&page=" +
          page_num +
          "&include_adult=false&with_keywords="  + keyId
      );
      const data = await response.json();
      const movies = await data.results;
      const totalPages = await data.total_pages;
      const totalResults = await data.total_results;
      const genres = await getgenre();
      res.render("keywordpage", {
        title,
        keyword:keyName,
        rawName,
        keyId,
        movies,
        genres: genres,
        page_num: page_num,
        totalPages: totalPages,
        totalResults: totalResults
      });
  
  
    }catch (e){
      console.log(e)
    }
  
  })
  
  
module.exports = router;
  