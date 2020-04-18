import * as express from 'express';
import * as amqp from 'amqplib';
import axios from 'axios';
import FormData from 'form-data';
import HTTPError from '../errors';
import IUserDTO from '../DTO/userDTO';
import EventHandler from '../events';
import middlewares from '../middlewares/errorHandler'
import authHandler from '../middlewares/authHandler'

const router = express.Router();
const eventHandler = EventHandler.getInstance();

// Get all users
router.get('/', authHandler, (req, res, next) => {
    eventHandler.publish('users_ch', {
        body: {},
        event: 'list',
    })
    .then(reply => {
        const response : IUserDTO[] = [];

        reply.payload.forEach((item : any) => {
            const {_id, name, email, scopes, createdAt, updatedAt} = item;
            response.push({
                _id,
                name,
                email,
                scopes,
                createdAt,
                updatedAt
            })
        })
        res.status(reply.status).send(response);
    })
    .catch(next)
})

// Get by ID
router.get('/:email', authHandler, (req, res, next) => {
    eventHandler.publish('users_ch', {
        body: { email : req.params.email },
        event: 'list',
    })
    .then(reply => {
        const {_id, name, email, scopes, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            scopes,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
    })
    .catch(next)
})

// Post a new user
router.post('/', (req, res, next) => {
    delete req.body.scopes;

    if(!req.headers?.authorization || !req.headers.authorization.startsWith("Basic "))
        throw new HTTPError('invalid_request', 'Missing "Authorization" header', 400)

    if(!req.body.email || req.body.email === '')
        throw new HTTPError('invalid_request', 'Missing "email" field', 400);

    if(!req.body.name || req.body.name === '')
        throw new HTTPError('invalid_request', 'Missing "name" field', 400);

    if(!req.body.password || req.body.password === '')
        throw new HTTPError('invalid_request', 'Missing "password" field', 400);

    eventHandler.publish('auth_ch', {
        body: {
            credentials: req.headers.authorization
        },
        event: 'checkcredentials'
    }).then(() => {

        eventHandler.publish('users_ch', {
            body: req.body,
            event: 'create',
        })
        .then(reply => {
            const scopes = ['feed', 'post', 'comments', 'profile'];

            const {_id, name, email, password, createdAt, updatedAt} = reply.payload;

            const response : IUserDTO = {
                _id,
                name,
                email,
                scopes,
                createdAt,
                updatedAt
            };

            eventHandler.publish('auth_ch', {
                body: {
                    email,
                    password,
                    credentials: req.headers.authorization
                },
                event: 'newuser',
            });

            res.status(reply.status).send(response);

        })
        .catch(e => {
            eventHandler.publish('auth_ch', {
                body: {
                    email: req.body.email || '',
                },
                event: 'removeuser'
            })
            next(e);
        })
    })
    .catch(next)

});

// Alter a user
router.put('/:email', authHandler,  (req, res, next) => {
    delete req.body.scopes;

    eventHandler.publish('users_ch', {
        body: {email : req.params.email, content: req.body},
        event: 'modify',
    })
    .then(reply => {
        const {_id, name, email, scopes, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            scopes,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
    })
    .catch(next)
})

// Delete a user
router.delete('/', authHandler,  (req, res, next) => {
    if(req.headers["content-type"] !== 'application/x-www-form-urlencoded')
        throw new HTTPError('invalid_request', 'Requests to delete user must be X-WWW-FORM-URLENCODED', 400);

    if(!req.body.password)
        throw new HTTPError('invalid_request', 'Missing "password" field', 400);

    eventHandler.publish('users_ch', {
    body: {email : req.user.email, password: req.body.password},
    event: 'delete',
    })
    .then(reply => {
        eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
            },
            event: 'removeuser'
        })

        const {_id, name, email, scopes, createdAt, updatedAt} = reply.payload;

        const response : IUserDTO = {
            _id,
            name,
            email,
            scopes,
            createdAt,
            updatedAt
        };

        res.status(reply.status).send(response);
    })
    .catch(next)
})

export default router;