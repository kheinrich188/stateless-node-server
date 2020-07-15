import { afterEach, beforeEach, describe, it } from 'mocha';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';

chai.use(sinonChai);

describe('CloudInstance Model', () => {
    const repo = new CloudInstanceRepo();
    beforeEach(async () => {
        await repo.clear();
    });
    afterEach(async () => {
        await repo.clear();
    });
});
