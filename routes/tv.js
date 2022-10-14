const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const _ = require("lodash");
const {getTrailer, getcert, getNetworks, getSingleProvider, getMedia, getCrew, getOverview, getSpokenLanguage} = require("../helpers/movie-helpers");

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;
let pageNum = 1;

let url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNum}`;

async function getgenre() {
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

// get by genrelist
async function getGenreList(name){
    
    try {
        const genres = await getgenre();
        const genreId = await genres.find(genre => {
          return genre.name === name;
        });
        const id = await genreId.id;
        const response = await fetch(
          "https://api.themoviedb.org/3/discover/tv?api_key=" +
            apiKey +
            "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" +
            id +
            "&with_watch_monetization_types=free"
        );
        const data = await response.json();
        const genreMovies = await data.results;
        return genreMovies;
    
        
    } catch (e) {
        console.log(e);
    }
}

function filterTrailers(videos) {
  let video = videos.find(
    video =>
      video.type === "Trailer" ||
      video.type === "Teaser" ||
      video.type === "Behind the Scenes"
  );
  return video;
}

async function getMovieTrailer(id) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const trailers = await data.results;
    const trailer = filterTrailers(trailers);
    return trailer;
  } catch (e) {
    console.log(e);
  }
}

// Get tv airing today

async function airingToday() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/top_rated?api_key=" +
        apiKey +
        "&language=en-US&page=1"
    );
    const data = await response.json();
    const airing_today = await data.results.slice(0, 20);
    let trailers = await Promise.all(
      airing_today.map(async function(movie) {
        let trailer = await getMovieTrailer(movie.id);
        return trailer;
      })
    );
    return { airingToday: airing_today, videos: trailers };
  } catch (e) {
    console.log(e);
  }
}

async function getPopularTv() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const popMovies = await data.results;
    let trailers = await Promise.all(
      popMovies.map(async function(movie) {
        let trailer = await getMovieTrailer(movie.id);
        return trailer;
      })
    );
    return { popMovies: popMovies, videos: trailers };
  } catch (e) {
    console.log(e);
  }
}
async function getAllPages() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = await data.total_pages;
    return pages;
  } catch (e) {
    console.log(e);
  }
}

// Get toprated tv shows
// Get upcoming movies
async function topRatedTv(){
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/tv/top_rated?api_key=" +
          apiKey +
          "&language=en-US&page=1"
      );
      const data = await response.json();
      const topRatedShows = await data.results;
      return topRatedShows;
    } catch (e) {
      console.log(e);
    }
  }

router.get("/tv-shows", async (req, res) => {
  let page_num = 1;
  const title = "Tv Shows";
  try {
    const assets = await getPopularTv();
    const popularMovies = await assets?.popMovies;
    const headerMovies = await popularMovies?.slice(0, 8);
    const headerVideos = await assets?.videos;
    const airingTodayAssets = await airingToday();
    const airing_Today = await airingTodayAssets?.airingToday;
    const airingTodayVideos = await airingTodayAssets?.videos;
    const topRated = await topRatedTv();
    const genres = await getgenre();
    const pages = await getAllPages();
    const action = await getGenreList("Action & Adventure");
    const kids = await getGenreList("Kids");
    const politics = await getGenreList("War & Politics");
    const reality = await getGenreList("Reality");
    const comedy = await getGenreList("Comedy");
    const documentary = await getGenreList("Documentary");
    const family = await getGenreList("Family");
    const soap = await getGenreList("Soap");
    const news = await getGenreList("News");
    const animation = await getGenreList("Animation");
    const list = [{content:action, name:"Action & Adventure"}, {content:kids, name:"Kids"}, {content:politics, name:"War & Politics"}, {content:reality, name:"Reality"}, {content:family, name:"Family"}, {content:soap, name:"Soap"}, {content:animation, name:"Animation"}, {content:documentary, name:"Documentary"}, {content:news, name:"News"}];
    res.render("tv", {
      movies: headerMovies,
      popularMovies,
      comedy,
      title,
      list,
      headerVideos,
      airing_Today,
      airingTodayVideos,
      topRated,
      genres: genres,
      page_num: page_num,
      pages: pages,
    });
  } catch (e) {
    console.log(e);
  }
});

//get movie by genre or genre filters

router.get("/genres/:genre/", async (req, res) => {
    let genreName = req.params.genre;
    let title = genreName;
    let encodedGenre = encodeURIComponent(genreName);
    
    try {
      const genres = await getgenre();
      const genreId = await genres.filter(genre => {
        return genre.name === genreName;
      });
      const id = await genreId[0].id;
      const response = await fetch(
        "https://api.themoviedb.org/3/discover/tv?api_key=" +
          apiKey +
          "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page="+ pageNum + "&with_genres=" +
          id +
          "&with_watch_monetization_types=free"
      );
      const data = await response.json();
      const genreMovies = await data.results;
      const totalPages = await data.total_pages;
      const totalResults = await data.total_results;
      const page_num = await data.page;
  
      res.render("tvgenre", {
        movies: genreMovies,
        genres: genres,
        page_num: page_num,
        genre: genreName,
        encodedGenre: encodedGenre,
        totalPages: totalPages,
        totalResults: totalResults,
        title
      });
    } catch (e) {
      console.log(e);
    }
});

// get next genre page for tv

router.get("/genres/:genre/:page", async (req, res) => {
    let genreName = req.params.genre;
    let title = genreName;
    let encodedGenre = encodeURIComponent(genreName);
    pageNum = parseInt(req.params.page);
    
    try {
      const genres = await getgenre();
      const genreId = await genres.filter(genre => {
        return genre.name === genreName;
      });
      const id = await genreId[0].id;
      const response = await fetch(
        "https://api.themoviedb.org/3/discover/tv?api_key=" +
          apiKey +
          "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page="+ pageNum + "&with_genres=" +
          id +
          "&with_watch_monetization_types=free"
      );
      const data = await response.json();
      const genreMovies = await data.results;
      const totalPages = await data.total_pages;
      const totalResults = await data.total_results;
      const page_num = await data.page;
  
      res.render("tvgenre", {
        movies: genreMovies,
        genres: genres,
        page_num: page_num,
        genre: genreName,
        encodedGenre: encodedGenre,
        totalPages: totalPages,
        totalResults: totalResults,
        title
      });
    } catch (e) {
      console.log(e);
    }
});

// get show watch providers
//get watch providers
async function getWatchProviders(movieId) {
  let provider;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/" +
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



// get episodes
async function getEpisodes(id, season_num){
  let url = `https://api.themoviedb.org/3/tv/${id}/season/${season_num}?api_key=${apiKey}&language=en-US`
  try{
    const response = await fetch(url);
    const results = await response.json();
    const episodes = await results.episodes;
    return episodes;
  }catch(err){
    console.log(err)
  }
}

