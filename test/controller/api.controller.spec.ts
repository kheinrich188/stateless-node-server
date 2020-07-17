import { after, afterEach, before, beforeEach, describe, it, teardown } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';
import request from 'supertest';
import { ROUTES } from '../../src/routes/routes';
import { CloudInstanceEntity } from '../../src/entity/cloud-instance.entity';
import App from '../../src/app';
import { PostgresService } from '../../src/services/postgres.service';

const app = new App().app;
const api = request(app);

describe('ApiController', () => {
    const postgresService = new PostgresService();

    afterEach(() => {
        sinon.restore();
    });

    after(async () => {
        await postgresService.disconnect();
    });

    describe('state', () => {
        it('should return default empty state', done => {
            sinon.stub(CloudInstanceRepo.prototype, 'all').resolves([]);
            const expectedResult = { result: [] };
            api
                .get(ROUTES.Api.state)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => expect(res.body).deep.eq(expectedResult))
                .then(() => done());
        });

        it('should return filled state', done => {
            const element = new CloudInstanceEntity();
            element.ip = 'ip';
            sinon.stub(CloudInstanceRepo.prototype, 'all').resolves([element]);
            const expectedResult = { result: [{ ip: 'ip' }] };
            api
                .get(ROUTES.Api.state)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => expect(res.body).deep.eq(expectedResult))
                .then(() => done());
        });
    });
});
