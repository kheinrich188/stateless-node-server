import { Request, Response } from 'express';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';

export class ApiController {
    private _cloudInstanceRepo: CloudInstanceRepo;

    constructor(cloudInstanceRepo: CloudInstanceRepo) {
        this._cloudInstanceRepo = cloudInstanceRepo;
    }

    async state(req: Request, res: Response) {
        const result = await this._cloudInstanceRepo.all();
        res.json({ result });
    }
}
