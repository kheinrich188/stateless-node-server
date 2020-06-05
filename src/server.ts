import express, { Application } from 'express';
import { PostgresService } from './services/postgres.service';
import { ConnectBayService } from './services/connect-bay.service';
import { CloudInstanceRepo } from './repository/cloud-instance.repo';
import { Routes } from './routes/routes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// initialize configuration
dotenv.config();

// env
const appPort = process.env.APP_PORT || 3000;
const cloudInstancePort = Number(process.env.CLOUD_INSTANCE_PORT) || 9999;

const app: Application = express();
const postgresService = new PostgresService();

app.use(bodyParser.json());

const cloudInstanceRepo = new CloudInstanceRepo(postgresService);

const routes = new Routes(cloudInstanceRepo);
routes.setupRoutes(app);

(async () => {
    await postgresService.connect();

    const _ = new ConnectBayService(postgresService, cloudInstancePort);

    app.listen(appPort, () => {
        console.log(`App is running in http://localhost:${appPort}`);
        setInterval(async () => {
            const result = await cloudInstanceRepo.all();
            console.table(result);
        }, 5000);
    });
})();

// if something crashes last fetch here
process.on('uncaughtException', (error: Error) => {
    console.error(error);
});
