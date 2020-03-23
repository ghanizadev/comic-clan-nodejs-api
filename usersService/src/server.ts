'use strict'

import * as amqp from 'amqplib';
import conString from './config/rabbitmq'

//Fake Data
const payload = {
  user: 'Jean',
  email: 'jf.melo6@gmail.com',
  password: '********',
  active: true,
}

const run = async () => {
    const connection = await amqp.connect(conString);
    const channel = await connection.createConfirmChannel();

    await channel.assertQueue('users');
    channel.sendToQueue('users', Buffer.from(JSON.stringify(payload)))
    console.log("Successfully connected!")

}

run().catch(console.error)