import { PostgresService } from '../services/postgres.service';
import { ICloudInstance, ServerModel, CloudInstanceStatus } from '../models/server.model';
import { zipObject, isEmpty } from 'lodash';

export class CloudInstanceRepo {
    private _postgresService: PostgresService;

    constructor(postgresService: PostgresService) {
        this._postgresService = postgresService;
    }

    async all(): Promise<ICloudInstance[]> {
        try {
            const result = await this._postgresService.client
                .query('SELECT * FROM server');

            const jsonResult: ICloudInstance[] = [];

            for (const row of result) {
                const am = zipObject(row.names, row.data) as unknown as ICloudInstance;
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

    async updateStatus(_id: string, status: CloudInstanceStatus) {
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

    async get(_id: string): Promise<ICloudInstance> {
        try {
            const exec = await this._postgresService.client
                .query(
                    `SELECT * from server where _id = '${_id}'`
                );
            let result: ICloudInstance;
            for (const row of exec) {
                result = zipObject(row.names, row.data) as unknown as ICloudInstance;
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    async getBy(field: string, value: any): Promise<ICloudInstance> {
        try {
            const exec = await this._postgresService.client
                .query(
                    `SELECT * from server where ${field} = '${value}'`
                );
            let result: ICloudInstance;
            for (const row of exec) {
                result = zipObject(row.names, row.data) as unknown as ICloudInstance;
            }
            return result;
        } catch (e) {
            console.error(e);
        }
    }
}
