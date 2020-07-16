import { afterEach, beforeEach, describe, it } from 'mocha';
import { connectMessage, serverPongMessage } from '../../utils';
import { ServerPongHandler } from '../../../src/models/cloud-instance/server-pong.handler';
import { expect } from 'chai';
import sinon, { assert, SinonStub } from 'sinon';
import { CloudInstanceRepo } from '../../../src/repository/cloud-instance.repo';

describe('Server Pong Handler', () => {
    let serverPongHandler: ServerPongHandler;
    let ciRepoDeleteByIpStub: SinonStub;
    beforeEach(async () => {
        serverPongHandler = new ServerPongHandler();
        ciRepoDeleteByIpStub = sinon.stub(CloudInstanceRepo.prototype, 'deleteByIp').resolves();
    });

    afterEach(() => {
        ciRepoDeleteByIpStub.restore();
    });

    it('should handle message and throw timeout', (done) => {
        const spm = serverPongMessage('i-1234.domain.tech:80');
        serverPongHandler.handle(spm);
        setTimeout(() => {
            assert.calledWith(ciRepoDeleteByIpStub, 'i-1234.domain.tech:80');
            done();
        }, 5700);
    }).timeout(6000);

    it('should handle unknown message', (done) => {
        const cm = connectMessage(null, 'i-1234.domain.tech:80');
        serverPongHandler.handle(cm)
            .then(result => {
                expect(result).eq(null);
                done();
            });
    });

    it('should timeout the right handler', (done) => {
        const serverPongHandler1 = serverPongHandler;
        const serverPongHandler2 = new ServerPongHandler();
        const spm1 = serverPongMessage('i-1234.domain.tech:80');
        const spm2 = serverPongMessage('i-4321.domain.tech:80');

        serverPongHandler1.handle(spm1);
        serverPongHandler2.handle(spm2);

        setInterval(() => {
            serverPongHandler1.handle(spm1);
        }, 1000);

        setTimeout(() => {
            assert.calledWith(ciRepoDeleteByIpStub, 'i-4321.domain.tech:80');
            done();
        }, 5700);
    }).timeout(6000);
});
