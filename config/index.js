import path from 'path';

const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME|| 'api-rest-test'
    },
    port: process.env.PORT || 8080,
    db: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/api-rest',
    secretJWT: process.env.JWT_SECRET || 'secretstring'
  },
  production: {
    root: rootPath,
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.PORT,
    db: process.env.DATABASE_URL,
    secretJWT: process.env.JWT_SECRET
  }
};

export default config[env];