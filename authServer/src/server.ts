import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import ddos from './middlewares/ddos'
import EventHandler from './events';
import Database from './database';

dotenv.config();

const run = async () => {
    const eventHandler = EventHandler.getInstance();
    eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth_ch');

    const conn = Database.getInstance();
    const db = await conn.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth');
    
    eventHandler.on('newuser', (message) => {
        db.hset(message.body.email, 'password', message.body.password)
    })
    
    eventHandler.on('removeuser', (message) => {
        db.del(message.body.email)
    })

    const app = express();

    const options = {
        key: fs.readFileSync(path.resolve(__dirname, 'keys', 'key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.crt'))
    }

    app.use(bodyParser.urlencoded({ extended : true }))
    app.use(bodyParser.json())
    app.use(helmet());
    app.use(ddos(db));

    app.use('/oauth', routes);

    https.createServer(options, app).listen(process.env.PORT || 3333)
    console.log("started at ", process.env.PORT || 3333)
}

run().catch(console.error)
