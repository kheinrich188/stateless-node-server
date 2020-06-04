import { zipObject } from 'lodash';
import { PostgresService } from '../services/postgres.service';

export type IAccountModel = {
    user_id: string,
    username: string,
    password: string,
    email:string,
    created_on: Date,
    last_login: Date,
}

const AccountQueries = {
    SelectAll: 'SELECT * FROM account',
    UpdateName: 'UPDATE account SET username = $1 where user_id = $2'
};

export class AccountModel {
    private postgresService: PostgresService;

    constructor(postgresService: PostgresService) {
        this.postgresService = postgresService;
    }

    async all(): Promise<IAccountModel[]> {
        try {
            const result = await this.postgresService.client
                .query(AccountQueries.SelectAll);

            const jsonResult: IAccountModel[] = [];

            for (const row of result) {
                const am = zipObject(row.names, row.data) as IAccountModel;
                jsonResult.push(am);
            }
            return jsonResult;
        } catch (e) {
            console.error(e);
        }
    }

    async update(name: string, id: string): Promise<string> {
        try {
            const result = await this.postgresService.client
                .query(AccountQueries.UpdateName, [name, id]);

            return result.status;
        } catch (e) {
            console.error(e);
        }
    }
}
