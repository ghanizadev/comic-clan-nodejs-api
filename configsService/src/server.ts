import Database from './database';
import EventHandler from './events';
import { logger } from './utils/logger';
import controllers from './controllers';

const run = async () => {
    const db = Database.getInstance();
    await db.connect(process.env.REDIS_SERVER || '', 'config');
    const eventHandler = EventHandler.getInstance();
    eventHandler.connect(process.env.REDIS_SERVER || '', 'configs_ch');

    logger.info('Config Service just started');

    eventHandler.on('set', async (message, reply) => {
        await controllers.set(message.body, db.database)
        .then(config => {
            return reply({ payload: config, status: 201 });
        })
        .catch(e => {
            if(e.error && e.erro_description && e.status)
                return reply(e);
            return reply({error:'server_error', error_description: e.message, status: 500});
        })
    });

    eventHandler.on('setdefault', async (message, reply) => {
        await controllers.setDefault(message.body, db.database)
        .then(config => {
            return reply({ payload: config, status: 201 });
        })
        .catch(e => {
            if(e.error && e.erro_description && e.status)
                return reply(e);
            return reply({error:'server_error', error_description: e.message, status: 500});
        })
    });

    eventHandler.on('get', async (message, reply) => {
        await controllers.get(db.database)
        .then(config => {
            return reply({ payload: config, status: 201 });
        })
        .catch(e => {
            if(e.error && e.erro_description && e.status)
                return reply(e);
            return reply({error:'server_error', error_description: e.message, status: 500});
        })
    });

    eventHandler.on('getdefault', async (message, reply) => {
        await controllers.getDefault(db.database)
        .then(config => {
            return reply({ payload: config, status: 201 });
        })
        .catch(e => {
            if(e.error && e.erro_description && e.status)
                return reply(e);
            return reply({error:'server_error', error_description: e.message, status: 500});
        })
    });
}

run().catch(logger.error);