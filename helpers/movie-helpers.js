
module.exports = {

  getTrailer: function getTrailer(videos) {
    let trailers = [];
    for (let video of videos) {
      if (video.type === "Trailer") {
        trailers.unshift(video);
      } else {
        trailers.push(video);
      }
    }
    return trailers[0];
  },
  getRunTime: function getRunTime(time) {
    if (time < 60 && time !== 0) {
      return time + "mins";
    }
    if (time === 0) {
      return "n/a";
    }
    let totalTime = time / 60;
    totalTime = totalTime.toString().split(".");
    let hr = totalTime[0];
    let mins = time % 60;
  
    return hr + "hr" + " " + mins + "m";
  },
  getMedia: function getMedia(videos, backdrops, posters) {
    const media = [videos, posters, backdrops];
    return media;
  },
  
  getCrew : function getCrew(allCrew) {
    let execCrew = [];
    let directors = [];
    let writers = [];
    let producers = [];
    for (let crew of allCrew) {
      if (crew.job === "Director") {
        directors.push(crew);
      }
      if (
        crew.job === "Writer" ||
        crew.job === "Novel" ||
        crew.job === "Screenplay" ||
        crew.job === "Book"
      ) {
        writers.push(crew);
      }
      if (crew.job === "Producer") {
        producers.push(crew);
      }
    }
    if (directors.length || writers.length || producers.length) {
      directors = directors.slice(0, 1);
      writers = writers.slice(0, 1);
      producers = producers.slice(0, 1);
    }
    execCrew = [...directors, ...writers, ...producers];
  
    return execCrew;
  },
  getOverview: function getOverview(overview) {
    const arrOverview = overview.split(" ");
    let movieOverview = {};
    if (overview.length) {
      movieOverview.short = arrOverview.slice(0, 30).join(" ");
      movieOverview.long = arrOverview.slice(30).join(" ");
    }
    return movieOverview;
  },
  getSpokenLanguage: function getSpokenLan(languages) {
    let languageList;
    if(languages?.length){
      languageList = languages.map(language=>language.name);
      languageList = languageList.filter(language=> language !== "");
      if(languageList?.length > 1){
        languageList = languageList.join(", ");
      }else{
        languageList = languageList.join(" ");
      }
    
      return languageList;
    }
    
  },
  getSingleProvider: function getSingleProvider(providers){
    let stream;
    let rent;
    let buy;
    let provider;
  
    if(providers.flatrate !== null ){
      stream = providers.flatrate? providers.flatrate: "";
    }
    if(providers.rent !== null){
      rent = providers.rent? providers.rent: "";
    }
    if(providers.buy !== null){
      buy = providers.buy? providers.buy :"";
    }
  
    if(stream.length || buy.length || rent.length){
      provider = [...stream, ...buy, ...rent];
    }
    return provider[0];
  
  },
  getNetworks: function getNetworks(networks){
    let networkList;
    if(networks?.length){
      networkList = networks.map(network=>network.name);
      networkList = networkList.filter(network=> network !== "");
      if(networkList?.length > 1){
        networkList = networkList.join(", ");
      }else{
        networkList = networkList.join(" ");
      }
      
      return networkList;
    }
    
  }
  
  

};




