const express = require("express");
const { parseInt } = require("lodash");
const fetch = require("node-fetch");
const router = express.Router();

const apiKey = process.env.API_KEY;
const accessToken = process.env.API_READ_ACCESS_TOKEN;

async function getGenre() {
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

//helper function to group movie credits

function getMovieCollection(arr, len) {
  const result = [];
  let index = 0;
  while (index < arr.length) {
    result.push(arr.slice(index, index + len));
    index += len;
  }
  return result;
}
//get age of person
function getAge(year){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let age = "";
    if(year !==null){
       let birthYear = year.split("-")[0];
       age = currentYear-birthYear;
       
    }
    return (age + " " + "years old");
    
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let page_num = 1;
  const pageLimit = 20;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/person/" +
        id +
        "?api_key=" +
        apiKey +
        "&append_to_response=movie_credits,images&language=en-US"
    );
    const personDetails = await response.json();
    const allMovieCredits = await personDetails.movie_credits.cast;
    const birthDate = await personDetails.birthday;
    const age = getAge(birthDate);
    const totalPages = Math.ceil(allMovieCredits.length / pageLimit);
    const movieCollection = getMovieCollection(allMovieCredits, pageLimit);
    const movies = await movieCollection[page_num - 1];
    const images = await personDetails.images.profiles;
    const genres = await getGenre();
    res.render("actor", {
      page_num: page_num,
      details: personDetails,
      pageLimit: pageLimit,
      allMovies: allMovieCredits,
      totalPages: totalPages,
      movies: movies,
      images: images,
      age: age,
      genres: genres,
    });
  } catch (e) {
    console.log(e);
  }
});

//person next page

router.get("/:id/movie_credits/:page_num", async (req, res) => {
  const id = req.params.id;
  let page_num = parseInt(req.params.page_num);
  const pageLimit = 20;
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/person/" +
        id +
        "?api_key=" +
        apiKey +
        "&append_to_response=movie_credits,images&language=en-US"
    );
    const personDetails = await response.json();
    const allMovieCredits = await personDetails.movie_credits.cast;
    const birthDate = await personDetails.birthday;
    const age = getAge(birthDate);
    const totalPages = Math.ceil(allMovieCredits.length / pageLimit);
    const movieCollection = getMovieCollection(allMovieCredits, pageLimit);
    const movies = await movieCollection[page_num - 1];
    const images = await personDetails.images.profiles;
    const genres = await getGenre();
    res.render("actor", {
      page_num: page_num,
      details: personDetails,
      pageLimit: pageLimit,
      allMovies: allMovieCredits,
      totalPages: totalPages,
      movies: movies,
      images: images,
      age:age,
      genres: genres,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
