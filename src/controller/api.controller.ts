import { Request, Response } from 'express';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';
import { isEmpty } from 'lodash';

export class ApiController {
    async state(req: Request, res: Response) {
        const cloudInstanceRepo = new CloudInstanceRepo();
        const result = await cloudInstanceRepo.all();
        res.json({ result });
    }

    async requestCloudInstance(req: Request, res: Response) {
        const cloudInstanceRepo = new CloudInstanceRepo();
        const instance = await cloudInstanceRepo.getWaitingInstance();
        if (!isEmpty(instance)) {
            res.json({ ip: instance.ip });
        } else {
            res.sendStatus(404);
        }
    }
}
