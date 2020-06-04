import { ServerRepo } from '../repository/server.repo';
import moment from 'moment';

export interface IServersMessage {
    type: ServerMessageTypes;
}
export interface IServerConnectMessage extends IServersMessage {
    address: string;
    port: string;
    connectedUser: string;
}
export interface IServerConnectionMessage extends IServersMessage {
    token: string;
}

export enum ServerMessageTypes {
    connect = 'connect',
    clientConnected = 'clientConnected',
    clientDisconnected = 'clientDisconnected',
    pong = 'pong',
}

export enum ServerStatus {
    Waiting,
    Working
}

export interface IServerModel {
    ip: string;
    _id: string;
    port: string;
    type: string;
    status: number;
    created_on: moment.Moment;
}

export class ServerModel implements IServerModel {
    _id: string
    ip: string;
    port: string;
    type: string;
    status: ServerStatus = ServerStatus.Waiting;
    created_on: moment.Moment;
    private _timer: NodeJS.Timeout;
    private _serverRepo: ServerRepo;

    constructor(serverRepo: ServerRepo, id: string) {
        this._serverRepo = serverRepo;
        this.created_on = moment();
        this._id = id;
    }

    handleMessage(data: Buffer) {
        let serverMessage = null;
        const dataString = data.toString();
        try {
            serverMessage = JSON.parse(dataString) as IServersMessage;
        } catch (err) {
            console.error('Could not handle cirrus message with data=', dataString);
            throw err;
        }
        switch (serverMessage.type) {
        case ServerMessageTypes.connect:
            const connectMessage = JSON.parse(dataString) as IServerConnectMessage;
            this._handleConnect(connectMessage);
            break;
        case ServerMessageTypes.clientConnected:
            const clientConnected = JSON.parse(dataString) as IServerConnectionMessage;
            this._handleClientConnect(clientConnected);
            break;
        case ServerMessageTypes.clientDisconnected:
            const clientDisconnected = JSON.parse(dataString) as IServerConnectionMessage;
            console.error(clientDisconnected);
            break;
        case ServerMessageTypes.pong: {
            this._heartBeat();
            break;
        }
        default:
            console.error(serverMessage.type);
        }
    }

    private _heartBeat() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            console.error('Did not receive message, remove connection');
        }, 5000);
    }

    private _handleConnect(connectMessage: IServerConnectMessage) {
        console.log('Server connected');
        clearTimeout(this._timer);
        this.ip = connectMessage.address.split('?')[0];
        this.port = connectMessage.port;
        this.type = connectMessage.address.split('?')[1];
        this._serverRepo.create(this)
            .catch(error => {
                console.error(error);
            });
    }

    private _handleClientConnect(clientConnected: IServerConnectionMessage) {
        console.error(clientConnected);
    }
}
