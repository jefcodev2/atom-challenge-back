import { Server } from './src/server';
import dotenv from 'dotenv';

dotenv.config();

Server.initializeServer();

export default Server.app;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  console.log(`Servidor listo en modo desarrollo en puerto ${port}`);
}


