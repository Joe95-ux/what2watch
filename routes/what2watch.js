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

// watch guide

// providers
async function getProviders(media) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/${media}?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const providers = await data.results;
    return providers;
  } catch (e) {
    console.log(e);
  }
}



router.get("/watch-guide", async (req, res)=>{
  const title = "watch guide";
  let {page, watch_providers, watch_region, watch_monetization_types, media  } = req.query;
  let provider = watch_providers || 8;
  let region = watch_region || "US";
  let type = watch_monetization_types || "flatrate";
  let mediaType = media || "tv";
  let ref;
  if(mediaType === "tv"){
    ref = "Tv Shows";
  }else{
    ref = "Movies";
  }
  let currentPage = 1;
  if(page >=1){
    currentPage = parseInt(page);
  }
  let url = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_providers=${provider}&watch_region=${region}&with_watch_monetization_types=${type}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const media = await data.results;
    const movieGenres = await getMovieGenre();
    const tvGenres = await getTvGenre();
    const watchProviders = await getProviders(mediaType);
    const currentProvider = watchProviders.find(watchProvider => watchProvider.provider_id == provider);
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const page_num = await data.page;

    res.render("guide", { media, mediaType, ref, movieGenres, currentProvider, tvGenres, title, totalPages, totalResults, page_num });
  } catch (e) {
    console.log(e);
  }
})


module.exports = router;
