import { CloudInstanceMessageTypes, ICloudInstanceConnectMessage } from '../src/models/cloud-instance.model';

export const defaultCloudIP = () => {
    return 'i-1234.domain.tech?instanceType=bigOne';
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
