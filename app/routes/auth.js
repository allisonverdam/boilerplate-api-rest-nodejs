import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

export default (app) => {
    function generateToken(res, result) {
        jwt.sign({
            user: result
        }, app.get('secretJWT'), {
            expiresIn: 60 * 60 * 24
        }, (err, asyncToken) => {
            if (err) {
                return res.status(401).send({
                    message: 'A problem occurred while generating the token.'
                });
            }
            delete result.dataValues['password'];
            delete result.dataValues['updatedAt'];
            delete result.dataValues['createdAt'];
            delete result.dataValues['role'];
            res.json({
                user: result,
                token: asyncToken
            });
        })
    }

    app.post('/authenticate', (req, res, next) => {
        req.$models.user.authenticate(req.body.login)
            .then(result => {
                if (!result || result.length == 0)
                return res.status(401).send({ message: 'Authentication failed. User not found.' });

                if (!bcrypt.compareSync(req.body.password, result.password))
                    return res.status(401).send({
                        message: 'Authentication failed. Invalid login or password.'
                    });

                generateToken(res, result);
            }).catch(err => {
                return res.status(401).send({
                    message: 'Authentication failed.'
                });
            })
    })

    app.post('/register', (req, res, next) => {
        req.$models.user.createUser(req.body)
            .then(result => {
                generateToken(res, result);
            })
            .catch(err => {
                if(err.errors){
                    let errors = [];
                    err.errors.forEach(er => {
                        errors.push({message: er.message})
                    });
                    return res.status(401).send(errors);
                }
                res.status(401).send(err);
            })
    })

    return app;
}