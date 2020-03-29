import * as express from 'express';
import * as amqp from 'amqplib';
import axios from 'axios';
import FormData from 'form-data';
import { HTTPError } from '../../errors';

const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

// Get by ID
router.get('/:userId', (req, res, next) => {
    return next({error: 'failed_to_fetch', error_description: 'couldnt fetch database', status: 500})
})

// Post a new user
router.post('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
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
router.put('/:userId', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

// Delete a user
router.delete('/:userId', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

export default router;