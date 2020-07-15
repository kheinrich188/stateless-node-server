import { getRepository } from 'typeorm';
import { CloudInstanceEntity } from '../entity/cloud-instance.entity';
import BaseRepository from './base/base.repo';
import _ from 'lodash';

export class CloudInstanceRepo extends BaseRepository<CloudInstanceEntity> {
    constructor() {
        super(CloudInstanceEntity);
    }

    async create(ip: string, domain: string, port: string, type: string): Promise<void> {
        const existingInstance = await getRepository(CloudInstanceEntity).findOne({ ip });
        if (_.isEmpty(existingInstance)) {
            const instance = await getRepository(CloudInstanceEntity)
                .create({ ip, domain, port, type });

            await getRepository(CloudInstanceEntity).save(instance);
        } else {
            await getRepository(CloudInstanceEntity)
                .update(existingInstance.id, { ip, domain, port, type });
        }
    }

    async deleteByIp(ip: string) {
        return await getRepository(CloudInstanceEntity).delete({ ip });
    }
}
