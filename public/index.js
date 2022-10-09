const searchField = document.querySelector(".search-field");
const searchInput = document.querySelector(".search");
const smallSearchIcon = document.querySelector(".small-screen-search-icon");
const smallSearchBar = document.querySelector(".small-screen-search");
const smallSearchInput = document.querySelector(".small-search");
const closeSmallSearch = document.querySelector(".close-sm-search");
const movieSynopsis = document.querySelector(".movie-synopsis");
const openSynopsis = document.querySelector(".open-synopsis");
const headerSynopsis = document.querySelector(".synopsis");
const returnBtns = document.querySelectorAll(".go-back");
const trailerBtn = document.querySelector(".trailer");
const headerTrailer = [...document.querySelectorAll(".header-trailer")];
const trailerContainer = document.querySelector(".movie-trailer");
const closeTrailer = document.querySelector(".close-trailer");
const videoPlayers = document.getElementsByClassName("video_player");
let video = document.querySelector(".trailer-video iframe");
const trailerVideo = video ? video.src : null;
const playIcons = document.getElementsByClassName("play-icon");
const expandReviews = document.querySelectorAll(".expand-review");
const reviewer = document.querySelector(".full-review-inner h6 span");
const reviewContent = document.querySelector(".full-review-content");
const watchBanner = document.querySelector(".watch-banner");
const watchProviders = document.querySelector(".watch-providers");
const closeProviders = document.querySelector(".close-providers");
const short = document.getElementById("short");
const long = document.getElementById("long");
const eyes = [...document.querySelectorAll(".pass-reveal")];
const seeBio = document.querySelector(".see-bio");
const profileBio = document.querySelector(".profile-biography");
let recentWrapper = document.querySelector(".recents-wrapper");
const cards = [...document.querySelectorAll(".viewed-card")];
const viewInfo = document.querySelector(".viewed-info");
const clearViewInfo = document.querySelector(".view-info-header a");
const profileInput = document.getElementById("profile-pic");
const simpleBarContainer = document.getElementById("simple-bar");
const episodesWrapper = document.querySelector(".season-contents");
const seasons = [...document.querySelectorAll(".season")];

// navigation bar
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const sideDrawer = document.querySelector(".side-drawer");
  const closeSideDrawer = document.querySelector(".fa-times");
  const sideDrawerBackdrop = document.querySelector(".side-drawer-backdrop");
  const navLinks = document.querySelectorAll(".nav_links li");

  burger.addEventListener("click", () => {
    // animate burger
    burger.classList.toggle("toggle");
    sideDrawerBackdrop.classList.add("active-backrop");
    // toggle side-drawer
    sideDrawer.classList.add("side-drawer-active");
    closeSideDrawer.style.opacity = "1";
  });

  //close drawer
  if (closeSideDrawer !== null) {
    closeSideDrawer.addEventListener("click", () => {
      sideDrawer.classList.remove("side-drawer-active");
      sideDrawerBackdrop.classList.remove("active-backrop");
      closeSideDrawer.style.opacity = "0";
    });
  }
  if (sideDrawerBackdrop !== null) {
    sideDrawerBackdrop.addEventListener("click", () => {
      sideDrawer.classList.remove("side-drawer-active");
      sideDrawerBackdrop.classList.remove("active-backrop");
    });
  }

  //seach-field animation
  if (searchField) {
    searchField.addEventListener("click", () => {
      searchField.style.backgroundColor = "#f0f0f0";
      searchInput.style.width = "240px";
      searchInput.style.opacity = 1;
      searchInput.focus();
      searchField.style.width = "100%";
    });
    //close search field on document click
    document.addEventListener("click", event => {
      let searchClicked = searchField.contains(event.target);
      if (!searchClicked) {
        searchField.style.backgroundColor = "inherit";
        searchInput.style.width = 0;
        searchInput.style.opacity = 0;
        searchField.style.width = "35px";
      }
    });
  }

  //small screen search-bar open/close
  if (smallSearchIcon !== null) {
    smallSearchIcon.addEventListener("click", () => {
      smallSearchBar.classList.toggle("active-small-search");
      smallSearchInput.focus();
    });
  }

  if (closeSmallSearch !== null) {
    closeSmallSearch.addEventListener("click", () => {
      smallSearchBar.classList.remove("active-small-search");
    });
  }

  // scroll EVENT
  window.addEventListener("scroll", function() {
    let navigation = document.querySelector(".navigation");
    let windowPosition = window.scrollY > 0;
    navigation.classList.toggle("scrolling-active", windowPosition);
  });

  // footer

  const currentYear = new Date().getFullYear();
  const copyrightYear = document.querySelector(".copyright");
  copyrightYear.innerHTML += currentYear;

  $(document).on("click", 'a[href^="#"]', function(event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top
      },
      500
    );
  });
};

