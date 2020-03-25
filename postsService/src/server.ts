'use strict'

import * as amqp from 'amqplib';
import conString from './config/rabbitmq';
import Publisher from './Publisher';
import Consumer from './Consumer';

import * as Bluebird from 'bluebird';

declare global { export interface Promise<T> extends Bluebird<T> {} }



const run = async () => {
  const connection = await amqp.connect(conString);
  const pub = new Publisher();
  await pub.connect(connection);
  const sub = new Consumer();
  await sub.connect(connection);

  pub.send('users', "Test", "3888");

}

run().catch(console.error)