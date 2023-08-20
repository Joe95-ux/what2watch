const searchField = document.querySelector(".search-field");
const searchInput = document.querySelector(".search");
const smallSearchIcon = document.querySelector(".small-screen-search-icon");
const smallSearchBar = document.querySelector(".small-screen-search");
const smallSearchInput = document.querySelector(".small-search");
const closeSmallSearch = document.querySelector(".close-sm-search");
const movieSynopsis = document.querySelector(".movie-synopsis");
const openSynopsis = [...document.querySelectorAll(".hero-collapse")];
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
// const watchBanner = document.querySelector(".watch-banner");
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
const seasons = [...document.querySelectorAll(".current-season")];
const recommendList = [...document.querySelectorAll(".roller-item")];
const recWrapper = document.querySelector(".rec-media-wrapper");
const multiSearch = document.querySelector(".multi-search-modal");
const searchTrigger = document.querySelector(".search-trigger");
const multiSearchInput = document.querySelector(".multi-search");
const cancelMultiSearch = document.querySelector(".multi-search-cancel");
const optionsContainer = [...document.querySelectorAll(".options-container")];
let providerEmbla = document.querySelector(".providers__embla__container");
const providerWrapper = document.getElementById("providers_wrapper");
let providerInput = document.getElementById("watch_provider");
let regionInput = document.getElementById("watch_region");
let mediaInput = document.getElementById("media_cat");
let watchTypeInput = document.getElementById("watch-type");
let mediaVal, regionVal, watchTypeVal;
if (mediaInput !== null) {
  mediaVal = mediaInput.value;
}
if (regionInput !== null) {
  regionVal = regionInput.value;
}
if(watchTypeInput !== null){
  watchTypeVal = watchTypeInput.value;
}

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

//multi search trigger
function triggerMultiSearch() {
  if (searchTrigger !== null) {
    searchTrigger.addEventListener("click", function() {
      multiSearch.classList.add("active-multi-search");
      multiSearchInput.focus();
    });
    if (cancelMultiSearch !== null) {
      cancelMultiSearch.addEventListener("click", function() {
        multiSearch.classList.remove("active-multi-search");
      });
    }
  }
}
triggerMultiSearch();

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
    openSynopsis.forEach(drop => {
      drop.addEventListener("click", () => {
        if (movieSynopsis.clientHeight) {
          movieSynopsis.style.height = 0;
          movieSynopsis.style.marginBottom = 0;
        } else {
          let wrapper = document.querySelector(".measuring-wrapper");
          movieSynopsis.style.height = wrapper.clientHeight + "px";
          movieSynopsis.style.marginBottom = "1.5rem";
        }
      });
    });
  }
}
openSynopsisContainer();

// close/open watch providers
// function revealWatchProviders() {
//   if (closeProviders !== null) {
//     closeProviders.addEventListener("click", e => {
//       e.preventDefault();
//       headerSynopsis.style.display = "block";
//       watchProviders.style.display = "none";
//       watchBanner.style.display = "flex";
//     });
//   }
// }
// revealWatchProviders();

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


// if (watchBanner !== null) {
//   watchBanner.addEventListener("click", () => {
//     headerSynopsis.style.display = "none";
//     watchProviders.style.display = "block";
//     watchBanner.style.display = "none";
//   });
// }

