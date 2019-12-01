var moment = require('moment');

// This allows us to set Monday as the first day of the week.
moment.updateLocale('en', {
    week: {
        dow: 1
    }
});

const formatTimeStampToDate = timestamp => moment(timestamp).utc().format('YYYY-MM-DD');
const getStartOfWeek = date => moment(date).startOf('week').utc().format('YYYY-MM-DD');
const getEndOfWeek = date => moment(date).endOf('week').utc().format('YYYY-MM-DD');

const momentWeekRange = (start, end) => {
    const dates = [];
    const startDate = moment(start).utc().format('YYYY-MM-DD');
    let currDate = startDate;
    const endDate = moment(end).utc().format('YYYY-MM-DD');
    while (moment(currDate).isSameOrBefore(endDate)) {
        dates.push(currDate);
        currDate = moment(currDate).add(1, 'd').utc().format('YYYY-MM-DD');
    }
    return dates;
}

module.exports = {
    formatTimeStampToDate,
    getStartOfWeek,
    getEndOfWeek,
    momentWeekRange,
}