// invoke function
navSlide();

// sticky layout
function stickLayout() {
  if (short != null || long != null) {
    let shortHeight = short.clientHeight + 497;
    let longHeight = long.clientHeight;
    if (longHeight > shortHeight) {
      short.classList.add("to-stick");
    } else {
      long.classList.add("to-stick");
    }
  }
}
stickLayout();

function previewPic() {
  if (profileInput !== null) {
    profileInput.addEventListener("input", e => {
      if (e.target.files.length > 0) {
        let src = URL.createObjectURL(e.target.files[0]);
        let avatar = document.querySelector(".profile-avatar");
        avatar.src = src;
      }
    });
  }
}
previewPic();

// show password and author bio
function revealPass() {
  if (eyes.length) {
    eyes.forEach(eye => {
      const blackeye = eye.querySelector(".black-eye");
      const openEye = eye.querySelector(".open-eye");
      const passInput = eye.previousElementSibling;
      eye.addEventListener("click", () => {
        if (passInput.type === "password") {
          passInput.type = "text";
          blackeye.style.display = "none";
          openEye.style.display = "inline-block";
        } else if (passInput.type === "text") {
          passInput.type = "password";
          blackeye.style.display = "inline-block";
          openEye.style.display = "none";
        }
      });
    });
  }
  if (seeBio) {
    seeBio.addEventListener("click", () => {
      seeBio.classList.toggle("active-see-bio");
      profileBio.classList.toggle("active-options");
    });
  }
}

revealPass();

//toggle synopsis and bio container
function openSynopsisContainer() {
  if (openSynopsis !== null) {
    openSynopsis.addEventListener("click", () => {
      if (movieSynopsis.clientHeight) {
        movieSynopsis.style.height = 0;
        movieSynopsis.style.marginBottom = 0;
      } else {
        let wrapper = document.querySelector(".measuring-wrapper");
        movieSynopsis.style.height = wrapper.clientHeight + "px";
        movieSynopsis.style.marginBottom = "1.5rem";
      }
    });
  }
}
openSynopsisContainer();

// close/open watch providers
function revealWatchProviders() {
  if (closeProviders !== null) {
    closeProviders.addEventListener("click", e => {
      e.preventDefault();
      headerSynopsis.style.display = "block";
      watchProviders.style.display = "none";
      watchBanner.style.display = "flex";
    });
  }
}
revealWatchProviders();

// toggle synopsis for small screens: here to ease work
function smallScreenSynopsis() {
  const dots = document.querySelector(".dots");
  const readAll = document.querySelector(".read-all");
  const readLess = document.querySelector(".read-less");
  const longSynopsis = document.querySelector(".long-synopsis");
  if (readAll !== null) {
    readAll.addEventListener("click", () => {
      dots.style.display = "none";
      longSynopsis.classList.add("active-long-synopsis");
      readAll.style.display = "none";
    });
  }
  if (readLess !== null) {
    readLess.addEventListener("click", () => {
      dots.style.display = "inline";
      longSynopsis.classList.remove("active-long-synopsis");
      readAll.style.display = "inline";
    });
  }
}

smallScreenSynopsis();

if (watchBanner !== null) {
  watchBanner.addEventListener("click", () => {
    headerSynopsis.style.display = "none";
    watchProviders.style.display = "block";
    watchBanner.style.display = "none";
  });
}

//trailer control
function trailerController() {
  if (trailerBtn !== null) {
    trailerBtn.addEventListener("click", () => {
      video.src = trailerVideo + "&autoplay=1";
      trailerContainer.classList.toggle("active-trailer");
    });
  }

  if (headerTrailer !== null) {
    let videoSource;
    for (let trailer of headerTrailer) {
      trailer.addEventListener("click", () => {
        videoSource = trailer.parentElement.nextElementSibling.src;
        video.src = videoSource + "&autoplay=1";
        trailerContainer.classList.toggle("active-trailer");
      });
    }
  }

  if (closeTrailer !== null) {
    closeTrailer.addEventListener("click", () => {
      //stop video on close
      Array.prototype.forEach.call(videoPlayers, function(videoPlayer) {
        videoPlayer.contentWindow.postMessage(
          '{"event":"command","func":"stopVideo","args":""}',
          "*"
        );
      });
      trailerContainer.classList.remove("active-trailer");
    });
  }
  window.onclick = event => {
    if (event.target === trailerContainer) {
      Array.prototype.forEach.call(videoPlayers, function(videoPlayer) {
        videoPlayer.contentWindow.postMessage(
          '{"event":"command","func":"stopVideo","args":""}',
          "*"
        );
      });
      trailerContainer.classList.remove("active-trailer");
    }
  };

  //play media
  if (playIcons !== null) {
    for (let icon = 0; icon < playIcons.length; icon++) {
      playIcons[icon].addEventListener("click", () => {
        const videoSource = playIcons[icon].previousElementSibling.src;
        video.src = videoSource + "&autoplay=1";
        trailerContainer.classList.toggle("active-trailer");
      });
    }
  }
}
trailerController();

