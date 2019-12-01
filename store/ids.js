var R = require('ramda');

let idHistory = [];

const addIdHistoryRecord = ({id, customerId}) => {
    idHistory = R.append({id, customerId}, idHistory);
    return idHistory;
};

const wasIDForCustomerAlreadyProcessed = ({id, customerId}) => {
    idHistoryIdx = R.findIndex(record =>
        (record.id === id && record.customerId === customerId), idHistory);
    if (idHistoryIdx < 0) {
        addIdHistoryRecord({id, customerId});
        return false;
    }
    return true;
}

module.exports = {
    wasIDForCustomerAlreadyProcessed,
    addIdHistoryRecord,
};
