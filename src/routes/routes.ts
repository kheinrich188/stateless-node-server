import { Application } from 'express';
import { ApiController } from '../controller/api.controller';
import { ServerRepo } from '../repository/server.repo';

const ROUTES = {
    Api: {
        state: '/api/state'
    }
};

export class Routes {
    static setupRoutes(app: Application, serverRepo: ServerRepo) {
        const apiController = new ApiController(serverRepo);

        app.route(ROUTES.Api.state)
            .get((req, res) => apiController.state(req, res));
    }
}
