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

// navigation bar
const navSlide = () => {
  const burger = document.querySelector(".burger");
  const sideDrawer = document.querySelector(".side-drawer");
  const closeSideDrawer = document.querySelector(".fa-times");
  const sideDrawerBackdrop = document.querySelector(".side-drawer-backdrop");
  const navLinks = document.querySelectorAll(".nav_links li");

  burger.addEventListener("click", () => {
    sideDrawerBackdrop.classList.add("active-backrop");
    // toggle side-drawer
    if (sideDrawer.classList.contains("side-drawer-inactive")) {
      sideDrawer.classList.remove("side-drawer-inactive");
      sideDrawer.classList.add("side-drawer-active");
      closeSideDrawer.style.opacity = "1";
    } else {
      sideDrawer.classList.add("side-drawer-active");
    }

    // animate links
    // navLinks.forEach((link, index) => {
    //   // + 0.3 for initial delay
    //   if (link.style.animation) {
    //     link.style.animation = "";
    //   } else {
    //     link.style.animation = `navLinkFade 0.5s ease forwards ${
    //       index / 7 + 0.5
    //     }s `;
    //   }
    // });

    // animate burger
    burger.classList.toggle("toggle");
  });

  //close drawer
  if (closeSideDrawer !== null) {
    closeSideDrawer.addEventListener("click", () => {
      sideDrawerBackdrop.classList.remove("active-backrop");
      if (sideDrawer.classList.contains("side-drawer-active")) {
        sideDrawer.classList.remove("side-drawer-active");
        sideDrawer.classList.add("side-drawer-inactive");
      }

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
};

// invoke function
navSlide();

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
if (closeProviders !== null) {
  closeProviders.addEventListener("click", e => {
    e.preventDefault();
    headerSynopsis.style.display = "block";
    watchProviders.style.display = "none";
    watchBanner.style.display = "flex";
  });
}
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
    for(let trailer of headerTrailer){
      trailer.addEventListener("click", () => {
        const videoSource = trailer.parentElement.nextElementSibling.src;
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
}
toggleReviews();

// go back to previous page
if (returnBtns !== null) {
  for (let i = 0; i < returnBtns.length; i++) {
    returnBtns[i].addEventListener("click", () => {
      history.back();
    });
  }
}

// scroll EVENT
window.addEventListener("scroll", function() {
  let navigation = document.querySelector(".navigation");
  let windowPosition = window.scrollY > 0;
  navigation.classList.toggle("scrolling-active", windowPosition);
});

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

// footer

const currentYear = new Date().getFullYear();
const copyrightYear = document.querySelector(".copyright");
copyrightYear.innerHTML += currentYear;

//smooth scroll on a tag click
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//   anchor.addEventListener('click', function (e) {
//       e.preventDefault();

//       document.querySelector(this.getAttribute('href')).scrollIntoView({
//           behavior: 'smooth'
//       });
//   });
// });
$(document).on("click", 'a[href^="#"]', function(event) {
  event.preventDefault();

  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    500
  );
});

// Handling recently clicked movie cards

let recentWrapper = document.querySelector(".recents-wrapper");
const cards = [...document.querySelectorAll(".movie-card")];
const viewInfo = document.querySelector(".viewed-info");
const clearViewInfo = document.querySelector(".view-info-header a");
clearViewInfo.href = window.location.href;

if (!localStorage.getItem("cardStore")) {
  localStorage.setItem("cardStore", "[]");
}

let store = JSON.parse(localStorage.getItem("cardStore"));
if(store.length === 0){
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

let div;

function getRecentlyViewed() {
  if (store.length) {
    store.forEach(({ title, image, link }) => {
      div = document.createElement("div");
      div.classList.add("embla__slide");
      div.innerHTML = `
    <div class="embla__slide__inner cast-card recent-card">
      <a class="image" href=${link} title=${title}>
        <img src=${image} alt="movie-poster">
        <h3>${title}</h3>
      </a>
    </div>
    `;
      recentWrapper.appendChild(div);
    });
  }
}

getRecentlyViewed();

if (clearViewInfo !== null) {
  clearViewInfo.addEventListener("click", () => {
    localStorage.removeItem("cardStore");
    clearViewInfo.innerText ="Clearing...";
    document.addEventListener("DOMContentLoaded", ()=>{
      clearViewInfo.style.display = "none";
    })

    
  });
}

// simplebar
let simpleBarContainer = document.getElementById('simple-bar');
new SimpleBar(simpleBarContainer, { autoHide: true });

// welcome banner
$(document).ready(function(){
  function showModal(){
    let already_show = sessionStorage.getItem("alreadyShown");
    if(already_show != "already shown"){
      sessionStorage.setItem("alreadyShown", "already shown");
      $(".welcome-banner-modal").addClass("active-modal");
    }else{
      console.log("banner has been shown")
    }

  }
  setTimeout(showModal, 1500);
  $(".close-up").click(function(){
    $(".welcome-banner-modal").removeClass("active-modal");
  })
})
