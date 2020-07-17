import { AbstractHandler } from '../abstract-handler';
import {
    CloudInstanceMessageTypes,
    CloudInstanceStatus,
    ICloudInstanceMessage
} from '../../entity/cloud-instance.entity';
import { CloudInstanceRepo } from '../../repository/cloud-instance.repo';

export interface ICloudInstanceConnectionMessage extends ICloudInstanceMessage {
    token: string;
    address: string;
}

export class UserStateHandler extends AbstractHandler {
    public async handle(request): Promise<string> {
        const cloudInstanceRepo = new CloudInstanceRepo();
        try {
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceConnectionMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientConnected) {
                await cloudInstanceRepo.updateStatus(cloudInstanceMessage.address, CloudInstanceStatus.Working);

                return Promise.resolve(`UserStateHandler: I'll handle client connect: ${request}`);
            }
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientDisconnected) {
                await cloudInstanceRepo.updateStatus(cloudInstanceMessage.address, CloudInstanceStatus.Waiting);

                return Promise.resolve(`UserStateHandler: I'll handle client disconnect: ${request}`);
            }
        } catch (e) {
            return super.handle(request);
        }
        return super.handle(request);
    }
}
