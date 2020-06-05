import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import {
    CloudInstanceModel,
    CloudInstanceStatus
} from '../../src/models/cloud-instance.model';
import { CloudInstanceRepo } from '../../src/repository/cloud-instance.repo';

chai.use(sinonChai);

describe('CloudInstance Model', () => {
    let model: CloudInstanceModel;
    const cloudInstanceRepoStub = sinon.createStubInstance(CloudInstanceRepo) as any;
    beforeEach(() => {
        model = new CloudInstanceModel(cloudInstanceRepoStub, 'socketId');
    });
    afterEach(() => {

    });

    it('should instantiate', () => {
        expect(model.status).to.eq(CloudInstanceStatus.Waiting);
        expect(model.ip).to.eq(undefined);
        expect(model._id).to.eq('socketId');
    });
});
