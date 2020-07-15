import { createConnection } from 'typeorm';

export class PostgresService {
    async connect() {
        // here createConnection will load connection options from
        // ormconfig.json / ormconfig.js / ormconfig.yml / ormconfig.env / ormconfig.xml
        // files, or from special environment variables
        return await createConnection();
    }
}
