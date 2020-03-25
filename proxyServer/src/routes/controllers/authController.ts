import express from 'express';
import * as amqp from 'amqplib';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({status: 200, message: `User: ${process.env.MAIL_USER}`})
})

export default router;