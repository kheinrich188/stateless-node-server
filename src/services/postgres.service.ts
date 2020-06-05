import { Client } from 'ts-postgres';

export class PostgresService {
    private readonly _client: Client;

    get client(): Client {
        return this._client;
    }

    constructor() {
        const port = Number(process.env.POSTGRESPORT) || 5432;
        this._client = new Client({ host: 'localhost', port, user: 'postgres', database: 'postgres' });
    }

    connect(): Promise<Client> {
        return this._client.connect()
            .then(() => {
                console.log('postgres connected');
                this.createTables();
                return this._client;
            });
    }

    createTables() {
        try {
            this.client.query(
                `CREATE TABLE cloudinstances
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
