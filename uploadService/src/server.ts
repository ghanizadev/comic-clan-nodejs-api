import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import bodyParser from 'body-parser'

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(router)

app.listen(process.env.PORT ?? 3001, () => {
    console.log(`Listening on port ${process.env.PORT ?? 3001}`)
}) 