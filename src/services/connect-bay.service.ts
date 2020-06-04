import net, { Server, Socket } from 'net';
import { v4 } from 'uuid';
import { ServerModel } from '../models/server.model';
import { PostgresService } from './postgres.service';
import { ServerRepo } from '../repository/server.repo';

declare module 'net' {
    interface Socket {
        id: string;
        heartBeatInterval?: NodeJS.Timeout;
    }
}

export class ConnectBayService {
    private _server: Server;
    private serverRepo: ServerRepo;

    constructor(postgresService: PostgresService, serverPort: number) {
        this.serverRepo = new ServerRepo(postgresService);
        this._createServer(serverPort);
    }

    private _createServer(serverPort: number) {
        this._server = net.createServer((socket) => {
            socket.heartBeatInterval = null;
            socket.setNoDelay();
            socket.setTimeout(10000, () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.id, 'Socket timeout');
            });

            socket.id = v4();

            const serverModel = new ServerModel(this.serverRepo, socket.id);
            socket.on('data', (data: Buffer) => {
                try {
                    // todo: validate message before handling it
                    serverModel.handleMessage(data);
                    // console.error(data);
                } catch (e) {
                    console.error(socket.id, 'socket:data', e);
                    socket.emit('close', 1008, 'Cannot parse');
                }
            });
            socket.on('error', (error) => {
                this._clearServerConnection(socket.id, error.message);
                // socket.destroy();
            });
            socket.on('end', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.id, 'Socket end');
            });
            socket.on('close', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.id, 'Socket close');
            });

            socket.on('disconnect', () => {
                this._clearServerConnection(socket.id, 'Socket disconnect');
            });

            socket.on('timeout', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.id, 'Socket timeout');
            });

            this._hearthBeat(socket);
        }).on('error', (error) => {
            console.error(error.message);
        });

        this._server.listen(serverPort, () => {
            console.info(`Server Bay starts at ws://localhost:${serverPort}`);
        });
    }

    private _hearthBeat(socket: Socket) {
        socket.heartBeatInterval = setInterval(() => {
            socket.write(JSON.stringify({ type: 'ping' }), (err) => {
                if (err !== undefined) {
                    this._clearServerConnection(socket.id, 'Socket message error');
                }
            });
        }, 1000);
    }

    private _clearServerConnection(socketId: string, message: string) {
        console.info(socketId, message);
        this.serverRepo.delete(socketId);
    }
}
