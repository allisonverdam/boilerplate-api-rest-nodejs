import jwt from 'jsonwebtoken';

export default (app) => {

    app.use((req, res, next) => {
        req.jwt_auth = false;
        const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['Authorization'];
        if (token) {
            let jwt_token = token;
            req.token = token;
            jwt.verify(jwt_token, app.config.dev.superSecret, (err, jwt_data) => {
                if (err) return res.json({message: "Invalid token."});
                req.jwt_auth = jwt_data;
                next();
            });
        } else {
            
            next();
        }
    });

    return app;
}