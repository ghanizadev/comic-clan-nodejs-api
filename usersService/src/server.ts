import EventHandler from './events';
import * as Bluebird from 'bluebird';
import controller from './controllers';
import { HTTPError } from './events';

declare global { export interface Promise<T> extends Bluebird<T> {} }

const run = async () => {
  const eventHandler = new EventHandler('redis://localhost:6379/', 'user_ch');
  eventHandler.listen('users_ch');

  eventHandler.on('list', async (e, reply) => {
    const doc = await controller.create(e.body);
    if (doc) reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500});
    else reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500})
  });

  eventHandler.on('create', async (e, reply) => {
    try {
      const doc = await controller.create(e.body);
      reply({payload: doc, condition: 'ok'});
    }catch(e) {
      if(e.error && e.error_description && e.status) reply(e)
      else reply({error: 'failed_to_create', error_description: e.message, status: 500});
    }
  });

  eventHandler.on('delete', async (e, reply) => {
    const doc = await controller.create(e.body);
    if (doc) reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500});
    else reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500})
  });

  eventHandler.on('modify', async (e, reply) => {
    const doc = await controller.create(e.body);
    if (doc) reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500});
    else reply({error: 'failed_to_create', error_description: "an error occured while saving in database", status: 500})
  });
}

run().catch(console.error);