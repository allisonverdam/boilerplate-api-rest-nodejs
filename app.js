import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

import ExpressHelper from './app/utils/expressHelper';

import models from './app/models';
import config from './config';

const app = express();
const expressHelper = new ExpressHelper(app);

app.set('secretJWT', config.secretJWT);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.$models = models;
  next()
})

app.get('/', (req, res) => {
  res.render('pages/index', {
    routes: app._router.stack
  })
})

app.route(expressHelper.loadRoutes(path.join(__dirname, '/app/routes')));
app.route(expressHelper.loadMiddlewares(path.join(__dirname, '/app/middlewares')));

export default app;