import express from 'express';
import * as http from 'node:http';
import cors from 'cors';
import { envConfig } from './core/config/env.config';
import userRouter from './modules/user/routes/user.route';
import authRouter from './modules/auth/routes/auth.route';
import taskRouter from './modules/task/routes/task.route';

class AppServer {
  private static _serverInstance: AppServer;
  private _express: express.Application | undefined;
  private _server: http.Server | undefined;
  private _port: string | number;

  private constructor() {
    this._port = envConfig.port;
  }

  public static getInstance(): AppServer {
    return this._serverInstance || (this._serverInstance = new this());
  }

  public get server(): http.Server | null {
    return this._server || null;
  }

  public get port(): string | number {
    return this._port;
  }

  public get app(): express.Application | undefined {
    return this._express;
  }

  public initializeServer(): AppServer {
    if (this._express !== undefined) {
      return this;
    }

    this._express = express();

    this._express.use(cors());

    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: false }));

    this.initHttpRoutes();

    if (process.env.NODE_ENV !== 'production') {
      this._server = this._express.listen(this._port, () => {
        console.log(`Servidor escuchando en puerto ${this._port}...`);
      });
    }

    return this;
  }

  private initHttpRoutes(): void {
    if (this._express) {
      this._express.use('/api/users', userRouter);
      this._express.use('/api/auth', authRouter);
      this._express.use('/api/tasks', taskRouter);
    }
  }

}

export const Server = AppServer.getInstance();
