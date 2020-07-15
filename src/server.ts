import 'reflect-metadata';
import express, { Application } from 'express';
import { ConnectBayService } from './services/connect-bay.service';
import { CloudInstanceRepo } from './repository/cloud-instance.repo';
import { Routes } from './routes/routes';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import { PostgresService } from './services/postgres.service';

// create server
const app: Application = express();

// initialize configuration
dotEnv.config();

// bootstrap
app.use(bodyParser.json());

// env
const appPort = process.env.APP_PORT || 3000;
const cloudInstancePort = Number(process.env.CLOUD_INSTANCE_PORT) || 9999;

// setup routes for controllers
Routes.setupRoutes(app);

// starts application
(async () => {
    await new PostgresService().connect();

    const cloudInstanceRepo = new CloudInstanceRepo();
    const _ = new ConnectBayService(cloudInstancePort);

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
    console.error(error.message);
});