// get other episodes 
router.get("/episodes/:id/:num", async(req, res)=>{
  let url = `https://api.themoviedb.org/3/tv/${req.params.id}/season/${req.params.num}?api_key=${apiKey}&language=en-US`;
  try {
    const response = await fetch(url);
    const results = await response.json();
    const episodes = await results.episodes;
    res.json(episodes);
  } catch (error) {
    console.log(error)
  }

})
// get real seasons

function getSeasons(seasons){
  let series = seasons.filter(season=>season.season_number != 0);
  return series;
}


//get a movie by id
router.get("/tv-shows/:movie_id", async (req, res) => {
  const movieId = req.params.movie_id;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/" +
        movieId +
        "?api_key=" +
        apiKey +
        "&append_to_response=videos,content_ratings,credits,reviews,similar,recommendations,images&include_image_language=en,null&language=en-US"
    );
    const movie = await response.json();
    const movieTitle = await movie.name;
    const tvNetworks = await movie.networks;
    const certs = await movie.content_ratings.results;
    const cert = getcert(certs);
    const genreList = await movie.genres;
    const languages = await movie.spoken_languages;
    const spokenLanguages = getSpokenLanguage(languages);
    const title = encodeURIComponent(movieTitle);
    const videos = await movie.videos.results.slice(0, 8);
    const posters = await movie.images.posters.slice(0, 8);
    const backdrops = await movie.images.backdrops.slice(0, 8);
    const media = getMedia(videos, backdrops, posters);
    const trailer = getTrailer(videos);
    const allCrew = await movie.credits.crew;
    const crews = getCrew(allCrew);
    const movieOverview = await movie.overview;
    const overview = getOverview(movieOverview);
    const reviews = await movie.reviews.results;
    const recommendedMovies = await movie.recommendations.results;
    const similarMovies = await movie.similar.results;
    const getProviders = await getWatchProviders(movieId);
    const watchProviders = getProviders.results;
    const provider = getProviders.provider;
    const seasons = await movie.seasons;
    const realSeasons = getSeasons(seasons);
    const season1 = await realSeasons[0].season_number
    const episodes = await getEpisodes(movieId, season1);
    const genres = await getgenre();
    const network = getNetworks(tvNetworks);
    const tvGenres = getNetworks(genreList);

    res.render("tvdetails", {
      movie: movie,
      watch: watchProviders,
      title: title,
      spokenLanguages: spokenLanguages,
      genres: genres,
      seasons: realSeasons,
      trailer: trailer,
      media: media,
      reviews: reviews,
      crews: crews,
      overview: overview,
      recommendedMovies: recommendedMovies,
      similarMovies: similarMovies,
      similar:similarMovies,
      provider,
      network,
      cert,
      tvGenres,
      episodes
    });
  } catch (e) {
    console.log(e);
  }
});


// top rated tv shows
router.get("/top-rated", async (req, res) => {
  const title = "Top Rated Tv Shows";
  let cat = "top-rated";
  pageNum = 1;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/top_rated?api_key=" +
        apiKey +
        "&language=en-US&page=1"
    );
    const data = await response.json();
    const topRatedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("top-rated-tv", {
      movies: topRatedMovie,
      title,
      cat,
      genres: genres,
      page_num: pageNum,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

// shows on air 
router.get("/on-the-air", async (req, res) => {
  const title = "Tv Shows on Air";
  let cat = "on-the-air";
  pageNum = 1;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/on_the_air?api_key=" +
        apiKey +
        "&language=en-US&page=1"
    );
    const data = await response.json();
    const topRatedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("top-rated-tv", {
      movies: topRatedMovie,
      title,
      cat,
      genres: genres,
      page_num: pageNum,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});

//next page for on air and top rated

router.get("/:cat/:page", async (req, res) => {
  let title;
  let param;
  if(req.params.cat === "on-the-air"){
    title = "Tv Shows on Air";
    param = "on_the_air";
  }else if(req.params.cat === "top-rated"){
    title = "Top rated Tv Shows";
    param = "top_rated";
  }
  let cat = req.params.cat;
  pageNum = parseInt(req.params.page);
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/"+ param + "?api_key=" +
        apiKey +
        "&language=en-US&page=" + pageNum
    );
    const data = await response.json();
    const topRatedMovie = await data.results;
    const totalPages = await data.total_pages;
    const totalResults = await data.total_results;
    const genres = await getgenre();
    res.render("top-rated-tv", {
      movies: topRatedMovie,
      title,
      cat,
      genres: genres,
      page_num: pageNum,
      totalPages: totalPages,
      totalResults: totalResults
    });
  } catch (e) {
    console.log(e);
  }
});


  








module.exports = router;
