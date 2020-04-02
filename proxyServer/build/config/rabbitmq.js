"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: process.env.RABBIT_USER,
    password: process.env.RABIIT_PWD,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
};
