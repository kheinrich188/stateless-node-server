import { PostgresService } from '../services/postgres.service';
import { IServerModel, ServerModel, ServerStatus } from '../models/server.model';
import { zipObject, isEmpty } from 'lodash';

export class ServerRepo {
    private _postgresService: PostgresService;

    constructor(postgresService: PostgresService) {
        this._postgresService = postgresService;
    }

    async all(): Promise<IServerModel[]> {
        try {
            const result = await this._postgresService.client
                .query('SELECT * FROM server');

            const jsonResult: IServerModel[] = [];

            for (const row of result) {
                const am = zipObject(row.names, row.data) as unknown as IServerModel;
                jsonResult.push(am);
            }
            return jsonResult;
        } catch (e) {
            console.error(e);
        }
    }

    async create(serverModel: ServerModel) {
        try {
            const existingServer = await this.getBy('ip', serverModel.ip);
            if (!isEmpty(existingServer)) {
                await this.updateId(existingServer._id, serverModel._id);
            } else {
                await this._postgresService.client
                    .query(
                        `INSERT INTO server (ip, _id, port, type, status, created_on) VALUES ('${serverModel.ip}', '${serverModel._id}', '${serverModel.port}', '${serverModel.type}', ${serverModel.status}, '${serverModel.created_on.format('YYYY-MM-DD HH:mm:ss')}')`
                    );
            }
        } catch (e) {
            console.error(e);
        }
    }

    async updateStatus(_id: string, status: ServerStatus) {
        try {
            await this._postgresService.client
                .query(
                    `UPDATE server SET status = ${status} where _id = '${_id}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async updateId(_id: string, newId: string) {
        try {
            await this._postgresService.client
                .query(
                    `UPDATE server SET _id = '${newId}' where _id = '${_id}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async delete(_id: string) {
        try {
            const exec = await this._postgresService.client
                .query(
                    `DELETE from server where _id = '${_id}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async get(_id: string): Promise<IServerModel> {
        try {
            const exec = await this._postgresService.client
                .query(
                    `SELECT * from server where _id = '${_id}'`
                );
            let result: IServerModel;
            for (const row of exec) {
                result = zipObject(row.names, row.data) as unknown as IServerModel;
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getBy(field: string, value: any): Promise<IServerModel> {
        try {
            const exec = await this._postgresService.client
                .query(
                    `SELECT * from server where ${field} = '${value}'`
                );
            let result: IServerModel;
            for (const row of exec) {
                result = zipObject(row.names, row.data) as unknown as IServerModel;
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}
