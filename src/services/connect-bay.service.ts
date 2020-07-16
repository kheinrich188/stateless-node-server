import net, { Socket } from 'net';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';
import { ServerConnectHandler } from '../models/cloud-instance/server-connect.handler';
import { ServerPongHandler } from '../models/cloud-instance/server-pong.handler';
import _ from 'lodash';
import { UserStateHandler } from '../models/cloud-instance/user-state.handler';

declare module 'net' {
    interface Socket {
        ip: string;
        heartBeatInterval?: NodeJS.Timeout;
    }
}

export class ConnectBayService {
    constructor(cloudInstancePort: number) {
        this._createServer(cloudInstancePort);
    }

    private _createServer(serverPort: number) {
        const server = net.createServer((socket) => {
            const serverConnectHandler = new ServerConnectHandler();
            const heartBeatHandler = new ServerPongHandler();
            const userStateHandler = new UserStateHandler();

            serverConnectHandler
                .setNext(userStateHandler);

            socket.heartBeatInterval = null;

            socket.setNoDelay();

            socket.setTimeout(10000, () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.ip, 'Socket timeout');
            });

            socket.on('data', (data: Buffer) => {
                try {
                    // todo: validate message before handling it
                    (async () => {
                        const result = await heartBeatHandler.handle(data.toString());
                        const ip = await serverConnectHandler.handle(data.toString());
                        if (!_.isEmpty(ip)) {
                            socket.ip = ip;
                        }
                        console.error(result);
                    })();
                } catch (e) {
                    console.error(socket.ip, 'socket:data', e);
                    socket.emit('close', 1008, 'Cannot parse');
                }
            });
            socket.on('error', (error) => {
                this._clearServerConnection(socket.ip, error.message);
                // socket.destroy();
            });
            socket.on('end', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.ip, 'Socket end');
            });
            socket.on('close', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.ip, 'Socket close');
            });

            socket.on('disconnect', () => {
                this._clearServerConnection(socket.ip, 'Socket disconnect');
            });

            socket.on('timeout', () => {
                clearInterval(socket.heartBeatInterval);
                this._clearServerConnection(socket.ip, 'Socket timeout');
            });

            this._hearthBeat(socket);
        }).on('error', (error) => {
            console.error(error.message);
        });

        server.listen(serverPort, () => {
            console.info(`Server Bay starts at ws://localhost:${serverPort}`);
        });
    }

    private _hearthBeat(socket: Socket) {
        socket.heartBeatInterval = setInterval(() => {
            socket.write(JSON.stringify({ type: 'ping', ip: socket.ip }), writeError => {
                if (writeError) {
                    this._clearServerConnection(socket.ip, `Socket message error ${writeError}`);
                }
            });
        }, 1000);
    }

    private _clearServerConnection(cloudInstanceIp: string, message: string) {
        console.info(cloudInstanceIp, message);
        if (!_.isEmpty(cloudInstanceIp)) {
            (async () => {
                const cloudRepo = new CloudInstanceRepo();
                await cloudRepo.deleteByIp(cloudInstanceIp);
            })();
        }
    }
}
