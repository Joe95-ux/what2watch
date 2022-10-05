const express = require("express");
const { parseInt } = require("lodash");
const fetch = require("node-fetch");
const {getTrailer, getSingleProvider, getRunTime, getMedia, getCrew, getOverview} = require("../helpers/movie-helpers");
const router = express.Router();

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
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
  let encodedGenre = encodeURIComponent(genreName);

  try {
    const genres = await getgenre();
    const genreId = await genres.filter(genre => {
      return genre.name === genreName;
    });
    const id = await genreId[0].id;
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        apiKey +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" +
        id +
        "&with_watch_monetization_types=free"
    );
    const data = await response.json();
    const genreMovies = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const page_num = await data.page;

    res.render("genres", {
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

//movies by genre pagination

router.get("/genres/:genre/:page", async (req, res) => {
  const genreName = req.params.genre;
  const encodedGenre = encodeURIComponent(genreName);
  page_num = parseInt(req.params.page);

  try {
    const genres = await getgenre();
    const genreId = await genres.filter(genre => {
      if (genre.name === genreName) {
        return genre;
      }
    });
    const id = await genreId[0].id;
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        apiKey +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" +
        page_num +
        "&with_genres=" +
        id +
        "&with_watch_monetization_types=free"
    );
    const data = await response.json();
    const genreMovies = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;

    res.render("genrePage", {
      movies: genreMovies,
      genres: genres,
      page_num: page_num,
      genre: genreName,
      encodedGenre: encodedGenre,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    throw e;
  }
});

router.get("/upcoming", async (req, res) => {
  page_num = 1;
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

//pages for upcoming and top rated movies.

router.get("/:category/:page", async (req, res) => {
  page_num = parseInt(req.params.page);
  const category = req.params.category;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        category +
        "?api_key=" +
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
    res.render("next_page", {
      movies: upcomingMovie,
      genres: genres,
      category: category,
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
  page_num = 1;
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
    const results = await data.results.US;
    if(results){
      provider = getSingleProvider(results);
    }
    
    return {results, provider};
  } catch (e) {
    console.log(e);
  }
}

function getSpokenLan(languages) {
  let lanArr = [];
  if (languages.length) {
    for (let lan of languages) {
      lanArr.push(lan.name);
    }
  }
  let lanStr = lanArr.join(", ");
  return lanStr;
}

//get a movie by id
router.get("/:movie_id", async (req, res) => {
  const movieId = req.params.movie_id;
  let page_num = 1;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=" +
        apiKey +
        "&append_to_response=videos,credits,reviews,similar,images&include_image_language=en,null&language=en-US"
    );
    const movie = await response.json();
    const movieTitle = await movie.title;
    const languages = await movie.spoken_languages;
    const spokenLanguages = getSpokenLan(languages);
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
    const totalPages = await recommendedData.total_pages;
    const totalResults = await recommendedData.total_results;
    const recommendedMovies = await recommendedData.results;
    const similarMovies = await movie.similar.results;
    const similar = await similarMovies;
    const getProviders = await getWatchProviders(movieId);
    const watchProviders = getProviders.results;
    const provider = getProviders.provider;
    const genres = await getgenre();

    res.render("movie", {
      movie: movie,
      watch: watchProviders,
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
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

//single-movie-next-page

router.get("/:title/:movie_id/:page", async (req, res) => {
  const movieId = req.params.movie_id;
  let page_num = parseInt(req.params.page);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=" +
        apiKey +
        "&append_to_response=videos,credits,reviews,similar,images&include_image_language=en,null&language=en-US"
    );
    const movie = await response.json();
    const movieTitle = await movie.title;
    const languages = await movie.spoken_languages;
    const spokenLanguages = getSpokenLan(languages);
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
    const totalPages = await recommendedData.total_pages;
    const totalResults = await recommendedData.total_results;
    const recommendedMovies = await recommendedData.results;
    const similarMovies = await movie.similar.results;
    const similar = await similarMovies;
    const getProviders = await getWatchProviders(movieId);
    const watchProviders = getProviders.results;
    const provider = getProviders.provider;
    const genres = await getgenre();

    res.render("movie", {
      movie: movie,
      watch: watchProviders,
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
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
