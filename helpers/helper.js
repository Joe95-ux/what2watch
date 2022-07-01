const moment = require("moment");

module.exports = {
    formatDate: function(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleDateString('en', options)
    },
    dateWithTime: function(date, format){
        return moment(date).format(format);
    }
    
}