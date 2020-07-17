import { ICloudInstanceConnectMessage } from '../src/models/cloud-instance/server-connect.handler';
import { CloudInstanceMessageTypes } from '../src/entity/cloud-instance.entity';
import { ICloudInstanceConnectionMessage } from '../src/models/cloud-instance/user-state.handler';
import { ICloudInstancePongMessage } from '../src/models/cloud-instance/server-pong.handler';

export const defaultCloudIP = () => {
    return 'i-1234.domain.tech:80?instanceType=bigOne';
};

export const connectMessage = (connectedUser: string, address: string) => {
    const m: ICloudInstanceConnectMessage = {
        type: CloudInstanceMessageTypes.connect,
        connectedUser,
        address,
        port: '80'
    };
    return Buffer.from(JSON.stringify(m));
};

export const clientConnectedMessage = (token: string) => {
    const m: ICloudInstanceConnectionMessage = {
        type: CloudInstanceMessageTypes.clientConnected,
        token,
        address: defaultCloudIP()
    };
    return Buffer.from(JSON.stringify(m));
};

export const serverPongMessage = (ip: string) => {
    const m: ICloudInstancePongMessage = {
        type: CloudInstanceMessageTypes.pong,
        ip
    };
    return Buffer.from(JSON.stringify(m));
};
