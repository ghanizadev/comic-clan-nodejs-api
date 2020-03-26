'use strict'
import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import compression from 'compression';
import cors from 'cors';
import * as http from 'http';
import io from 'socket.io';
import routes from './routes';
import mongoose from 'mongoose';
import logger from './utils/logger';

import "sucrase/register/ts";
dotenv.config();

const app = express();
const server = http.createServer(app);
io(server);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(routes);

server.listen(process.env.PORT ?? 3000, () => {
    logger.info(`Server started at port ${process.env.PORT ?? 3000}`)
});

export default server;