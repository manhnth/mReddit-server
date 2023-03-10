import { config } from 'dotenv';
// import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
// import helmet from 'helmet';
// import hpp from 'hpp';
// import morgan from 'morgan';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@/middlewares/error.middleware';
import { CREDENTIALS } from './config/index';
require('dotenv').config();

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = process.env.NODE_ENV || 'development';
    this.port = process.env.PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`server listening on port: ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    // this.app.use(morgan(LOG_FORMAT, { stream }));
    // this.app.use(
    //   cors({
    //     origin: process.env.ORIGIN,
    //     credentials: CREDENTIALS,
    //     // allowedHeaders:
    //     //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, Access-Control-Allow-Credentials, Access-Control-Allow-Methods',
    //   })
    // );
    // this.app.use(hpp());
    // this.app.use(helmet());
    // this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.all('*', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Origin', req.get('Origin'));
      res.setHeader(
        'Access-Control-Allow-Methods',
        'POST, GET, OPTIONS, DELETE, PUT, PATCH'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, Authorization'
      );

      next();
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
