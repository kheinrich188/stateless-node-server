import { Request, Response } from 'express';
import { ServerRepo } from '../repository/server.repo';

export class ApiController {
    private serverRepo: ServerRepo;

    constructor(serverRepo: ServerRepo) {
        this.serverRepo = serverRepo;
    }

    async state(req: Request, res: Response) {
        const result = await this.serverRepo.all();
        res.json({ result });
    }
}
