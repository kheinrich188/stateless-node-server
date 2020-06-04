import * as net from 'net';
import { v4 } from 'uuid';

const server = new net.Socket();
const generateRandomClient = () => ({ query: { token: v4() } });
// const generateAwsIp = () => `http://aws-id-${v4()}`;
const generateAwsIp = () => 'http://aws-id-2b24314d-bcf6-4841-80ed-9a9ac39f3529';
const clients = [generateRandomClient()];

const address = 'localhost';
const port = 9999;
const serverPublicIp = process.env.SPI || `${generateAwsIp()}?instanceType=big`;
const serverPublicPort = process.env.SPP || 80;

const connect = () => {
    server.connect(port, address);
};

// simple re-trigger of connect function
const reconnect = () => {
    setTimeout(connect, 5000);
};

// separate connect message to handle reconnect right - otherwise it hold every opened connection
server.on('connect', () => {
    const player = clients.pop();
    let token = null;
    if (player !== undefined && player.query !== undefined) {
        token = player.query.token;
    }

    console.log(`Server connected to bay ${address}:${port}`);
    const message = {
        type: 'connect',
        address: serverPublicIp,
        port: serverPublicPort,
        connectedUser: token
    };
    server.write(JSON.stringify(message));
});
server.on('error', error => {
    console.error(error);
    console.error('Server disconnected from bay cause a error');
});
server.on('end', () => {
    console.log('Server end connection from bay');
});
server.on('close', () => {
    console.log('Server close connection to bay, try reconnect');
    reconnect();
});
server.on('timeout', () => {
    console.log('Server timeout connection to bay, try reconnect');
    server.destroy();
});
server.on('data', data => {
    try {
        const jsonData = JSON.parse(data.toString());
        if (jsonData.type === 'ping') {
            server.write(JSON.stringify({ type: 'pong' }), err => {
                if (err !== undefined) {
                    console.error(err);
                }
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});
connect();

const sendClientConnectedToBay = client => {
    const message = {
        type: 'clientConnected',
        token: client.query.token
    };
    server.write(JSON.stringify(message));
};

const sendClientDisconnectedToBay = client => {
    const message = {
        type: 'clientDisconnected',
        token: client.query.token
    };
    server.write(JSON.stringify(message));
};
