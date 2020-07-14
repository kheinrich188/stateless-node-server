import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';

describe('CloudInstance Postgres Repo', () => {
    const repo = new CloudInstanceRepo();

    beforeEach(async () => {
        await repo.clear();
    });

    afterEach(async () => {
        await repo.clear();
    });

    it('should return empty server list', async () => {
        const all = await repo.all();
        expect(all.length).to.eq(0);
    });
});
