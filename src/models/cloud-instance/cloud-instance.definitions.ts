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

export interface ICloudInstancePongMessage extends ICloudInstanceMessage {
    id: string;
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
    domain: string;
    port: string;
    type: string;
    status: number;
    creationDate: moment.Moment;
}
