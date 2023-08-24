const express = require("express");
const { parseInt } = require("lodash");
const fetch = require("node-fetch");
const slugify = require("slugify");
const {getTrailer, getRev, getNetworks, getSpokenLanguage, getSingleProvider, getRunTime, getMedia, getCrew, getOverview} = require("../helpers/movie-helpers");
const router = express.Router();

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
const justwatchToken = process.env.JUSTWATCH_API_KEY;
let page_num = 1;
const url =
  "https://api.themoviedb.org/3/movie/popular?api_key=" +
  apiKey +
  "&language=en-US&region=US";

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

//get movie by genre or genre filters

router.get("/genres/:genre", async (req, res) => {
  let genreName = req.params.genre;
  let title = genreName + " movies";
  let keywords = `where to watch ${title}`;
  let description = `Discover ${title} and see where to watch them in a hassle-free way.`;
  let encodedGenre = encodeURIComponent(genreName);
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }

  try {
    const genres = await getgenre();
    const genreId = await genres.filter(genre => {
      return genre.name === genreName;
    });
    const id = await genreId[0].id;
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        apiKey +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&" +
        page_num +
        "&with_genres=" +
        id +
        "&with_watch_monetization_types=free"
    );
    const data = await response.json();
    const genreMovies = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;

    res.render("genres", {
      title,
      description,
      keywords,
      movies: genreMovies,
      genres: genres,
      page_num: page_num,
      genre: genreName,
      encodedGenre: encodedGenre,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});


router.get("/upcoming", async (req, res) => {
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }
  let title = "Upcoming Movies";
  let keywords = `where to watch ${title}`;
  let description = `Discover ${title} and see where to watch them in a hassle-free way.`;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const upcomingMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("upcoming", {
      title,
      keywords,
      description,
      movies: upcomingMovie,
      genres: genres,
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});


//top rated
router.get("/top_rated", async (req, res) => {
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }
  let title = "Top rated Movies";
  let keywords = `where to watch ${title} of all time`;
  let description = `Discover ${title} and see where to watch them in a hassle-free way.`;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const topRatedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("top_rated", {
      title,
      keywords,
      description,
      movies: topRatedMovie,
      genres: genres,
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

//get recommended movies
async function getRecommended(movieId, page_num) {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/recommendations?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

//get watch providers
async function getWatchProviders(movieId) {
  let provider;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/watch/providers?api_key=" +
        apiKey
    );
    const data = await response.json();
    const results = await data?.results?.US;
    if(results){
      provider = getSingleProvider(results);
    }
    
    return {results, provider};
  } catch (e) {
    console.log(e);
  }
}


// get external movie data 
async function getExternalData(id){
  try {
    const response = await fetch(`https://yts.mx/api/v2/movie_details.json?imdb_id=${id}`);
    const data = await response.json();
    const movieData = await data.data.movie;
    if(id){
      return movieData;
    }
    
  } catch (error) {
    console.log(error);
    
  }
}

//get a movie by id
router.get("/:movie_id", async (req, res) => {
  const movieId = req.params.movie_id;
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=" +
        apiKey +
        "&append_to_response=videos,credits,reviews,similar,images,keywords&include_image_language=en,null&language=en-US"
    );
    const movie = await response.json();
    const movieTitle = await movie.title;
    let revenue = await movie.revenue;
    revenue = getRev(revenue);
    let budget = await movie.budget;
    budget = getRev(budget);
    const movieNetworks = await movie.production_companies;
    const genreList = await movie.genres;
    const extData = await getExternalData(movie.imdb_id);
    const languages = await movie.spoken_languages;
    const spokenLanguages = getSpokenLanguage(languages);
    const title = encodeURIComponent(movieTitle);
    const videos = await movie.videos.results.slice(0, 5);
    const posters = await movie.images.posters.slice(0, 4);
    const backdrops = await movie.images.backdrops.slice(0, 3);
    const media = getMedia(videos, backdrops, posters);
    const trailer = getTrailer(videos);
    const time = await movie.runtime;
    const runTime = getRunTime(time);
    const allCrew = await movie.credits.crew;
    const crews = getCrew(allCrew);
    const movieOverview = await movie.overview;
    const overview = getOverview(movieOverview);
    const reviews = await movie.reviews.results;
    const recommendedData = await getRecommended(movieId, page_num);
    let totalPages, totalResults, recommendedMovies;
    if(recommendedData){
      totalPages = await recommendedData.total_pages;
      totalResults = await recommendedData.total_results;
      recommendedMovies = await recommendedData.results;

    }
    const similarMovies = await movie.similar.results;
    const similar = await similarMovies;
    const getProviders = await getWatchProviders(movieId);
    let watchProviders, provider;
    if(getProviders){
      watchProviders = getProviders.results;
      provider = getProviders.provider;
    }
    let keywords = await movie.keywords.keywords;
    keywords = keywords.map(keyword=>{
      keyword.slug = slugify(keyword.name);
      return keyword;
    })

    const genres = await getgenre();
    const network = getNetworks(movieNetworks);
    const movieGenres = getNetworks(genreList);

    res.render("movie", {
      movie: movie,
      keywords,
      revenue,
      budget,
      extData,
      watch: watchProviders,
      justwatchToken,
      provider,
      title: title,
      spokenLanguages: spokenLanguages,
      genres: genres,
      trailer: trailer,
      runTime: runTime,
      media: media,
      reviews: reviews,
      crews: crews,
      overview: overview,
      recommendedMovies: recommendedMovies,
      similarMovies: similarMovies,
      similar: similar,
      network,
      movieGenres,
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

