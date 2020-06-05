import { Application } from 'express';
import { ApiController } from '../controller/api.controller';
import { CloudInstanceRepo } from '../repository/cloud-instance.repo';

const ROUTES = {
    Api: {
        state: '/api/state'
    }
};

export class Routes {
    static setupRoutes(app: Application, cloudInstanceRepo: CloudInstanceRepo) {
        const apiController = new ApiController(cloudInstanceRepo);

        app.route(ROUTES.Api.state)
            .get((req, res) => apiController.state(req, res));
    }
}
