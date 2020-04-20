'use strict'
import app from './app';
import { logger } from './utils/logger';
import EventHandler, { eventHandler } from './events';
import redis, { RedisClient } from 'redis';
import uuid from 'uuid/v4';
import https from 'https';
import fs from 'fs';
import path from "path";
import bcrypt from 'bcrypt';
import errorHandler from './middlewares/errorHandler';

const createCredentials = async (db : RedisClient) =>
    new Promise((res, rej) => {
    logger.warn('Generating temporary client credentials...');
    const clientID = uuid();
    const clientSecret = uuid();

    logger.warn(`CLIENT_ID=${clientID}`);
    logger.warn(`CLIENT_SECRET=${clientSecret}`);

    db.hset('clients', clientID, clientSecret);

    logger.warn('Creating default SU=admin:admin');
    eventHandler.publish('auth_ch', {
        body: {username: 'admin', password: 'admin', id : clientID},
        event: 'createadmin'
    })
    .then(res)
    .catch(rej);
});

const run = async () => new Promise(async (res, rej) => {
    await EventHandler.getInstance().connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'proxy_ch');

    // tslint:disable-next-line: variable-name
    const retry_strategy = (options : any) : number | Error => {
        if (options.attempt > 30) {
            logger.warn('Redis server is not responding...');
            process.exit(1);
        }
        if (options.error && options.error.code === "ECONNREFUSED") {
            return 1000;
        }
        return 1000;
    }

    const db = redis.createClient({url: process.env.REDIS_SERVER || 'redis://localhost:6379', retry_strategy});
    db.once('connect', () => {
        logger.info('Checking from credentials...')

        db.hgetall('clients', async (error, keys) => {
            if (error) return;

            const auth: { id: string; secret: string; } = {id: '', secret:''};

            if(keys){
                auth.id = Object.keys(keys).shift() || '';
                auth.secret = keys[auth.id] || '';

                if(auth.id !== '' && auth.secret !== ''){
                    logger.warn('Credentials found in database!');
                    logger.warn(`CLIENT_ID=${auth.id}`);
                    logger.warn(`CLIENT_ID=${auth.secret}`);
                } else {
                    await createCredentials(db)
                    .then(() => logger.warn('Successfully created'))
                    .catch(() => logger.error('failed to create ADM user!'))
                }
            } else {
                await createCredentials(db)
                    .then(() => logger.warn('Successfully created'))
                    .catch(() => logger.error('failed to create ADM user!'))
            }

            app.use(errorHandler);

            const options = {
                key: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.crt'))
            }

            https.createServer(options, app).listen(process.env.PORT || 3000, () => {
                logger.info(`Server started at port ${process.env.PORT || 3000}`);
            });
        });

    })
});

run().catch(logger.warn)

