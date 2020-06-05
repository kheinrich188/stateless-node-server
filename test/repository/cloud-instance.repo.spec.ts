import { before, describe, it } from 'mocha';
import { PostgresService } from '../../src/services/postgres.service';
import { expect } from 'chai';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';

describe('CloudInstance Postgres Repo', () => {
    const dbService = new PostgresService();
    before(async () => {
        await dbService.connect();
    });

    it('should return empty server list', async () => {
        const cloudInstanceRepo = new CloudInstanceRepo(dbService);
        const all = await cloudInstanceRepo.all();
        expect(all.length).to.eq(0);
    });
});
