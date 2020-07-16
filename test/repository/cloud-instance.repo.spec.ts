import { afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';
import { PostgresService } from '../../src/services/postgres.service';
import { CloudInstanceStatus } from '../../src/entity/cloud-instance.entity';

describe('CloudInstance Postgres Repo', () => {
    const ciRepo = new CloudInstanceRepo();

    before(async () => {
        await new PostgresService().connect();
    });

    beforeEach(async () => {
        await ciRepo.clear();
    });

    afterEach(async () => {
        await ciRepo.clear();
    });

    it('should create a entry in db', async () => {
        await ciRepo.create('ip:port', 'ip', 'port', 'type');
        const result = await ciRepo.all();
        const entry = await ciRepo.findByIp('ip:port');
        expect(entry.ip).eq('ip:port');
        expect(result.length).eq(1);
    });

    it('should create a entry in db and update status', async () => {
        await ciRepo.create('ip:port', 'ip', 'port', 'type');
        const newEntry = await ciRepo.findByIp('ip:port');

        expect(newEntry.status).eq(CloudInstanceStatus.Waiting);

        await ciRepo.updateStatus('ip:port', CloudInstanceStatus.Working);
        const updatedEntry = await ciRepo.findByIp('ip:port');

        expect(updatedEntry.status).eq(CloudInstanceStatus.Working);
        expect(updatedEntry.version).eq(2);
    });

    it('should lock entries when write and read operation fired', async () => {
        await ciRepo.create('ip:port', 'ip', 'port', 'type');
        const newEntry = await ciRepo.findByIp('ip:port');

        expect(newEntry.status).eq(CloudInstanceStatus.Waiting);

        const waitingInstance = await ciRepo.getWaitingInstance();
        const [, secondWaitingInstance] = await Promise.all([
            ciRepo.updateStatus(waitingInstance.ip, CloudInstanceStatus.Working),
            ciRepo.getWaitingInstance()
        ]);

        expect(secondWaitingInstance).eq(undefined);

        const updatedEntry = await ciRepo.findByIp('ip:port');

        expect(updatedEntry.status).eq(CloudInstanceStatus.Working);
        expect(updatedEntry.version).eq(2);
    });

    it('should not write same status twice', async () => {
        await ciRepo.create('ip:port', 'ip', 'port', 'type');

        const [first, second] = await Promise.all([
            ciRepo.getWaitingInstance(),
            ciRepo.getWaitingInstance()
        ]);

        expect(first.ip).eq('ip:port');
        expect(second.ip).eq('ip:port');

        await ciRepo.updateStatus(first.ip, CloudInstanceStatus.Working);
        await ciRepo.updateStatus(second.ip, CloudInstanceStatus.Working)
            .catch(reason => {
                expect(reason.message).eq('status already set');
            });

        const result = await ciRepo.findByIp('ip:port');

        expect((result).status).eq(CloudInstanceStatus.Working);
        expect((result).version).eq(2);
    });
});
