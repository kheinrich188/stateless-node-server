import { CloudInstanceRepo } from '../repository/cloud-instance.repo';
import moment from 'moment';

export interface ICloudInstanceMessage {
    type: CloudInstanceMessageTypes;
}
export interface ICloudInstanceConnectMessage extends ICloudInstanceMessage {
    address: string;
    port: string;
    connectedUser: string;
}
export interface ICloudInstanceConnectionMessage extends ICloudInstanceMessage {
    token: string;
}

export enum CloudInstanceMessageTypes {
    connect = 'connect',
    clientConnected = 'clientConnected',
    clientDisconnected = 'clientDisconnected',
    pong = 'pong',
}

export enum CloudInstanceStatus {
    Waiting,
    Working
}

export type ICloudInstance = {
    ip: string;
    _id: string;
    port: string;
    type: string;
    status: number;
    created_on: moment.Moment;
}

export class CloudInstanceModel implements ICloudInstance {
    _id: string
    ip: string;
    port: string;
    type: string;
    status: CloudInstanceStatus = CloudInstanceStatus.Waiting;
    created_on: moment.Moment;
    private _timer: NodeJS.Timeout;
    private _cloudInstanceRepo: CloudInstanceRepo;

    constructor(id: string) {
        this._cloudInstanceRepo = new CloudInstanceRepo();
        this.created_on = moment();
        this._id = id;
    }

    async handleMessage(data: Buffer) {
        let cloudInstanceMessage = null;
        const dataString = data.toString();
        try {
            cloudInstanceMessage = JSON.parse(dataString) as ICloudInstanceMessage;
        } catch (err) {
            console.error('Could not handle cirrus message with data=', dataString);
            throw err;
        }
        switch (cloudInstanceMessage.type) {
        case CloudInstanceMessageTypes.connect:
            const connectMessage = JSON.parse(dataString) as ICloudInstanceConnectMessage;
            await this._handleConnect(connectMessage);
            break;
        case CloudInstanceMessageTypes.clientConnected:
            const clientConnected = JSON.parse(dataString) as ICloudInstanceConnectionMessage;
            await this._handleClientConnect(clientConnected);
            break;
        case CloudInstanceMessageTypes.clientDisconnected:
            const clientDisconnected = JSON.parse(dataString) as ICloudInstanceConnectionMessage;
            await this._handleClientDisconnect(clientDisconnected);
            console.error(clientDisconnected);
            break;
        case CloudInstanceMessageTypes.pong: {
            this._heartBeat();
            break;
        }
        default:
            console.error(cloudInstanceMessage.type);
        }
    }

    private _heartBeat() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            console.error('Did not receive message, remove connection');
        }, 5000);
    }

    private async _handleConnect(connectMessage: ICloudInstanceConnectMessage) {
        console.log('Server connected');
        clearTimeout(this._timer);
        this.ip = connectMessage.address.split('?')[0];
        this.port = connectMessage.port;
        this.type = connectMessage.address.split('?')[1];
        await this._cloudInstanceRepo.create(this)
            .catch(error => {
                console.error(error);
            });
    }

    private async _handleClientConnect(clientConnected: ICloudInstanceConnectionMessage) {
        console.error(clientConnected, this.ip);
    }

    private async _handleClientDisconnect(clientDisconnected: ICloudInstanceConnectionMessage) {
        console.error(clientDisconnected, this.ip);
    }
}
