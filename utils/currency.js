var R = require('ramda');

const DAILY_LIMIT = 5000;

const amountOverDailyLimit = amount => amount > DAILY_LIMIT;

// Assumption that a user is able to load an amount of 0 and that this would count towards their daily total.
const amountIsNegative = amount => amount < 0;

const removeDollarSigns = amount => amount.replace(/\$/g, '');
const parseStringToFloat = amount => parseFloat(amount);

const sanitizeLoadAmountValue = amount => R.pipe(
    removeDollarSigns,
    parseStringToFloat,
)(amount);

module.exports = {
    amountOverDailyLimit,
    amountIsNegative,
    removeDollarSigns,
    parseStringToFloat,
    sanitizeLoadAmountValue,
}