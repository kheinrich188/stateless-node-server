import { Request, Response } from 'express';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';
import { CloudInstanceStatus } from '../models/cloud-instance.model';
import { isEmpty } from 'lodash';

export class ApiController {
    private _cloudInstanceRepo: CloudInstanceRepo;

    constructor(cloudInstanceRepo: CloudInstanceRepo) {
        this._cloudInstanceRepo = cloudInstanceRepo;
    }

    async state(req: Request, res: Response) {
        const result = await this._cloudInstanceRepo.all();
        res.json({ result });
    }

    async requestCloudInstance(req: Request, res: Response) {
        const result = await this._cloudInstanceRepo.all();
        const waitingCloudInstances = result.find(value => value.status === CloudInstanceStatus.Waiting);
        if (!isEmpty(waitingCloudInstances)) {
            res.json({ ip: waitingCloudInstances.ip });
        } else {
            res.sendStatus(404);
        }
    }
}
