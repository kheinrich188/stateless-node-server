import { Request, Response } from 'express';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';
import { CloudInstanceStatus } from '../models/cloud-instance.model';
import { isEmpty } from 'lodash';

export class ApiController {
    async state(req: Request, res: Response) {
        const cloudInstanceRepo = new CloudInstanceRepo();
        const result = await cloudInstanceRepo.all();
        res.json({ result });
    }

    async requestCloudInstance(req: Request, res: Response) {
        const cloudInstanceRepo = new CloudInstanceRepo();
        const result = await cloudInstanceRepo.all();
        const waitingCloudInstances = result.find(value => value.status === CloudInstanceStatus.Waiting);
        if (!isEmpty(waitingCloudInstances)) {
            res.json({ ip: waitingCloudInstances.ip });
        } else {
            res.sendStatus(404);
        }
    }
}
