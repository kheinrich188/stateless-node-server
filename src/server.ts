import express, { Application } from 'express';
import { PostgresService } from './services/postgres.service';
import { ConnectBayService } from './services/connect-bay.service';
import { ServerRepo } from './repository/server.repo';

const app: Application = express();
const postgresService = new PostgresService();
const _ = new ConnectBayService(postgresService, 9999);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
    postgresService.connect()
        .then(() => {
            const serverRepo = new ServerRepo(postgresService);

            setInterval(async () => {
                const result = await serverRepo.all();
                console.table(result);
            }, 5000);
        });
});
