import { Client } from 'ts-postgres';

export class PostgresService {
    private readonly _client: Client;

    get client(): Client {
        return this._client;
    }

    constructor() {
        this._client = new Client({ host: 'localhost', port: 5433, user: 'konstantinheinrich', database: 'konstantinheinrich' });
    }

    connect(): Promise<Client> {
        return this._client.connect()
            .then(() => {
                console.log('postgres connected');
                this.createTables();
                return this._client;
            })
            .catch((error) => {
                throw error;
            });
    }

    createTables() {
        try {
            this.client.query(
                `CREATE TABLE server
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
