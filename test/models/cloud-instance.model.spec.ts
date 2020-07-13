import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import {
    CloudInstanceModel,
    CloudInstanceStatus
} from '../../src/models/cloud-instance.model';
import { connectMessage, defaultCloudIP } from '../utils';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';
import _ from 'lodash';

chai.use(sinonChai);

describe('CloudInstance Model', () => {
    let model: CloudInstanceModel;
    const repo = new CloudInstanceRepo();
    beforeEach(async () => {
        await repo.clear();
        model = new CloudInstanceModel('socketId');
    });
    afterEach(async () => {
        await repo.clear();
    });

    it('should instantiate', () => {
        expect(model.status).to.eq(CloudInstanceStatus.Waiting);
        expect(model.ip).to.eq(undefined);
        expect(model._id).to.eq('socketId');
    });

    it('should handle message', async () => {
        const cm = connectMessage(null, defaultCloudIP());
        await model.handleMessage(cm);
        expect(model.ip).eq('i-1234.domain.tech');
        const all = await repo.all();
        console.error(all);
        const storedItem = _.first(all);
        expect(storedItem.ip).eq('');
    });
});
