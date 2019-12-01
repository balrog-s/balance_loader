var ids = require('./ids');

describe('Ids Store:', () => {
    test('should append the new record to processed ids array', () => {
        const idsArr = ids.addIdHistoryRecord({id: 'foo', customerId: 'bar'});
        expect(idsArr.length).toBe(1);
        expect(idsArr[0]).toStrictEqual({id: 'foo', customerId: 'bar'});
    });
    test('should return true if id with customer id has been stored', () => {
        ids.addIdHistoryRecord({id: 'foo', customerId: 'bar'});
        const idComboinationExists = ids.wasIDForCustomerAlreadyProcessed({id: 'foo', customerId: 'bar'});
        expect(idComboinationExists).toBe(true);
    });
    test('should return false if record being searched has not been previously stored (different customerId)', () => {
        ids.addIdHistoryRecord({id: 'foo', customerId: 'bar'});
        const idComboinationExists = ids.wasIDForCustomerAlreadyProcessed({id: 'foo', customerId: 'test'});
        expect(idComboinationExists).toBe(false);
    });
    test('should return false if record being searched has not been previously stored (different id)', () => {
        ids.addIdHistoryRecord({id: 'foo', customerId: 'bar'});
        const idComboinationExists = ids.wasIDForCustomerAlreadyProcessed({id: 'unit', customerId: 'bar'});
        expect(idComboinationExists).toBe(false);
    });
});