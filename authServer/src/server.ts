import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import ddos from './middlewares/ddos'

dotenv.config();

const app = express();

const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'keys', 'key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'keys', 'server.crt'))
}

app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.use(helmet());
app.use(ddos);

app.use('/oauth', routes);


console.log("started at ", process.env.PORT || 3333)
https.createServer(options, app).listen(process.env.PORT || 3333)
