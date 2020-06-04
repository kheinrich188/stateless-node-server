import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { AccountModel } from '../../src/models/account.model';
import { PostgresService } from '../../src/services/postgres.service';

describe('Account', () => {
    const dbService = new PostgresService();
    before(async () => {
        await dbService.connect();
    });

    it('should return 1 account model', async () => {
        const accountModel = new AccountModel(dbService);
        const all = await accountModel.all();
        expect(all.length).to.eq(1);
    });
    it('should update account model', async () => {
        const accountModel = new AccountModel(dbService);
        const status = await accountModel.update('unit-test', '1');
        expect(status).to.eq('UPDATE 1');
        const all = await accountModel.all();
        expect(all[0].username).to.eq('unit-test');
    });
    it('should update account twice model', async () => {
        const accountModel1 = new AccountModel(dbService);
        const accountModel2 = new AccountModel(dbService);
        const status1 = await accountModel1.update('unit-test', '1');
        const status2 = await accountModel2.update('unit-test1', '1');
        expect(status1).to.eq('UPDATE 1');
        expect(status2).to.eq('UPDATE 1');
        const all1 = await accountModel1.all();
        const all2 = await accountModel1.all();
        expect(all1[0].username).to.eq('unit-test1');
        expect(all2[0].username).to.eq('unit-test1');
    });
});
