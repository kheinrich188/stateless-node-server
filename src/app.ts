import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { Routes } from './routes/routes';
import { PostgresService } from './services/postgres.service';
import { CloudInstanceRepo } from './repository/cloud-instance.repo';
import { ConnectBayService } from './services/connect-bay.service';
import { isEmpty } from 'lodash';
import { log } from './services/logger.service';

export default class App {
    public app: Application;
    public port: number = Number(process.env.APP_PORT) || 3000;

    constructor() {
        this.app = express();

        (async () => {
            this._bootstrap();
            this._setupRoutes();
            await this._setupServices();
        })();
    }

    public listen() {
        this.app.listen(this.port, () => {
            log.info(() => `App listening on the port ${this.port}`);
        });
    }

    private _bootstrap() {
        // bootstrap
        this.app.use(bodyParser.json());
    }

    private _setupRoutes() {
        // setup routes for controllers
        Routes.setupRoutes(this.app);
    }

    private async _setupServices() {
        const postgresService = new PostgresService();
        const cloudInstanceRepo = new CloudInstanceRepo();
        const connectBay = new ConnectBayService();

        // connect to db
        await postgresService.connect()
            .catch(error => {
                log.error(() => '_setupServices db connect', error);
            });

        // opens websocket server for cloud instances
        connectBay.openCloudInstanceConnections()
            .subscribe((message) => {
                log.debug(() => message);
            }, async (error) => {
                log.error(() => '_setupServices cloud instance ws', error);
                if (!isEmpty(error.ip)) {
                    await cloudInstanceRepo.deleteByIp(error.ip);
                }
            });
    }
}
