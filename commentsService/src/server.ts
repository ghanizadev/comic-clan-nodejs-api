import EventHandler from './events';
import controller from './controllers';
import dotenv from 'dotenv';
import Database from './database';
import { logger } from './utils/logger'

dotenv.config();

const run = async () => {

  const database = Database.getInstance()
  database.connect(process.env.MONGO_SERVER || 'mongodb://localhost:27017');

  const eventHandler = EventHandler.getInstance();
  eventHandler.connect(process.env.REDIS_SERVER ?? '', 'comments_ch');

  eventHandler.on('list', async (e, reply) => {
    try {
      const doc = await controller.list(e.body);
      if (doc) reply({payload: doc, status: 200});
      else reply({error: 'not_found', error_description: "post was not found in our database", status: 404});

    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_fetch', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('create', async (e, reply) => {
    try {
      const doc = await controller.create(e.body);
      if(doc){
        return reply({payload: doc, status: 201});
      }
      return reply({error: 'failed_to_create', error_description: "service returned a null state", status: 500});
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_create', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('delete', async (e, reply) => {
    try {
      const doc = await controller.delete(e.body);
      if (doc) reply({ payload: doc, status: 201 });
      else reply({error: 'not_found', error_description: "post was not found in our database", status: 404})
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_delete', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('modify', async (e, reply) => {
    try {
      const doc = await controller.modify(e.body);
      if (doc) reply({ payload: doc, status: 200 });
      else reply({error: 'not_found', error_description: "post was not found in our database", status: 404})
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_update', error_description: e.message, status: 500});
    }
  });

  eventHandler.on("addcomment", async (e, reply) => {
    try {
      const doc = await controller.addComment(e.body);
      if (doc) reply({ payload: doc, status: 200 });
      else reply({error: 'not_found', error_description: "post was not found in our database", status: 404})
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_comment', error_description: e.message, status: 500});
    }
  });

  logger.warn("Process instantiated in environment " + process.env.NODE_ENV);
}

run().catch(console.error);