var validation = require('./validation');
var ids = require('../store/ids');
var transactions = require('../store/transactions');
var currencyUtils = require('../utils/currency');

jest.mock('../store/transactions');

describe('Validation:', () => {
    test('should call ids data store with provided id and customerId', () => {
        const idsSpy = spyOn(ids, 'wasIDForCustomerAlreadyProcessed');
        validation.isIDAlreadyProcessed({id: '123', customerId: 'abc'});
        expect(idsSpy).toHaveBeenCalledWith({id: '123', customerId: 'abc'});
    });
    test('should check if the provided initial loadAmount is invalid (false)', () => {
        const currencyUtilsSpy1 = spyOn(currencyUtils, 'amountOverDailyLimit');
        const currencyUtilsSpy2 = spyOn(currencyUtils, 'amountIsNegative');
        validation.isInvalidInitialAmount({loadAmount: 2000});
        expect(currencyUtilsSpy1).toHaveBeenCalledWith(2000);
        expect(currencyUtilsSpy2).toHaveBeenCalledWith(2000);
    });
    test('should check if the provided initial loadAmount is invalid (true negative amount)', () => {
        const currencyUtilsSpy1 = spyOn(currencyUtils, 'amountOverDailyLimit');
        const currencyUtilsSpy2 = spyOn(currencyUtils, 'amountIsNegative');
        validation.isInvalidInitialAmount({loadAmount: -2000});
        expect(currencyUtilsSpy1).toHaveBeenCalledWith(-2000);
        expect(currencyUtilsSpy2).toHaveBeenCalledWith(-2000);
    });
    test('should check if the provided initial loadAmount is invalid (true over daily limit)', () => {
        const currencyUtilsSpy1 = spyOn(currencyUtils, 'amountOverDailyLimit');
        const currencyUtilsSpy2 = spyOn(currencyUtils, 'amountIsNegative');
        validation.isInvalidInitialAmount({loadAmount: 6000});
        expect(currencyUtilsSpy1).toHaveBeenCalledWith(6000);
        expect(currencyUtilsSpy2).toHaveBeenCalledWith(6000);
    });
    test('should check if the daily limit is reached (false, is not within limits)', () => {
        transactions.findAllUserRecordsWithinWeek.mockImplementation(() => ([]));
        const userEntriesByDay = {
            totalLoadAmount: 5000,
            totalLoads: 1,
            date: '2020-01-01',
            customerId: '123',
            id: '1'
        };
        const loadAmount = 1;
        const result = validation.withinDailyAndWeeklyLimits({
            userEntriesByDay,
            loadAmount,
            customerId: '123',
            dates: ['2020-01-01', '2020-01-02']
        });
        expect(result).toEqual(false);
        transactions.findAllUserRecordsWithinWeek.mockReset();
    });
    test('should check if the daily limit is reached (true, is not within limits)', () => {
        transactions.findAllUserRecordsWithinWeek.mockImplementation(() => ([]));
        const userEntriesByDay = {
            totalLoadAmount: 3000,
            totalLoads: 1,
            date: '2020-01-01',
            customerId: '123',
            id: '1'
        };
        const loadAmount = 100;
        const result = validation.withinDailyAndWeeklyLimits({
            userEntriesByDay,
            loadAmount,
            customerId: '123',
            dates: ['2020-01-01', '2020-01-02']
        });
        expect(result).toEqual(true);
        transactions.findAllUserRecordsWithinWeek.mockReset();
    });
    test('should check if the weekly limit is reached (true, is not within limits)', () => {
        transactions.findAllUserRecordsWithinWeek.mockImplementation(() => ([{totalLoadAmount: 10000}, {totalLoadAmount: 10000}, {totalLoadAmount: 10000}]));
        const userEntriesByDay = {
            totalLoadAmount: 4000,
            totalLoads: 1,
            date: '2020-01-01',
            customerId: '123',
            id: '1'
        };
        const loadAmount = 100;
        const result = validation.withinDailyAndWeeklyLimits({
            userEntriesByDay,
            loadAmount,
            customerId: '123',
            dates: ['2020-01-01', '2020-01-02', '2020-01-03']
        });
        expect(transactions.findAllUserRecordsWithinWeek.mock.calls[0].length).toEqual(1);
        expect(result).toEqual(false);
        transactions.findAllUserRecordsWithinWeek.mockReset();
    });
});