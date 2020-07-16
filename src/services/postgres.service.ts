import { createConnection } from 'typeorm';

export class PostgresService {
    async connect() {
        // looks into ormconfig.json
        return await createConnection();
    }
}
