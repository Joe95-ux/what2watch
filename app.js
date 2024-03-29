
require("dotenv").config();
const express = require("express");
const _ = require("lodash");
const ejs = require("ejs");
const fetch = require("node-fetch");
const { forceDomain } = require('forcedomain');
const compression = require("compression");
const session = require('express-session');
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const MongoStore = require("connect-mongo");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const movieRouter = require("./routes/movie");
const keywordRouter = require("./routes/keyword");
const personRouter = require("./routes/person");
const reviewRouter = require("./routes/review");
const blogRouter = require("./routes/blog");
const ckeditorRouter = require("./routes/ckeditorulr");
const tvRouter = require("./routes/tv");
const what2watchRouter = require("./routes/what2watch");
const connectDB = require("./config/db");
const User = require("./models/User");
const Story = require("./models/Story");
const format = "MMMM Do YYYY, h:mm:ss a";
const { formatDate} = require("./helpers/helper");
const app = express();

// Method override
app.use(methodOverride('_method'));
// Passport config
require("./config/passport")(passport);
connectDB();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static( __dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000*60*24 },
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    mongoOptions: { useUnifiedTopology: true },
  }),
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Set Global variable
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.messages = req.flash();
  next();
})

app.use( ( req, res, next ) => {
  res.setHeader( 'Access-Control-Allow-Origin', '*' );
  res.setHeader( 'Access-Control-Allow-Methods', 'GET' );

  next();
} );

app.set("view engine", "ejs");

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
const page_num = 1;
const url =
  "https://api.themoviedb.org/3/movie/popular?api_key=" +
  apiKey +
  "&language=en-US&page=" +
  page_num +
  "&region=US";


function filterTrailers(videos){
  let video =  videos.find(video=>video.type === "Trailer" || video.type === "Teaser" || video.type === "Behind the Scenes");
  return video;
}

async function getMovieTrailer(id){
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    const trailers = await data.results;
    const trailer = filterTrailers(trailers);
    return trailer;
    
  } catch (e) {
    console.log(e);
  }
}

async function getPopularMovies(page) {
  const url =
  "https://api.themoviedb.org/3/movie/popular?api_key=" +
  apiKey +
  "&language=en-US&page=" +
  page +
  "&region=US";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const popMovies = await data.results;
    let trailers = await Promise.all(popMovies.map( async function (movie){
      let trailer = await getMovieTrailer(movie.id);
      return trailer;
    }));
    return {popMovies:popMovies, videos:trailers};
  } catch (e) {
    console.log(e);
  }
}
async function getAllPages(){
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = await data.total_pages;
    return pages;
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
app.get( "/search", async (req, res) => {
  const search = req.query.query;
  let title = search !== ""? search: "search movies, tv shows and cast";
  const query = encodeURIComponent(search);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/search/multi?api_key=" +
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
      title,
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
app.get("/search/:movie/", async (req, res) => {
  const search = req.params.movie;
  let title = search !== ""? search: "search movies, tv shows and cast";
  const query = encodeURIComponent(search);
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/search/multi?api_key=" +
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
      title,
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
// Get Top rated

async function getTopRated(){
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
        apiKey +
        "&language=en-US&page=1&region=US"
    );
    const data = await response.json();
    const topRatedMovie = await data.results.slice(0, 20);
    let trailers = await Promise.all(topRatedMovie.map( async function (movie){
      let trailer = await getMovieTrailer(movie.id);
      return trailer;
    }))
    return {topRated:topRatedMovie, videos:trailers};
    
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
  let title = "about what2watch.net";
  try {
    const trending = await getTrending();
    const header = await trending[0];
    const genres = await getgenre();

    res.render("about", {
      genres: genres,
      header:header,
      title
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/privacy", async (req, res) => {
  let title = "Privacy policy for what2watch.net";
  try {
    const genres = await getgenre();

    res.render("privacy", {
      genres: genres,
      title
    });
  } catch (e) {
    console.log(e);
  }
});



//Get popular Movies
app.get("/", async (req, res) => {
  const title = "What2watch - the streaming guide for Movies and Tv Shows";
  let page_num = 1;
  if(req.query.page >=1){
    page_num = parseInt(req.query.page);
  }
  try {
    const assets = await getPopularMovies(page_num);
    const popularMovies = await assets?.popMovies;
    const headerMovies = await popularMovies?.slice(0, 6);
    const headerVideos = await assets?.videos;
    const upcomingMovies = await getUpcoming();
    const topRatedAssets = await getTopRated();
    const topRated = await topRatedAssets?.topRated;
    const topRatedVideos = await topRatedAssets?.videos;
    const trending = await getTrending();
    const trendingToday = await getTrendingToday();
    const header = await trendingToday[0];
    const genres = await getgenre();
    const pages = await getAllPages();
    let stories = await Story.find({ status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    if (stories) {
      stories = stories.map(story => {
        story.createdAt = formatDate(story.createdAt);
        return story;
      });
      stories = stories.slice(0, 12); 
    }
    res.render("home", {
      popularMovies: popularMovies,
      headerMovies,
      headerVideos,
      topRated,
      topRatedVideos,
      upcomingMovies: upcomingMovies,
      featured:upcomingMovies,
      header:header,
      trending:trending,
      trendingToday:trendingToday,
      title,
      genres: genres,
      page_num: page_num,
      pages:pages,
      stories
    });
  } catch (e) {
    console.log(e);
  }
});


app.use("/movie", movieRouter);
app.use("/keyword", keywordRouter);
app.use("/person", personRouter);
app.use("/reviews", reviewRouter);
app.use("/blog", blogRouter);
app.use("/editor", ckeditorRouter);
app.use("/tv", tvRouter);
app.use("/recommendations", what2watchRouter);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, function () {
  console.log("Server has started sucessfully");
});



app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Server Error!')
})

app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + "/public/404.html");
})

