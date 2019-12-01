var datesUtil = require('./dates');

describe('Dates Utils:', () => {
    test('should return YYYY-MM-DD formatted date', () => {
        const date = new Date('Sun Dec 01 2019 04:24:18 GMT-0500 (Eastern Standard Time)');
        expect(datesUtil.formatTimeStampToDate(date)).toEqual('2019-12-01');
    });
    test('should return YYYY-MM-DD formatted date for the first day in the week', () => {
        const date = new Date('Sun Dec 01 2019 04:24:18 GMT-0500 (Eastern Standard Time)');
        expect(datesUtil.getStartOfWeek(date)).toEqual('2019-11-25');
    });
    test('should return YYYY-MM-DD formatted date for the last day in the week', () => {
        const date = new Date('Sun Dec 01 2019 04:24:18 GMT-0500 (Eastern Standard Time)');
        expect(datesUtil.getEndOfWeek(date)).toEqual('2019-12-02');
    });
    test('should return array of dates for the given week', () => {
        const startDate = new Date('Sun Nov 25 2019 12:24:18 GMT-0500 (Eastern Standard Time)');
        const endDate = new Date('Sun Dec 1 2019 04:24:18 GMT-0500 (Eastern Standard Time)');
        const expectedArray = [
            '2019-11-25', '2019-11-26', '2019-11-27',
            '2019-11-28', '2019-11-29', '2019-11-30', '2019-12-01'
        ]
        expect(datesUtil.momentWeekRange(startDate, endDate)).toStrictEqual(expectedArray);
    });
});