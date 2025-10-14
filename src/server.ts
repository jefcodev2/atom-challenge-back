import express from 'express';
import * as http from 'node:http';
import { envConfig } from './config/env.config';
import userRouter from './routes/user.route';

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

  public initializeServer(): AppServer {
    if (this._express !== undefined) {
      throw new Error('El servidor ya está inicializado.');
    }

    this._express = express();

    this._express.use(express.json());
    this._express.use(express.urlencoded({ extended: false }));

    this.initHttpRoutes();

    this._server = this._express.listen(this._port, () => {
      console.log(`Servidor escuchando en puerto ${this._port}...`);
    });

    return this;
  }

  private initHttpRoutes(): void {
    if (this._express) {
      this._express.use('/api/users', userRouter);
    }
  }

}

export const Server = AppServer.getInstance();
