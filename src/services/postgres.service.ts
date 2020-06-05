import { Client } from 'ts-postgres';
import { CloudInstanceTableName } from '../repository/cloud-instance.repo';

export class PostgresService {
    private readonly _client: Client;

    get client(): Client {
        return this._client;
    }

    constructor() {
        const host = process.env.POSTGRES_HOST || 'localhost';
        const port = Number(process.env.POSTGRESPORT) || 5432;
        const user = process.env.POSTGRES_USER || 'postgres';
        const password = process.env.POSTGRES_PW || '';
        const database = process.env.POSTGRES_DB || 'postgres';
        this._client = new Client({ host, port, user, password, database });
    }

    async connect(): Promise<void> {
        return this._client.connect()
            .then(() => {
                console.log('postgres connected');
                this.createTables();
            })
            .catch(error => {
                console.error(error);
            });
    }

    createTables() {
        try {
            this.client.query(
                `CREATE TABLE ${CloudInstanceTableName}
                 (
                     id         serial PRIMARY KEY,
                     _id        VARCHAR(355) UNIQUE NOT NULL,
                     ip         VARCHAR(355) UNIQUE NOT NULL,
                     port       VARCHAR(355)        NOT NULL,
                     type       VARCHAR(355)        NOT NULL,
                     status     INT                 NOT NULL,
                     created_on TIMESTAMP           NOT NULL
                 );`
            );
        } catch (e) {
            console.error(e);
        }
    }
}
