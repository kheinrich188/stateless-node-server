import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceMessageTypes, ICloudInstanceMessage } from '../../entity/cloud-instance.entity';
import { CloudInstanceRepo } from '../../repository/cloud-instance.repo';
import { log } from '../../services/logger.service';

export interface ICloudInstancePongMessage extends ICloudInstanceMessage {
    ip: string;
}

export class ServerPongHandler extends AbstractHandler {
    private _timer: NodeJS.Timeout;
    public async handle(request): Promise<string> {
        try {
            const cloudInstanceMessage = JSON.parse(request) as ICloudInstanceMessage;
            if (cloudInstanceMessage.type === CloudInstanceMessageTypes.pong) {
                const pongMessage = JSON.parse(request) as ICloudInstancePongMessage;
                clearTimeout(this._timer);
                this._timer = setTimeout((args: ICloudInstancePongMessage) => {
                    log.warn(() => `HeartBeatHandler: I'll timeout the ${args.ip}.`);
                    const cloudInstanceRepo = new CloudInstanceRepo();
                    cloudInstanceRepo.deleteByIp(args.ip);
                }, 5000, pongMessage);
                return Promise.resolve<string>(`HeartBeatHandler: I'll process the ${request}.`);
            }
        } catch (error) {
            log.error('ServerPongHandler', error);
            return super.handle(request);
        }
        return super.handle(request);
    }
}
