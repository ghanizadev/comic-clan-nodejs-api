'use strict'
import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import compression from 'compression';
import cors from 'cors';
import io from 'socket.io';
import routes from './routes';
import HTTPError from './errors';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
// io(server); Only authenticated users

app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    const mime = /application\/(json|x\-www\-form-urlencoded)+?/gi
    const verbs = ['POST', 'PUT', 'PATCH'];

    if(verbs.includes(req.method.toUpperCase()) && !mime.test(req.headers["content-type"] || '')){
        throw new HTTPError('unsupported_media', 'Invalid content-type. For more information please check documentation', 415);
    }

    next();
})
app.use('/admin-login', express.static(path.join(__dirname, '..' , 'public')));
// app.use('/dashboard', express.static(path.join(__dirname, '..' , 'public', 'admin')));
app.use('/v3/api-docs', express.static(path.join(__dirname, '..' , 'public', 'docs')));
app.use(compression());

app.get('/', (req, res, next) => {
    res.redirect('/admin-login')
});

app.get('/v3/api-docs', (_, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'docs', 'index.html'))
})

app.use(routes);

app.use(errorHandler);

export default app;