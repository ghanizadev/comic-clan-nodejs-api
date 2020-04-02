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
import logger from './utils/logger';

import "sucrase/register/ts";
dotenv.config();

const app = express();
const server = http.createServer(app);
// io(server); Only authenticated users

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..' , 'public')));
app.use('/v3/api-docs', express.static(path.join(__dirname, '..' , 'public', 'docs')));
app.use(compression());

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public'))
})

app.get('/v3/api-docs', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'docs', 'index.html'))
})

app.use(routes);

export default server;