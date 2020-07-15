import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceRepo } from '../../repository/cloud-instance.repo';
import {
    CloudInstanceMessageTypes,
    ICloudInstanceConnectMessage,
    ICloudInstanceMessage
} from './cloud-instance.definitions';

export class ServerConnectHandler extends AbstractHandler {
    public async handle(request): Promise<string> {
        try {
            const cloudInstanceRepo = new CloudInstanceRepo();
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.connect) {
                const connectMessage = JSON.parse(request) as ICloudInstanceConnectMessage;

                const address = connectMessage.address.split('?')[0];
                const domain = address.split(':')[0];
                const type = connectMessage.address.split('?')[1];
                const port = connectMessage.port;

                await cloudInstanceRepo.create(address, domain, port, type);
                return address;
            }
        } catch (e) {
            console.error(e);
            return super.handle(request);
        }
        return super.handle(request);
    }
}
