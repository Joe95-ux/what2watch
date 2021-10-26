
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");
const fetch = require("node-fetch");
const movieRouter = require("./routes/movie");
const personRouter = require("./routes/person");
const reviewRouter = require("./routes/review");
const app = express();

app.use(express.static( __dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/movieDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
const page_num = 1;
const url =
  "https://api.themoviedb.org/3/movie/popular?api_key=" +
  apiKey +
  "&language=en-US&page=" +
  page_num +
  "&region=US";

async function getPopularMovies() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const popMovies = await data.results;
    return popMovies;
  } catch (e) {
    console.log(e);
  }
}

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

//search movies
app.get("/search", async (req, res) => {
  const search = req.query.query;
  const query = encodeURIComponent(search);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US&query=" +
        query + "&include_adult=false"
    );
    const data = await response.json();
    const searchedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("search", {
      movies: searchedMovie,
      genres: genres,
      search: search,
      query:query,
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

//search pages
app.get("/search/:movie/:page", async (req, res) => {
  const search = req.params.movie;
  const query = encodeURIComponent(search);
  let page_num = parseInt(req.params.page);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US&query=" +
        query + "&include_adult=false"
    );
    const data = await response.json();
    const searchedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("search-page", {
      movies: searchedMovie,
      genres: genres,
      search: search,
      query:query,
      page_num: page_num,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});


// Get upcoming movies
async function getUpcoming(){
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const upcomingMovies = await data.results;
    return upcomingMovies;
  } catch (e) {
    console.log(e);
  }
}

//Get trending movies
async function getTrending(){
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const trending = await data.results;
    return trending;
  } catch (e) {
    console.log(e);
  }
}
//get trending today
async function getTrendingToday(){
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/day?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const trending = await data.results;
    return trending;
  } catch (e) {
    console.log(e);
  }
}
app.get("/about-us", async (req, res) => {
  try {
    const trending = await getTrending();
    const header = trending[0];
    const genres = await getgenre();

    res.render("about", {
      genres: genres,
      header:header
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/privacy", async (req, res) => {
  try {
    const genres = await getgenre();

    res.render("privacy", {
      genres: genres,
    });
  } catch (e) {
    console.log(e);
  }
});


//Get popular Movies
app.get("/", async (req, res) => {

  try {
    const popularMovies = await getPopularMovies();
    const upcomingMovies = await getUpcoming();
    const trending = await getTrending();
    const trendingToday = await getTrendingToday();
    const header = await trendingToday[0];
    const genres = await getgenre();
    res.render("home", {
      popularMovies: popularMovies,
      upcomingMovies: upcomingMovies,
      featured:upcomingMovies,
      header:header,
      trending:trending,
      trendingToday:trendingToday,
      genres: genres,
      page_num: page_num,
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/:page", async (req, res) => {
  let page_num = parseInt(req.params.page);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=" +
        apiKey +
        "&language=en-US&page=" +
        page_num +
        "&region=US"
    );
    const data = await response.json();
    const popularMovies = await data.results;
    const upcomingMovies = await getUpcoming();
    const trending = await getTrending();
    const trendingToday = await getTrendingToday();
    const header = await trendingToday[0];
    const genres = await getgenre();
    res.render("home", {
      popularMovies: popularMovies,
      upcomingMovies: upcomingMovies,
      featured:upcomingMovies,
      header:header,
      trending:trending,
      trendingToday:trendingToday,
      genres: genres,
      page_num: page_num,
    });
  } catch (e) {
    console.log(e) ;
  }
});






app.use("/movie", movieRouter);
app.use("/person", personRouter);
app.use("/reviews", reviewRouter);
app.listen(3000, () => {
  console.log("server has started on port 3000");
});



app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + "/public/404.html");
})

