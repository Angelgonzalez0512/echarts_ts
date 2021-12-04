import express from 'express';
import config from './config';
import cors from 'cors';
import router from './routes';
const app:express.Application=express();
app.set('port', config.port);
app.use(cors());
app.use(express.json());
app.use(router);
export default app;

