import fs from 'fs';
import path from 'path';

export default class {
    constructor(app) {
        this.app = app;
    }

    loadRoutes(dir) {
        fs.readdirSync(dir)
            .forEach(file => {
                const route = require(path.join(dir, file));
                this.app.route(route.default(this.app))
            });
        return this.app;
    }

    loadMiddlewares(dir) {
        fs.readdirSync(dir)
            .forEach(file => {
                const middleware = require(path.join(dir, file));
                this.app = middleware.default(this.app);
            });
        return this.app;
    }
}