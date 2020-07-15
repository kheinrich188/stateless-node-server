import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceMessageTypes, ICloudInstanceMessage } from './cloud-instance.definitions';

export class UserStateHandler extends AbstractHandler {
    public async handle(request): Promise<string> {
        try {
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientConnected) {
                return `UserStateHandler: I'll handle client connect: ${request}`;
            }
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.clientDisconnected) {
                return `UserStateHandler: I'll handle client disconnect: ${request}`;
            }
        } catch (e) {
            console.error(e);
            return super.handle(request);
        }
        return super.handle(request);
    }
}
