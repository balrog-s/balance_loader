var transactions = require('./store/transactions');
var dateUtils = require('./utils/dates');
var {withinDailyAndWeeklyLimits} = require('./validators/validation');


const userEntryNotFoundForDate = user => user === undefined;

const processFirstLoad = ({id, customerId, date, loadAmount}) => {
    const trxRecord = {
        id,
        customerId,
        date,
        totalLoadAmount: loadAmount,
        totalLoads: 1
    };
    transactions.addTrxRecord(trxRecord);
    return true;
};

const processSuccessiveLoadSuccess = ({id, customerId, date, totalLoadedAmount, totalLoads, userEntriesByDayIdx}) => {
    transactions.updateTrxRecord(
        userEntriesByDayIdx,
        {
            id,
            customerId,
            date,
            totalLoadAmount: totalLoadedAmount,
            totalLoads: totalLoads + 1
        }
    );
    return true;
};

const processLoadFailure = () => false;

function processRequest ({id, customerId, loadAmount, time}) {

    const date = dateUtils.formatTimeStampToDate(time);
    const start = dateUtils.getStartOfWeek(date);
    const end = dateUtils.getEndOfWeek(date);
    const dates = dateUtils.momentWeekRange(start, end);

    const userEntriesByDayIdx = transactions.findPreviousUserEntriesByDateIdx({customerId, date});
    const userEntriesByDay = transactions.findPreviousUserEntriesByDate({customerId, date});

    if (userEntryNotFoundForDate(userEntriesByDay)) {
        return processFirstLoad({id, customerId, date, loadAmount});
    }

    if (!withinDailyAndWeeklyLimits({userEntriesByDay, loadAmount, customerId, dates})) {
        return processLoadFailure();
    }
    const totalLoadedAmount = userEntriesByDay.totalLoadAmount + loadAmount;
    return processSuccessiveLoadSuccess({
        id,
        customerId,
        date,
        totalLoadedAmount,
        totalLoads: userEntriesByDay.totalLoads,
        userEntriesByDayIdx
    });
}

module.exports = {processRequest}