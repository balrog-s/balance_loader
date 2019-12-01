var R = require('ramda');

// Ideally each load attempt would be stored as a DB record on success
// however even storing attempts via an event store would allow to setup triggers for suspected fraudulent behaviour (ex: 100 load attempts a day, etc)
let trxHistory = [];

const addTrxRecord = record => {
    trxHistory = R.append(record, trxHistory);
    return trxHistory;
};

const getTrxRecord = recordIdx => trxHistory[recordIdx];

const updateTrxRecord = (idx, record) => {
    trxHistory = R.update(idx, record, trxHistory);
    return trxHistory;
}

const findTransactionForUserByDate = ({customerId, date}) => record =>
    (record.customerId === customerId && R.equals(date, record.date));

const findTransactionForUserByDateRange = ({customerId, dates}) => record =>
    (record.customerId === customerId && R.contains(record.date, dates));

const findPreviousUserEntriesByDateIdx = ({customerId, date}) => R.findIndex(findTransactionForUserByDate({customerId, date}), trxHistory);
const findPreviousUserEntriesByDate = ({customerId, date}) => trxHistory[findPreviousUserEntriesByDateIdx({customerId, date})];
const findAllUserRecordsWithinWeek = ({customerId, dates}) => R.filter(findTransactionForUserByDateRange({customerId, dates}), trxHistory);

module.exports = {
    addTrxRecord,
    findTransactionForUserByDate,
    findTransactionForUserByDateRange,
    findPreviousUserEntriesByDateIdx,
    findPreviousUserEntriesByDate,
    findAllUserRecordsWithinWeek,
    getTrxRecord,
    updateTrxRecord,
};