//trailer control
function trailerController() {
  if (trailerBtn !== null) {
    trailerBtn.addEventListener("click", () => {
      video.style.display = "block";
      video.src =
        trailerBtn.dataset.source +
        "?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1";
      trailerContainer.classList.toggle("active-trailer");
    });
  }

  if (headerTrailer !== null) {
    let videoSource;
    for (let trailer of headerTrailer) {
      trailer.addEventListener("click", () => {
        videoSource = trailer.dataset.source;
        video.src =
          videoSource +
          "?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1";
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
      video.style.display = "none";
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
      video.style.display = "none";
      trailerContainer.classList.remove("active-trailer");
    }
  };

  //play media
  if (playIcons !== null) {
    for (let icon = 0; icon < playIcons.length; icon++) {
      playIcons[icon].addEventListener("click", () => {
        video.style.display = "block";
        const videoSource = playIcons[icon].dataset.source;
        video.src =
          videoSource +
          "?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1";
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
      reviewer.style.color = "#C4DDFF";
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
      <a class="image" href="${link}" title="${title}">
        <img src="${image}" alt="${title}">
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
  const selected = [ ...document.querySelectorAll(".selected")];
  if (selected !== null) {
    selected.forEach(select => {
      select.addEventListener("click", () => {
        select.previousElementSibling.classList.toggle("active-options");
      });
    });
  }

  handlpeOptions();
}

function handlpeOptions() {
  if (optionsContainer !== null) {
    optionsContainer.forEach(container => {
      const optionsList = [ ...container.querySelectorAll(".option")];
      const selectedInput = container.nextElementSibling.firstElementChild;
      optionsList.forEach(option => {
        let optionLabel = option.querySelector("label");
        let trimmedInput = selectedInput.value.trim();

        if ( trimmedInput === optionLabel.innerHTML) {
          option.classList.add("active-label");
        } else {
          if (option.classList.contains("active-label")) {
            option.classList.remove("active-label");
          }
        }
        option.addEventListener("click", e => {
          optionsList.forEach(opt => {
            if (opt.classList.contains("active-label")) {
              opt.classList.remove("active-label");
            }
          });

          option.classList.add("active-label");

          selectedInput.value = optionLabel.innerHTML;
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

// watch providers filter start
async function watchFilterHandler() {
  if (providerWrapper !== null) {
    providerWrapper.innerHTML = ` <div class="loader-wrapper"><span class="circle-loader"></span></div> `;
  }
  if (providerEmbla !== null) {
    providerEmbla.innerHTML = ` <div class="loader-wrapper"><span class="circle-loader"></span></div> `;
  }

  const headers = window.location;
  let baseUrl =
    headers.protocol +
    "//" +
    headers.host +
    "/recommendations/watch/providers/";
  let regionsUrl = baseUrl + "regions";
  let regions;
  try {
    regions = await fetchRegionCode(regionsUrl);
  } catch (error) {
    console.log(error);
  }
  let regionCode = regions.find(region => region.native_name === regionVal);
  if(regionCode){
    regionCode = regionCode.iso_3166_1;
  }
  let monitizationParam = "&watch_monetization_types=" + watchTypeVal
  let guideLink = headers.protocol +
  "//" +
  headers.host +
  "/recommendations/watch-guide?media=" + mediaVal + "&watch_region=" + regionVal  + "&watch_provider=";
  
  if(mediaVal){
    let providersUrl = baseUrl + mediaVal.toLowerCase() + "/" + regionCode;
    xhrRequest(providersUrl, guideLink, monitizationParam);
  }
}

function xhrRequest(providersUrl, guideLink, monitizationParam) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", providersUrl, true);
  xhr.onprogress = function() {
    if (providerWrapper !== null) {
      providerWrapper.innerHTML =
        "<h1>Oops! Something went wrong. Please try again.</h1>";
    }
  };
  xhr.onload = function() {
    if (this.status == 200) {
      let response = JSON.parse(this.responseText);
      // if(providerInput !== null){
      //   providerInput.value = response[0].provider_name;
      // }
      createProviders(response);
      createProvidersEmbla(response, guideLink, monitizationParam);
    }
    handlpeOptions();
    rebuild();
  };
  xhr.send();
}

function createProviders(providers) {
  let output = "";

  for (let i = 0; i < providers.length; i++) {
    output += `
    <div class="option provider-options prov_wrapper">
      <input type="radio" class="radio" id="${providers[i].provider_name}" />
      <img src="https://image.tmdb.org/t/p/w500/${providers[i]
      .logo_path}" alt="${providers[i].provider_name}">
      <label for="${providers[i].provider_name}">${providers[i].provider_name}</label>
    </div>
  
  `;
  }

  if (providers.length) {
    providerWrapper.innerHTML = output;
  } else {
    providerWrapper.innerHTML = "<h2>No Watch providers for this regions.</h2>";
  }
}

function createProvidersEmbla(providers, guideLink, monitizationParam) {
  let output = "";

  for (let i = 0; i < providers.length; i++) {
    output += `
    <div class="embla__slide new-slides" style="margin-right: 10px;">
      <div class="provider embla__slide__inner">
      <a href="${guideLink + providers[i].provider_name + monitizationParam}" style="color:darkGray; font-size:13px;" title="${providers[i].provider_name}">
      <img src="https://image.tmdb.org/t/p/w500/${providers[i]
      .logo_path}" alt="${providers[i].provider_name}">

      </a>
      </div>
                                                                                
    </div>
  
  `;
  }
  if (providers.length) {
    providerEmbla.innerHTML = output;
  } else {
    providerEmbla.innerHTML =
      "<h2>Oops! Something went wrong. Please try again later.</h2>";
  }
}

// fetch regions codes
async function fetchRegionCode(url) {
  try {
    let response = await fetch(url);
    let results = await response.json();
    return results;
  } catch (error) {
    console.log(error);
  }
}

watchFilterHandler();

// check change in watch regions and media type

setInterval(function() {
  let newMediaVal, newRegionVal, newWatchTypeVal;
  if (mediaInput !== null) {
    newMediaVal = mediaInput.value;
  }
  if (watchTypeInput !== null) {
    newWatchTypeVal = watchTypeInput.value;
  }
  if (regionInput !== null) {
    newRegionVal = regionInput.value;
  }
  if (newMediaVal !== mediaVal) {
    mediaVal = newMediaVal;
    watchFilterHandler();
  }
  if (newRegionVal !== regionVal) {
    regionVal = newRegionVal;
    watchFilterHandler();
  }
  if (newWatchTypeVal !== watchTypeVal) {
    watchTypeVal = newWatchTypeVal;
    watchFilterHandler();
  }
}, 2000);

//watch prroviders filter end

// fetching seasons
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
          episodesWrapper.innerHTML =
            "<h1><h1>Oops! Something went wrong. Please try again.</h1></h1>";
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
      btn.parentElement.nextElementSibling.style.maxHeight =
        btn.parentElement.nextElementSibling.scrollHeight + "px";
    });
  }
  for (let btn of less) {
    btn.addEventListener("click", function() {
      btn.parentElement.style.maxHeight = 0;
      btn.parentElement.previousElementSibling.style.maxHeight =
        btn.parentElement.previousElementSibling.scrollHeight + "px";
    });
  }
}

showMoreHandler();

function createEpisode(episodes) {
  let output = "";

  for (let i = 0; i < episodes.length; i++) {
    output += `
    <div class="episode-details">
                                <img src="https://image.tmdb.org/t/p/w500/${episodes[
                                  i
                                ].still_path} " alt="${episodes[i].name}">
                                <div class="episode-info">
                                    <h3>${episodes[i]
                                      .episode_number}. ${episodes[i].name}</h3>
                                    <div class="episode-overview incomplete">${episodes[
                                      i
                                    ].overview.length > 102
                                      ? episodes[i].overview.substr(0, 102) +
                                        `...`
                                      : episodes[i].overview} ${episodes[i]
      .overview.length > 102
      ? `<span data-more class="more">More<i class="fas fa-chevron-down"></i></span>`
      : ""}</div>
                                    <div class="episode-overview complete">${episodes[
                                      i
                                    ]
                                      .overview}<span data-less class="less">Less<i class="fas fa-chevron-up"></i></span></div>
                                    <h5>${episodes[i].runtime
                                      ? `<span class="left-bold">${episodes[i]
                                          .runtime} mins</span>`
                                      : ""}
                                    <span class="right-span">${episodes[i]
                                      .air_date}</span></h5>
                                </div>
        
                            </div>
  
  `;
  }
  if (episodes.length) {
    episodesWrapper.innerHTML =
      output + "<div></div>" + "<div></div>" + "<div></div>" + "<div></div>";
  } else {
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


function rebuild() {
  const wrap = document.querySelectorAll(".ajax-embla");
  const toscroll = document.querySelector(".toscroll");
  const width = $(window).width();
  let value;
  if (width <= 830) {
    value = 5;
  } else {
    value = 8;
  }

  if (wrap !== null) {
    const viewPort = Array.from(document.querySelectorAll(".ajax-embla-viewport"));
    viewPort.forEach(view => {
      let embla = EmblaCarousel(view, {
        dragFree: true,
        containScroll: "trimSnaps",
        slidesToScroll: value,
        skipSnaps: false
      });

      const prevBtn = view.nextElementSibling;
      const nextBtn = view.nextElementSibling.nextElementSibling;

      const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
        prevBtn.addEventListener("click", embla.scrollPrev, false);
        nextBtn.addEventListener("click", embla.scrollNext, false);
      };
      setupPrevNextBtns(prevBtn, nextBtn, embla);
      const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
        return () => {
          if (embla.canScrollPrev()) prevBtn.removeAttribute("disabled");
          else prevBtn.setAttribute("disabled", "disabled");

          if (embla.canScrollNext()) nextBtn.removeAttribute("disabled");
          else nextBtn.setAttribute("disabled", "disabled");
        };
      };

      const disablePrevAndNextBtns = disablePrevNextBtns(
        prevBtn,
        nextBtn,
        embla
      );

      embla.on("select", disablePrevAndNextBtns);
      embla.on("init", disablePrevAndNextBtns);
    });
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const paginationContainer = document.querySelector(".pagination-controls");
  const totalPages = parseInt(paginationContainer.dataset.pages); // Total number of pages from backend
  let currentPage = parseInt(paginationContainer.dataset.current); // Current page from backend

  const renderPaginationButtons = () => {
    paginationContainer.innerHTML = `
      <a class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" href="${currentPage === 1 ? '/' : '/?page=' + (currentPage - 1)}">Previous</a>
      <a class="pagination-btn ${currentPage === 1 ? 'active' : ''}" href="/?page=1">1</a>
      <a class="pagination-btn ${currentPage === 2 ? 'active' : ''}" href="/?page=2">2</a>
    `;

    const numButtons = 10;
    const startPage = Math.max(3, currentPage - Math.floor(numButtons / 2));
    const endPage = Math.min(totalPages, startPage + numButtons - 1);

    if (startPage > 3) {
      paginationContainer.innerHTML += `
        <span class="ellipsis">...</span>
      `;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.innerHTML += `
        <a class="pagination-btn ${currentPage === i ? 'active' : ''}" href="/?page=${i}">${i}</a>
      `;
    }

    if (endPage < totalPages) {
      paginationContainer.innerHTML += `
        <span class="ellipsis">...</span>
      `;
    }

    paginationContainer.innerHTML += `
      <a class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" href="/?page=${currentPage + 1}">Next</a>
    `;
  };

  paginationContainer.addEventListener("click", (event) => {
    const targetButton = event.target.closest(".pagination-btn");
    if (targetButton && !targetButton.classList.contains("disabled")) {
      currentPage = parseInt(targetButton.getAttribute("href").split("=")[1]);
      renderPaginationButtons();
    }
  });

  // Initial rendering of pagination buttons
  renderPaginationButtons();
});

new SimpleBar(simpleBarContainer, { autoHide: true });