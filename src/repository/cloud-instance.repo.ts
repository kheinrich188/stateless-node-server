import { getRepository } from 'typeorm';
import { CloudInstanceEntity, CloudInstanceStatus } from '../entity/cloud-instance.entity';
import BaseRepository from './base/base.repo';
import { isEmpty } from 'lodash';

export class CloudInstanceRepo extends BaseRepository<CloudInstanceEntity> {
    constructor() {
        super(CloudInstanceEntity);
    }

    async create(ip: string, domain: string, port: string, type: string): Promise<void> {
        const existingInstance = await getRepository(CloudInstanceEntity).findOne({ ip });
        if (isEmpty(existingInstance)) {
            const instance = await getRepository(CloudInstanceEntity)
                .create({ ip, domain, port, type });

            await getRepository(CloudInstanceEntity).save(instance);
        } else {
            await getRepository(CloudInstanceEntity)
                .update(existingInstance.id, { ip, domain, port, type });
        }
    }

    async getWaitingInstances(): Promise<CloudInstanceEntity[]> {
        return await getRepository(CloudInstanceEntity).find({ status: CloudInstanceStatus.Waiting });
    }

    async getWaitingInstance(): Promise<CloudInstanceEntity> {
        return await getRepository(CloudInstanceEntity).findOne({ status: CloudInstanceStatus.Waiting });
    }

    async findByIp(ip: string): Promise<CloudInstanceEntity> {
        return await getRepository(CloudInstanceEntity).findOne({ ip });
    }

    async updateStatus(ip: string, status: CloudInstanceStatus) {
        const toUpdate = await this.findByIp(ip);
        if (toUpdate.status !== status) {
            await getRepository(CloudInstanceEntity)
                .update(toUpdate.id, { status });
        } else {
            throw new Error('status already set');
        }
    }

    async deleteByIp(ip: string) {
        return await getRepository(CloudInstanceEntity).delete({ ip });
    }
}
