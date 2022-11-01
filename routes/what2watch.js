const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const {capitalize} = require("../helpers/movie-helpers");

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

// get regions
async function getRegions() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/regions?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const regions = await data.results;
    return regions;
  } catch (e) {
    console.log(e);
  }
}

// get region code
async function getRegionCode(reg){
    try {
      const regions = await getRegions();
      let specificRegion =  await regions.find(region=>region.native_name === reg);
      const regionCode =  specificRegion.iso_3166_1;
      return regionCode;
      
    } catch (error) {
      console.log(error)
    }
}

// get watch providers by region and media type
router.get("/watch/providers/:media/:region", async (req, res)=>{
  const media = req.params.media;
  const region = req.params.region;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/${media}?api_key=${apiKey}&language=en-US&watch_region=${region}`
    );
    const data = await response.json();
    const providers = await data.results;
    res.json(providers);
  } catch (error) {
    console.log(error);
  }
})

// return rgions json data

router.get("/watch/providers/regions", async (req, res)=>{
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/regions?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const regions = await data.results;
    res.json(regions);
  } catch (e) {
    console.log(e);
  }
})



router.get("/watch-guide", async (req, res)=>{
  const title = "watch guide";
  let {page, watch_provider, watch_region, watch_monetization_types, media  } = req.query;
  let provider = watch_provider || "Netflix";
  let region = watch_region || "United States";
  let regionCode, countryProviders;
  let mediaType = media?.toLowerCase() || "tv";
  try {
    regionCode = await getRegionCode(region);
    countryProviders = await getProviders(mediaType);
    
  } catch (error) {
    console.log(error)
    
  }
  
  let type = watch_monetization_types?.toLowerCase() || "flatrate";
  let uniqueProvider = countryProviders?.find(countryProvider=>countryProvider.provider_name === provider);
  const provider_id = uniqueProvider?.provider_id;
  const useType = capitalize(type);
  const useMediatype = capitalize(mediaType);
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
  let url = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_providers=${provider_id}&watch_region=${regionCode}&with_watch_monetization_types=${type}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const mediaData = await data.results;
    const movieGenres = await getMovieGenre();
    const regions = await getRegions();
    const tvGenres = await getTvGenre();
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const page_num = await data.page;
    const watchProviders = await getProviders(mediaType);
    const currentProvider = await watchProviders?.find(watchProvider => watchProvider.provider_id == provider_id);
    res.render("guide", { media:mediaData, mediaType, ref, movieGenres, regions, currentProvider, tvGenres, title, totalPages, totalResults, page_num, provider, region, type:useType, useMediatype });
  } catch (e) {
    console.log(e);
  }
})


module.exports = router;
