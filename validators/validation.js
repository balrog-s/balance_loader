var ids = require('../store/ids');
var transactions = require('../store/transactions');
var currencyUtils = require('../utils/currency');
var R = require('ramda');

const WEEKLY_LIMIT = 20000;
const DAILY_LIMIT = 5000;

const isIDAlreadyProcessed = ({id, customerId}) => ids.wasIDForCustomerAlreadyProcessed({id, customerId});

const isInvalidInitialAmount = ({loadAmount}) => {
    return R.anyPass([
        currencyUtils.amountOverDailyLimit,
        currencyUtils.amountIsNegative
    ])(loadAmount);
};
const isUserDailyLimitReached = ({totalLoadAmount, attemptedLoadAmount}) =>
    totalLoadAmount + attemptedLoadAmount > DAILY_LIMIT;

const isDailyLimitReached = ({userEntriesByDay, loadAmount}) => isUserDailyLimitReached({
    totalLoadAmount: userEntriesByDay.totalLoadAmount,
    attemptedLoadAmount: loadAmount
}) || userEntriesByDay.totalLoads === 3;

const weeklyTotalAmount = ({customerId, dates}) => R.reduce(
    (acc, value) => {
        acc = acc + value.totalLoadAmount
        return acc;
    },
    0,
    transactions.findAllUserRecordsWithinWeek({customerId, dates})
)

const isWeeklyLimitReached = ({customerId, dates, loadAmount}) => weeklyTotalAmount({customerId, dates}) + loadAmount > WEEKLY_LIMIT;

const withinDailyAndWeeklyLimits = ({userEntriesByDay, loadAmount, customerId, dates}) => {
    if (isDailyLimitReached({userEntriesByDay, loadAmount}) || isWeeklyLimitReached({customerId, dates, loadAmount})) {
        return false;
    }
    return true;
}

module.exports = {
    isIDAlreadyProcessed,
    isInvalidInitialAmount,
    withinDailyAndWeeklyLimits,
}