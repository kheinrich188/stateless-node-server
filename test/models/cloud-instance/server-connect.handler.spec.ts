import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { ServerConnectHandler } from '../../../src/models/cloud-instance/server-connect.handler';
import sinon, { assert, SinonSpy, SinonStub } from 'sinon';
import { CloudInstanceRepo } from '../../../src/repository/cloud-instance.repo';
import { clientConnectedMessage, connectMessage, defaultCloudIP } from '../../utils';

describe('Server Connect Handler', () => {
    let serverConnectHandler: ServerConnectHandler;
    let repoCreateSpy: SinonStub;
    beforeEach(async () => {
        serverConnectHandler = new ServerConnectHandler();
        repoCreateSpy = sinon.stub(CloudInstanceRepo.prototype, 'create').resolves(await Promise.resolve());
    });

    afterEach(() => {
        repoCreateSpy.restore();
    });

    it('should handle message and return ip', async () => {
        const cm = connectMessage(null, defaultCloudIP());

        const result = await serverConnectHandler.handle(cm.toString());

        assert.calledOnce(repoCreateSpy);
        assert.calledWith(repoCreateSpy, 'i-1234.domain.tech:80', 'i-1234.domain.tech', '80', 'instanceType=bigOne');
        expect(result).eq('i-1234.domain.tech:80');
    });

    it('should handle message with incomplete url format', async () => {
        const cm = connectMessage(null, 'i-1234.domain.tech');

        const result = await serverConnectHandler.handle(cm.toString());

        assert.calledOnce(repoCreateSpy);
        assert.calledWith(repoCreateSpy, 'i-1234.domain.tech', 'i-1234.domain.tech', '80', '');
        expect(result).eq('i-1234.domain.tech');
    });

    it('should skip message with other type', async () => {
        const ccm = clientConnectedMessage('token');

        const result = await serverConnectHandler.handle(ccm.toString());

        expect(result).eq(null);
    });
});
