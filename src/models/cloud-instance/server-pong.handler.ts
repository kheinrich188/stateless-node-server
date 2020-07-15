import { AbstractHandler } from '../abstract-handler';
import { CloudInstanceMessageTypes, ICloudInstanceMessage } from '../../entity/cloud-instance.entity';

export interface ICloudInstancePongMessage extends ICloudInstanceMessage {
    id: string;
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
                    return `HeartBeatHandler: I'll timeout the ${args.id}.`;
                }, 5000, pongMessage);
                return `HeartBeatHandler: I'll process the ${request}.`;
            }
        } catch (e) {
            console.error(e);
            return super.handle(request);
        }
        return super.handle(request);
    }
}
