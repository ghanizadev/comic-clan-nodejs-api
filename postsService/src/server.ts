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

  // pub.send("Test message")

  const sub = new Consumer();
  await sub.connect(connection);

  sub.subscribe('Teste', async (msg, correlationId) => {
    console.log("Callback called! ", msg.payload, correlationId)
    // await pub.reply("Essa é uma resposta de posts", correlationId);
  })

}

run().catch(console.error)