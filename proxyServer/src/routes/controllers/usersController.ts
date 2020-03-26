import * as express from 'express';
import * as amqp from 'amqplib';

const router = express.Router();

// Get all users
router.get('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

// Get by ID
router.get('/:userId', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

// Post a new user
router.post('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
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