//display reviews
function toggleReviews() {
  for (let i = 0; i < expandReviews.length; i++) {
    expandReviews[i].addEventListener("click", () => {
      reviewer.textContent =
        expandReviews[
          i
        ].parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.textContent;
      reviewContent.textContent =
        expandReviews[i].parentElement.nextElementSibling.innerText;
      reviewer.style.color = "red";
    });
  }

  // go back to previous page
  if (returnBtns !== null) {
    for (let i = 0; i < returnBtns.length; i++) {
      returnBtns[i].addEventListener("click", () => {
        history.back();
      });
    }
  }
}
toggleReviews();

// function debounce(fn, delay) {
//   let timeoutID;
//   return function(...args) {
//     if (timeoutID) {
//       clearTimeout(timeoutID);
//     }
//     timeoutID = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// }

// Handling recently clicked movie cards

function recentlyViewedHandler() {
  if (clearViewInfo) {
    clearViewInfo.href = window.location.href;
  }

  if (!localStorage.getItem("cardStore")) {
    localStorage.setItem("cardStore", "[]");
  }

  let store = JSON.parse(localStorage.getItem("cardStore"));
  if (store.length === 0) {
    clearViewInfo.style.display = "none";
    viewInfo.classList.add("show-view-info");
  }

  for (let i = 0; i < cards.length; i++) {
    const title = cards[i].firstElementChild.title;
    const image = cards[i].firstElementChild.firstElementChild.src;
    const link = cards[i].firstElementChild.href;
    const id = link.split("/").pop();
    cards[i].addEventListener("click", function() {
      let cardItem = { id: id, title, image, link };
      store.push(cardItem);
      store = store.reduce((pureStore, current) => {
        let obj = pureStore.find(item => item.id === current.id);
        if (obj) {
          return pureStore;
        }
        return pureStore.concat([current]);
      }, []);
      localStorage.setItem("cardStore", JSON.stringify(store));
    });
  }

  getRecentlyViewed(store);
}

function getRecentlyViewed(store) {
  if (store.length) {
    store.forEach(({ title, image, link }) => {
      let div = document.createElement("div");
      div.className = "cast-card recent-card";
      div.innerHTML = `
      <a class="image" href=${link} title=${title}>
        <img src=${image} alt="movie-poster">
        <h3> ${title} </h3>
      </a>
    `;
      if (recentWrapper) {
        recentWrapper.appendChild(div);
      }
    });
  }
}

recentlyViewedHandler();

// custom select dropdown
function dropDown() {
  const selected = [...document.querySelectorAll(".selected")];
  const optionsContainer = [...document.querySelectorAll(".options-container")];
  if (selected) {
    selected.forEach(select => {
      select.addEventListener("click", () => {
        select.previousElementSibling.classList.toggle("active-options");
      });
    });
  }

  if (optionsContainer) {
    optionsContainer.forEach(container => {
      const optionsList = container.querySelectorAll(".option");
      optionsList.forEach(option => {
        option.addEventListener("click", () => {
          const selectedInput = container.nextElementSibling.firstElementChild;
          selectedInput.value = option.querySelector("label").innerHTML;
          container.classList.remove("active-options");
        });
      });
    });
  }
}

dropDown();

function clearViewed() {
  if (clearViewInfo !== null) {
    clearViewInfo.addEventListener("click", () => {
      localStorage.removeItem("cardStore");
      clearViewInfo.innerText = "Clearing...";
      document.addEventListener("DOMContentLoaded", () => {
        clearViewInfo.style.display = "none";
      });
    });
  }
}
clearViewed();

//Trending togglers
const today = document.getElementById("today");
const week = document.getElementById("this-week");
const trendingToday = document.getElementById("trending-today");
const trendingThisWeek = document.getElementById("trending-thisweek");

