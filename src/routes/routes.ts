import { Application } from 'express';
import { ApiController } from '../controller/api.controller';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';

const ROUTES = {
    Api: {
        state: '/api/state',
        requestCloudInstance: '/api/requestCloudInstance'
    }
};

export class Routes {
    private readonly cloudInstanceRepo: CloudInstanceRepo;
    constructor(cloudInstanceRepo: CloudInstanceRepo) {
        this.cloudInstanceRepo = cloudInstanceRepo;
    }

    setupRoutes(app: Application) {
        const apiController = new ApiController(this.cloudInstanceRepo);

        app.route(ROUTES.Api.state)
            .get((req, res) => apiController.state(req, res));
        app.route(ROUTES.Api.requestCloudInstance)
            .get((req, res) => apiController.requestCloudInstance(req, res));
    }
}
