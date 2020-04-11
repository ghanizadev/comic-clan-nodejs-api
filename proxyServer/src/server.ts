'use strict'
import app from './app';
import { logger } from './utils/logger';
import EventHandler from './events';
import redis from 'redis';
import uuid from 'uuid/v4';
import https from 'https';

const run = async () => {
    await EventHandler.getInstance().connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'proxy_ch');

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

        db.hgetall('clients', (error, keys) => {
            if (error) return;

            const auth: { id: string; secret: string; } = {id: '', secret:''};

            if(keys){
                auth.id = Object.keys(keys).shift() || '';
                auth.secret = keys[auth.id] || '';

                if(auth.id !== '' && auth.secret !== ''){
                    logger.warn('Client credentials found in database');
                    logger.warn(`CLIENT_ID=${auth.id}`);
                    logger.warn(`CLIENT_SECRET=${auth.secret}`);
                } else {
                    logger.warn('Generating temporary client credentials...');
                    const clientID = uuid();
                    const clientSecret = uuid();

                    logger.warn(`CLIENT_ID=${clientID}`);
                    logger.warn(`CLIENT_SECRET=${clientSecret}`);

                    db.hset('clients', clientID, clientSecret);
                }
            } else {
                logger.warn('Generating temporary client credentials...');
                const clientID = uuid();
                const clientSecret = uuid();

                logger.warn(`CLIENT_ID=${clientID}`);
                logger.warn(`CLIENT_SECRET=${clientSecret}`);

                db.hset('clients', clientID, clientSecret);
            }



            app.listen(process.env.PORT || 3000, () => {
                logger.info(`Server started at port ${process.env.PORT || 3000}`);
            });
        });

    })
}

run().catch(logger.warn)