if (today !== null || week !== null) {
  today.addEventListener("click", () => {
    today.classList.add("active-timeline");
    if (week.classList.contains("active-timeline")) {
      week.classList.remove("active-timeline");
    }
    trendingToday.style.transform = "translateX(0)";
    trendingThisWeek.style.transform = "translateX(100%)";
  });

  week.addEventListener("click", () => {
    week.classList.add("active-timeline");
    if (today.classList.contains("active-timeline")) {
      today.classList.remove("active-timeline");
    }
    trendingToday.style.transform = "translateX(-100%)";
    trendingThisWeek.style.transform = "translateX(0)";
  });
}

//faq-toggler
function accToggler() {
  const acc = document.getElementsByClassName("accodion");
  const title = document.querySelector(".faq-title");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", () => {
      acc[i].classList.toggle("active-drop");
      let panel = acc[i].nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      title.classList.toggle("active-title");
    });
  }
}
accToggler();

function seasonHandler() {
  if (seasons.length) {
    seasons[0].classList.add("active-season");
    for (let season of seasons) {
      season.addEventListener("click", function getEpisodes() {
        episodesWrapper.innerHTML = ` <div class="loader-wrapper"><span class="loader"></span></div> `;
        let season_num = season.dataset.index;
        let season_id = season.dataset.tv;
        let unclicked = seasons.filter(
          season => season.dataset.index !== season_num
        );
        unclicked.forEach(season => {
          if (season.classList.contains("active-season")) {
            season.classList.remove("active-season");
          }
        });
        season.classList.add("active-season");
        const headers = window.location;
        let url =
          headers.protocol +
          "//" +
          headers.host +
          "/tv/episodes/" +
          season_id +
          "/" +
          season_num;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onprogress = function() {
          episodesWrapper.innerHTML = "<h1>Loading...</h1>";
        };
        xhr.onload = function() {
          if (this.status == 200) {
            let response = JSON.parse(this.responseText);
            createEpisode(response);
          }
          showMoreHandler();
        };
        xhr.send();
      });
    }
  }
}

// handle more and less
function showMoreHandler() {
  let more = [...document.querySelectorAll("[data-more]")];
  let less = [...document.querySelectorAll("[data-less]")];
  for (let btn of more) {
    btn.addEventListener("click", function() {
      btn.parentElement.style.maxHeight = 0;
      btn.parentElement.nextElementSibling.style.maxHeight = btn.parentElement.nextElementSibling.scrollHeight + "px" ;
      
    });
  }
  for (let btn of less) {
    btn.addEventListener("click", function() {
      btn.parentElement.style.maxHeight = 0;
      btn.parentElement.previousElementSibling.style.maxHeight = btn.parentElement.previousElementSibling.scrollHeight + "px" ;
    });
  }
}

showMoreHandler();

function createEpisode(episodes) {
  let output = "";

  for (let i = 0; i < episodes.length; i++) {
    output += `
    <div class="episode-details">
                                <img src="https://image.tmdb.org/t/p/w500/${episodes[i].still_path} " alt="${episodes[i].name}">
                                <div class="episode-info">
                                    <h3>${episodes[i].episode_number}. ${episodes[i].name}</h3>
                                    <div class="episode-overview incomplete">${episodes[i].overview.length > 102 ? episodes[i].overview.substr(0, 102) + `...` : episodes[i].overview} ${episodes[i].overview.length > 102 ? `<span data-more class="more">More<i class="fas fa-chevron-down"></i></span>`:""}</div>
                                    <div class="episode-overview complete">${episodes[i].overview}<span data-less class="less">Less<i class="fas fa-chevron-up"></i></span></div>
                                    <h5>${episodes[i].runtime ? `<span class="left-bold">${episodes[i].runtime} mins</span>`: ""}
                                    <span class="right-span">${episodes[i].air_date}</span></h5>
                                </div>
        
                            </div>
  
  `;
  }
  if(episodes.length){
    episodesWrapper.innerHTML =
    output + "<div></div>" + "<div></div>" + "<div></div>" + "<div></div>";

  }else{
    episodesWrapper.innerHTML = "<h2>No Episodes yet</h2>";
  }
  
}

seasonHandler();

// welcome banner
$(document).ready(function() {
  function showModal() {
    let already_show = sessionStorage.getItem("alreadyShown");
    if (already_show != "already shown") {
      sessionStorage.setItem("alreadyShown", "already shown");
      $(".welcome-banner-modal").addClass("active-modal");
    } else {
      console.log("banner has been shown");
    }
  }
  setTimeout(showModal, 1500);
  $(".close-up").click(function() {
    $(".welcome-banner-modal").removeClass("active-modal");
  });
});

new SimpleBar(simpleBarContainer, { autoHide: true });
