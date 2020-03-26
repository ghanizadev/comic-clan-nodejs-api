export default {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBIT_USER,
    password: process.env.RABIIT_PWD,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
}