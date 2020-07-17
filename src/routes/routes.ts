import { Application } from 'express';
import { ApiController } from '../controller/api.controller';

export const ROUTES = {
    Api: {
        state: '/api/state',
        requestCloudInstance: '/api/requestCloudInstance'
    }
};

export class Routes {
    static setupRoutes(app: Application) {
        const apiController = new ApiController();

        app.route(ROUTES.Api.state)
            .get(apiController.state);
        app.route(ROUTES.Api.requestCloudInstance)
            .get(apiController.requestCloudInstance);
    }
}
