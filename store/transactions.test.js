var transactions = require('./transactions');

describe('Transactions Store:', () => {
    const trxRecord1 = {
        id: '123',
        customerId: 'abc',
        date: '2020-01-01',
        totalLoadAmount: 100,
        totalLoads: 1
    };
    const trxRecord2 = {
        id: '123',
        customerId: 'abc',
        date: '2020-01-01',
        totalLoadAmount: 100,
        totalLoads: 1
    };
    test('should append the new record to processed transactions array', () => {
        const trxRecord = {
            id: '123',
            customerId: 'abc',
            date: '2020-01-01',
            totalLoadAmount: 100,
            totalLoads: 1
        };
        const trxArr = transactions.addTrxRecord(trxRecord1);
        expect(trxArr.length).toEqual(1);
        expect(trxArr[0]).toStrictEqual(trxRecord1);
    });
    test('should append the 2nd record to transactions array', () => {
        const trxRecord1 = {
            id: '123',
            customerId: 'abc',
            date: '2020-01-01',
            totalLoadAmount: 100,
            totalLoads: 1
        };
        const trxArr = transactions.addTrxRecord(trxRecord2);
        expect(trxArr.length).toEqual(2);
        expect(trxArr[0]).toStrictEqual(trxRecord1);
        expect(trxArr[1]).toStrictEqual(trxRecord2);
    });
    test('should retrieve particular index of transactions array', () => {
        const record = transactions.getTrxRecord(1);
        expect(record).toStrictEqual(trxRecord2);
    });
    test('should return undefined if provided an invalid type', () => {
        const record = transactions.getTrxRecord('abc');
        expect(record).toStrictEqual(undefined);
    });
    test('should return undefined if provided an index out of bounds', () => {
        const record = transactions.getTrxRecord(1000);
        expect(record).toStrictEqual(undefined);
    });
    test('should update the record at the specified index', () => {
        const updatedRecord = {
            id: '111',
            customerId: 'bbb',
            date: '2019-12-12',
            totalLoadAmount: 100,
            totalLoads: 2
        };
        const trxArr = transactions.updateTrxRecord(0, updatedRecord);
        expect(trxArr.length).toEqual(2);
        expect(trxArr[0]).toStrictEqual(updatedRecord);
    });
    test('should retrieve the record with the customerId and the date', () => {
        const parameters = {
            customerId: 'abc',
            date: '2020-01-01'
        };
        const foundValue = transactions.findPreviousUserEntriesByDate(parameters);
        expect(foundValue).toStrictEqual(trxRecord2);
    });
    test('should retrieve undefined if record with the customerId and the date not found', () => {
        const parameters = {
            customerId: '0000',
            date: '1999-01-01'
        };
        const foundValue = transactions.findPreviousUserEntriesByDate(parameters);
        expect(foundValue).toStrictEqual(undefined);
    });
    test('should retrieve the record with the customerId and a date within a set of dates provided', () => {
        const parameters = {
            customerId: 'abc',
            dates: ['2020-01-01', '2020-02-02']
        };
        const foundValue = transactions.findAllUserRecordsWithinWeek(parameters);
        expect(foundValue).toStrictEqual([trxRecord2]);
    });
});