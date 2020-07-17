import net, { Socket } from 'net';
import { ServerConnectHandler } from '../models/cloud-instance/server-connect.handler';
import { ServerPongHandler } from '../models/cloud-instance/server-pong.handler';
import _ from 'lodash';
import { UserStateHandler } from '../models/cloud-instance/user-state.handler';
import { Observable } from 'rxjs';

declare module 'net' {
    interface Socket {
        ip: string;
        heartBeatInterval?: NodeJS.Timeout;
    }
}

export class ConnectBayService {
    openCloudInstanceConnections(): Observable<string> {
        const CLOUD_INSTANCE_PORT = process.env.CLOUD_INSTANCE_PORT || 9999;

        return new Observable<string>((subscriber) => {
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
                    subscriber.error({ ip: socket.ip, message: 'Socket timeout' });
                });

                socket.on('data', (data: Buffer) => {
                    try {
                        // todo: validate message before handling it
                        (async () => {
                            const result = await heartBeatHandler.handle(data.toString());
                            const ip = await serverConnectHandler.handle(data.toString());
                            if (!_.isEmpty(ip)) {
                                socket.ip = ip;
                                subscriber.next(`New Instance connected: ${ip}`);
                            }
                            console.debug(result);
                        })();
                    } catch (e) {
                        socket.emit('close', 1008, 'Cannot parse');
                    }
                });
                socket.on('error', (error) => {
                    subscriber.error({ ip: socket.ip, message: error.message });
                    // socket.destroy();
                });
                socket.on('end', () => {
                    clearInterval(socket.heartBeatInterval);
                    subscriber.error({ ip: socket.ip, message: 'Socket end' });
                });
                socket.on('close', () => {
                    clearInterval(socket.heartBeatInterval);
                    subscriber.error({ ip: socket.ip, message: 'Socket end' });
                });
                socket.on('disconnect', () => {
                    subscriber.error({ ip: socket.ip, message: 'Socket disconnect' });
                });
                socket.on('timeout', () => {
                    clearInterval(socket.heartBeatInterval);
                    subscriber.error({ ip: socket.ip, message: 'Socket timeout' });
                });

                socket.heartBeatInterval = setInterval(() => {
                    socket.write(JSON.stringify({ type: 'ping', ip: socket.ip }), writeError => {
                        if (writeError) {
                            subscriber.error({ ip: socket.ip, message: writeError.message });
                        }
                    });
                }, 1000);
            });

            server.listen(CLOUD_INSTANCE_PORT, () => {
                subscriber.next(`Server Bay starts at ws://localhost:${CLOUD_INSTANCE_PORT}`);
            });
        });
    }
}
