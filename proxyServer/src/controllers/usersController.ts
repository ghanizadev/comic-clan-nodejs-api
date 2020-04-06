import * as express from 'express';
import * as amqp from 'amqplib';
import axios from 'axios';
import FormData from 'form-data';
import { HTTPError } from '../errors';
import polish from '../utils/polish';
import IUserDTO from '../DTO/userDTO';
import { IResponseType } from '../events/eventHandler';

const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: {},
        event: 'list',
    })
    .then(reply => {
        const response : IUserDTO[] = [];
        reply.payload.forEach((item : IResponseType) => {
            const {_id, name, email, password, createdAt, updatedAt} = item;
            response.push({
                _id,
                name,
                email,
                createdAt,
                updatedAt
            })
        })
        res.status(reply.status).send(response);
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
        const {_id, name, email, password, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
    })
    .catch(next)
})

// Post a new user
router.post('/', (req, res, next) => {
    req.eventHandler.publish('users_ch', {
        body: req.body,
        event: 'create',
    })
    .then(reply => {
        req.eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
                password: reply.payload.password,
            },
            event: 'newuser'
        })

        const {_id, name, email, password, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
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
    axios.post(process.env.UPLOAD_HOST || '', form, {headers: form.getHeaders(), validateStatus: (status) => status < 500 })
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
        const {_id, name, email, password, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
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
        req.eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
            },
            event: 'removeuser'
        })

        const {_id, name, email, password, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
    })
    .catch(next)
})

export default router;