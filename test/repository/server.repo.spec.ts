import { before, describe, it } from 'mocha';
import { PostgresService } from '../../src/services/postgres.service';
import { expect } from 'chai';
import { CloudInstanceRepo } from '../../src/repository/server.repo';

describe('Server Postgres Repo', () => {
    const dbService = new PostgresService();
    before(async () => {
        await dbService.connect();
    });

    it('should return empty server list', async () => {
        const serverRepo = new CloudInstanceRepo(dbService);
        const all = await serverRepo.all();
        expect(all.length).to.eq(0);
    });
});
