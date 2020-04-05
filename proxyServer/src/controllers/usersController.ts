import * as express from 'express';
import * as amqp from 'amqplib';
import axios from 'axios';
import FormData from 'form-data';
import { HTTPError } from '../errors';
import polish from '../utils/polish';

const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: {},
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Get by ID
router.get('/:email', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: { email : req.params.email },
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
    // return next({error: 'failed_to_fetch', error_description: 'couldnt fetch database', status: 500})
})

// Post a new user
router.post('/', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: req.body,
        event: 'create',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Post a new media for an user
router.post('/:userId/images', async (req, res, next) => {
    const form = new FormData();

    if(Array.isArray(req.files)){;
        req.files.forEach(file => {
            form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
        })
    }
    axios.post('http://localhost:3001/', form, {headers: form.getHeaders(), validateStatus: (status) => status < 500 })
    .then(response => {
        res.status(response.status).send(response.data)
    })
    .catch(e => { throw new HTTPError(e) })
})

// Alter a user
router.put('/:email', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: {email : req.params.email, content: req.body},
        event: 'modify',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Delete a user
router.delete('/:email', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: {email : req.params.email},
        event: 'delete',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

export default router;