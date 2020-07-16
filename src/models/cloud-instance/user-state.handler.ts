import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceMessageTypes, ICloudInstanceMessage } from '../../entity/cloud-instance.entity';

export interface ICloudInstanceConnectionMessage extends ICloudInstanceMessage {
    token: string;
}

export class UserStateHandler extends AbstractHandler {
    public async handle(request): Promise<string> {
        try {
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientConnected) {
                return Promise.resolve(`UserStateHandler: I'll handle client connect: ${request}`);
            }
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientDisconnected) {
                return Promise.resolve(`UserStateHandler: I'll handle client disconnect: ${request}`);
            }
        } catch (e) {
            return super.handle(request);
        }
        return super.handle(request);
    }
}
