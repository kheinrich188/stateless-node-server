import { PostgresService } from '../services/postgres.service';
import { zipObject, isEmpty } from 'lodash';
import moment from 'moment';
import { CloudInstanceStatus, ICloudInstance } from '../models/cloud-instance/cloud-instance.definitions';

export const CloudInstanceTableName = process.env.NODE_ENV ? `cloudinstances_${process.env.NODE_ENV}` : 'cloudinstances_unknown';

export class CloudInstanceRepo {
    private _postgresService: PostgresService;

    constructor() {
        this._postgresService = PostgresService.getInstance();
    }

    async all(): Promise<ICloudInstance[]> {
        try {
            const result = await this._postgresService.client
                .query(`SELECT * FROM ${CloudInstanceTableName}`);

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

    async create(ip: string, domain: string, port: string, type: string) {
        try {
            const existingServer = await this.getBy('ip', ip);
            if (!isEmpty(existingServer)) {
                await this.updateIp(existingServer.ip, ip);
            } else {
                await this._postgresService.client
                    .query(
                        `INSERT INTO 
                                ${CloudInstanceTableName} 
                              (ip, domain, port, type, status, creationDate) 
                              VALUES 
                                 (
                                  '${ip}', 
                                  '${domain}',
                                  '${port}',
                                  '${type}',
                                  ${CloudInstanceStatus.Waiting},
                                  '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                                  )
                              `
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
                    `UPDATE ${CloudInstanceTableName} SET status = ${status} where _id = '${_id}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async updateId(_id: string, newId: string) {
        try {
            await this._postgresService.client
                .query(
                    `UPDATE ${CloudInstanceTableName} SET _id = '${newId}' where _id = '${_id}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async updateIp(ip: string, newIp: string) {
        try {
            await this._postgresService.client
                .query(
                    `UPDATE ${CloudInstanceTableName} SET ip = '${newIp}' where ip = '${ip}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async delete(ip: string) {
        try {
            const exec = await this._postgresService.client
                .query(
                    `DELETE from ${CloudInstanceTableName} where ip = '${ip}'`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async clear() {
        try {
            const exec = await this._postgresService.client
                .query(
                    `TRUNCATE ${CloudInstanceTableName}`
                );
        } catch (e) {
            console.error(e);
        }
    }

    async get(_id: string): Promise<ICloudInstance> {
        try {
            const exec = await this._postgresService.client
                .query(
                    `SELECT * from ${CloudInstanceTableName} where _id = '${_id}'`
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
                    `SELECT * from ${CloudInstanceTableName} where ${field} = '${value}'`
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
