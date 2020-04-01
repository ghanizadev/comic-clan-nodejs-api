import EventHandler from './events';
import * as Bluebird from 'bluebird';
import controller from './controllers';
import { HTTPError } from './events';

declare global { export interface Promise<T> extends Bluebird<T> {} }

const run = async () => {
  const eventHandler = new EventHandler('redis://localhost:6379/', 'posts_ch');
  eventHandler.listen('posts_ch');

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
      reply({payload: doc, status: 201});
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
}

run().catch(console.error);