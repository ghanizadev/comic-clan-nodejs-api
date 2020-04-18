import EventHandler from './events';
import controller from './controllers';
import dotenv from 'dotenv';
import Database from './database';
import Logger from './utils/logger';

dotenv.config();

const run = async () => {

  const logger = Logger.getInstance().getLogger();

  const eventHandler = EventHandler.getInstance();
  eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'users_ch');

  const db = Database.getInstance();
  db.connect(process.env.MONGO_SERVER || 'mongodb://localhost:27017')

  eventHandler.on('list', async (e, reply) => {
    try {
      const doc = await controller.list(e.body);
      if (doc) reply({payload: doc, status: 200});
      else reply({error: 'not_found', error_description: "user was not found in our database", status: 404});

    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_fetch', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('create', async (e, reply) => {
    try {
      const doc = await controller.create(e.body);
      if(!doc)
        reply({error: 'failed_to_create', error_description: 'service returned an empty response', status: 500})
      else
        reply({payload: doc, status: 201});

      eventHandler.publish('email_ch', {
        body: doc,
        event: 'newuser'
      })
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_create', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('delete', async (e, reply) => {
    try {
      const doc = await controller.delete(e.body);
      if (doc) reply({ payload: doc, status: 201 });
      else reply({error: 'not_found', error_description: "user was not found in our database", status: 404})
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_delete', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('modify', async (e, reply) => {
    try {
      const doc = await controller.modify(e.body);
      if (doc) reply({ payload: doc, status: 200 });
      else reply({error: 'not_found', error_description: "user was not found in our database", status: 404})
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_update', error_description: e.message, status: 500});
    }
  });

  logger.warn('Process instantited in environment ' + process.env.NODE_ENV)
}

run().catch(console.error);