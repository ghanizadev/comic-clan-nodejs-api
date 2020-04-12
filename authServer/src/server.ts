import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import ddos from './middlewares/ddos'
import database from './middlewares/dbInjector';
import eventHalderInjector from './middlewares/eventHandlerInjector';
import EventHandler from "./events";
import Database from './database';
import {logger} from './utils/logger'

dotenv.config();

const run = async () => {
    logger.info("Initializing...");
    const eventHandler = EventHandler.getInstance();
    eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth_ch');

    logger.info("Connecting to Redis server...");
    const conn = Database.getInstance();
    const db = await conn.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth');
    
    eventHandler.on('newuser', (message, reply) => {
        db.hset(message.body.email, 'password', message.body.password, (error) => {
            if(error)
                return reply({error: "internal_error", error_description: "Something happen while trying to save user\'s authentication, try again later", status: 500});
            reply({payload: {}, status: 200});
        });
    })


    eventHandler.on('checkcredentials', (message, reply) => {
        const auth = Buffer.from(message.body.credentials.split(' ')[1], 'base64').toString();

        const [clientId, clientSecret] = auth.split(':');

        db.hget('clients', clientId, (error, secret) => {

            if(error) return reply({error: "invalid_client", error_description: "Requested client does not exists or it was deleted", status: 401});

            if(clientSecret !== secret)
                return reply({error: "invalid_client", error_description: "Client ID and client secret does not match", status: 401});
            
            reply({payload: {}, status: 200});
        })
    })
    
    eventHandler.on('removeuser', (message) => {
        db.del(message.body.email);
    })

    const app = express();

    const options = {
        key: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.crt'))
    }

    app.use(bodyParser.urlencoded({ extended : true }))
    app.use(bodyParser.json())
    app.use(helmet());
    app.use(ddos(db));
    app.use(database(db));
    app.use(eventHalderInjector(eventHandler));

    app.use('/oauth', routes);

    https.createServer(options, app).listen(process.env.PORT || 3333)
    logger.info(`Auth server started at ${process.env.PORT || 3333}`);
}

run().catch(console.error)
