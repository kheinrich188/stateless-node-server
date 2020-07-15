import * as net from 'net';
import { v4 } from 'uuid';
import { Server } from 'http';
import express, { Application } from 'express';
import io, { Socket } from 'socket.io';
import { isEmpty } from 'lodash';

interface IClient {
    ws: Socket;
    id: string;
    token: string;
}

const app: Application = express();
const httpApp = new Server(app);
const clientIOServer = io(httpApp);

const server = new net.Socket();
const clients: IClient[] = [];

const address = 'localhost';
const port = 9999;
const serverPublicIp = process.env.CLOUD_ADDRESS || 'localhost:8081?instanceType=big';
const serverPublicPort = process.env.CLOUD_ADRESS_PORT || 8081;

httpApp.listen(serverPublicPort);

// MARK: Client connection handling
clientIOServer.on('connection', socket => {
    const client = handleClientConnect(socket);

    sendClientConnectedToBay(client);
});

const handleClientConnect = (ws: Socket): IClient => {
    const id = v4();
    const client: IClient = { ws: ws, id, token: ws.handshake.query.token };
    clients.push(client);
    ws.on('disconnect', function () {
        console.log(`client ${id} disconnected`);
        removeClient(id);
    });

    ws.on('close', function (code, reason) {
        console.log(`client ${id} connection closed: ${code} - ${reason}`);
        removeClient(id);
    });

    ws.on('error', function (err) {
        console.log(`client ${id} connection error: ${err}`);
        removeClient(id);
    });

    return client;
};

const removeClient = (client: any) => {
    const idx = clients.map(c => c.ws).indexOf(client.ws);
    clients.splice(idx, 1);
    sendClientDisconnectedToBay(client);
};

// MARK: Connect to Matchmaker Bay
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
    if (!isEmpty(player) && !isEmpty(player.token)) {
        token = player.token;
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
            server.write(JSON.stringify({ type: 'pong' }), writeError => {
                if (writeError) {
                    console.error(writeError);
                }
            });
        }
    } catch (err) {
        console.error(err.message);
    }
});
connect();

const sendClientConnectedToBay = (client: IClient) => {
    const message = {
        type: 'clientConnected',
        token: client.token
    };
    server.write(JSON.stringify(message));
};

const sendClientDisconnectedToBay = (client: IClient) => {
    const message = {
        type: 'clientDisconnected',
        token: client.token
    };
    server.write(JSON.stringify(message));
};
