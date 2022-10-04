const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

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
    const animation = await getGenreList("Animation");
    const list = [{content:action, name:"action & adventure"}, {content:kids, name:"kids"}, {content:politics, name:"war & politics"}, {content:reality, name:"reality"}, {content:family, name:"family"}, {content:soap, name:"soap"}, {content:animation, name:"animation"}, {content:documentary, name:"documentary"}];
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
  








module.exports = router;
