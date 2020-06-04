import express, { Application } from 'express';
import { PostgresService } from './services/postgres.service';
import { ConnectBayService } from './services/connect-bay.service';
import { ServerRepo } from './repository/server.repo';
import { Routes } from './routes/routes';
import { ApiController } from './controller/api.controller';
import bodyParser from 'body-parser';

// env
const PORT = process.env.PORT || 3000;

const app: Application = express();
const postgresService = new PostgresService();

app.use(bodyParser.json());

const serverRepo = new ServerRepo(postgresService);

Routes.setupRoutes(app, serverRepo);

postgresService.connect()
    .then(() => {
        const _ = new ConnectBayService(postgresService, 9999);
        app.listen(PORT, () => {
            console.log(`App is running in http://localhost:${PORT}`);
            setInterval(async () => {
                const result = await serverRepo.all();
                console.table(result);
            }, 5000);
        });
    });

// if something crashes last fetch here
process.on('uncaughtException', (error: Error) => {
    console.error(error);
});
