var currencyUtils = require('./currency');

describe('Currency Utils:', () => {
    test('should return true if provided value is over 5000', () => {
        expect(currencyUtils.amountOverDailyLimit(6000)).toEqual(true);
    });
    test('should return false if provided value is less than 5000', () => {
        expect(currencyUtils.amountOverDailyLimit(4000)).toEqual(false);
    });
    test('should return false if provided value is string', () => {
        expect(currencyUtils.amountOverDailyLimit('test')).toEqual(false);
    });
    test('should return false if provided value is undefined', () => {
        expect(currencyUtils.amountOverDailyLimit(undefined)).toEqual(false);
    });
    test('should return true if value provided is negative', () => {
        expect(currencyUtils.amountIsNegative(-100)).toEqual(true);
    });
    test('should return false if value provided is negative', () => {
        expect(currencyUtils.amountIsNegative(100)).toEqual(false);
    });
    test('should return string with $s removed', () => {
        expect(currencyUtils.removeDollarSigns('$100.00')).toEqual('100.00');
    });
    test('should return string with $s removed', () => {
        expect(currencyUtils.removeDollarSigns('$$$100.00')).toEqual('100.00');
    });
    test('should return float', () => {
        expect(currencyUtils.parseStringToFloat('100.00')).toEqual(100.00);
    });
    test('should return float', () => {
        expect(currencyUtils.parseStringToFloat('100.79')).toEqual(100.79);
    });
    test('should sanitize string values provided to numeric values', () => {
        const loadAmount = '$1032.88';
        expect(currencyUtils.sanitizeLoadAmountValue(loadAmount)).toEqual(1032.88);
    });
});