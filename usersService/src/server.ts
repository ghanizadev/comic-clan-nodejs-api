'use strict'
import EventHandler from './events';
import connectionOptions from './config/rabbitmq';
import * as Bluebird from 'bluebird';

declare global { export interface Promise<T> extends Bluebird<T> {} }

const run = async () => {
  const eventHandler = new EventHandler();
  eventHandler.listen(connectionOptions);

  // eventHandler.on('');
}

run().catch(console.error);