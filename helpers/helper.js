const moment = require("moment");

module.exports = {
  formatDate: function(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en", options);
  },
  dateWithTime: function(date, format) {
    return moment(date).format(format);
  },
  getCats: function(stories) {
    let cats = stories.map(story => story.category);
    return cats;
  },
  sortCats: function(catArr) {
    let allCats = {};
    for (let cat of catArr) {
      if (!allCats[cat]) {
        allCats[cat] = 1;
      } else {
        allCats[cat]++;
      }
    }
    return allCats;
  }
};
