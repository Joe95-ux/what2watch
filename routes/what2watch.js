const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
let pageNum = 1;

let url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNum}`;

async function getMovieGenre() {
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

async function getTvGenre() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const genres = await data.genres;
    return genres;
  } catch (e) {
    console.log(e);
  }
}

function getTvAndMovies(all) {
  let list;
  if (all.length) {
    list = all.filter(media => media.media_type !== "person");
    return list;
  }
}

router.get("/what-to-watch", async (req, res) => {
  const title = "what to watch today";
  let list = ["Top Picks", "watch Guide", "Popular"];
  let page = 1;
  if(req.query.page >=1){
    page = parseInt(req.query.page);
  }
  let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&page=${page}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const all = await data.results;
    const media = getTvAndMovies(all);
    const movieGenres = await getMovieGenre();
    const tvGenres = await getTvGenre();
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const page_num = await data.page;

    res.render("what2watch", { media, movieGenres, tvGenres, list, title, totalPages, totalResults, page_num });
  } catch (e) {
    console.log(e);
  }
});


module.exports = router;
