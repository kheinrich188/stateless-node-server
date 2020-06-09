import ioClient from 'socket.io-client';
import { v4 } from 'uuid';
import bent from 'bent';

const token = v4();
const getJSON = bent('json');

const requestIpFromMatchmakerBay = () => {
    (async () => {
        const response = await getJSON('http://localhost:3000/api/requestCloudInstance');
        // @ts-ignore
        connectToCloudInstance(response.ip);
    })();
};

const connectToCloudInstance = (cloudInstanceIp: string) => {
    const ws = ioClient(`ws://${cloudInstanceIp}`, {
        query: {
            token
        },
        transports: ['websocket']
    });

    ws.on('connect', () => {
        console.log(`Connect to ${cloudInstanceIp}`);
    });

    ws.on('error', (error: Error) => {
        console.error('error', error);
    });

    ws.on('disconnect', (reason: string) => {
        console.warn('disconnect', reason);
    });

    ws.on('timeout', () => {
        console.warn('timeout');
    });
};

requestIpFromMatchmakerBay();
