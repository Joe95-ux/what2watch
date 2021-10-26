const express = require("express");
const { parseInt } = require("lodash");
const fetch = require("node-fetch");
const router = express.Router();

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
let page_num = 1;
const url =
  "https://api.themoviedb.org/3/review/"

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

//get movie

async function getMovie(movieId){
    try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&include_image_language=en,null&language=en-US`
        );
        const movie = await response.json();
        return movie;
      } catch (e) {
        console.log(e);
      }
    
}

router.get("/:id", async (req,res)=>{
    const id = req.params.id;
    try{
        const genres = await getgenre();
        const response = await fetch(url+id+"?api_key="+apiKey);
        const review = await response.json();
        const movieId = await review.media_id;
        const movie = await getMovie(movieId);
        res.render("review", {
            genres:genres,
            review:review,
            movie:movie
        })
    }catch(e){
        console.log(e);
    }
})




module.exports = router;