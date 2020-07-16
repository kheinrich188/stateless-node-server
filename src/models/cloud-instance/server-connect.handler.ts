import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceRepo } from '../../repository/cloud-instance.repo';
import { CloudInstanceMessageTypes, ICloudInstanceMessage } from '../../entity/cloud-instance.entity';

export interface ICloudInstanceConnectMessage extends ICloudInstanceMessage {
    address: string;
    port: string;
    connectedUser: string;
}

export class ServerConnectHandler extends AbstractHandler {
    public async handle(request): Promise<string> {
        try {
            const cloudInstanceRepo = new CloudInstanceRepo();
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.connect) {
                const connectMessage = JSON.parse(request) as ICloudInstanceConnectMessage;

                const ip = connectMessage.address.split('?')[0];
                const domain = ip.split(':')[0];
                const type = connectMessage.address.split('?')[1] || '';
                const port = connectMessage.port;
                await cloudInstanceRepo.create(ip, domain, port, type);
                return ip;
            }
        } catch (e) {
            return super.handle(request);
        }
        return super.handle(request);
    }
}
