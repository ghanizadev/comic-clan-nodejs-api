import express from 'express';
import axios from 'axios';
import { HTTPError } from '../errors';
import FormData from 'form-data';
import logger from '../utils/logger';
import polish from '../utils/polish'

const router = express.Router();

// Get all posts
router.get('/', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: {},
        event: 'list',
    })
    .then(async posts => {

        const results = await Promise.all(

            posts.payload.map(async(post: { userId: string; user: any; comments : string[]; }) => {

                await req.eventHandler.publish('users_ch', {
                    body: {query: {_id: post.userId}},
                    event: 'list',
                })
                .then(({ payload }) => {
                    if(payload.length === 0) return;

                    post.user = polish(payload.shift());
                })
                .catch(next);

                await req.eventHandler.publish('comments_ch', {
                    body: {query: {_id: {$in : post.comments } }},
                    event: 'list',
                })
                .then(({ payload }) => {
                    if(payload.length === 0) return;

                    post.comments = payload;
                })
                .catch(next);

                return post;
            })
        );

        const r : any[] = [];

        results.forEach(e => {
            if(e) r.push(polish(e));
        });

        res.status(posts.status).send(r);
    })
    .catch(next);
})

// Get post by ID
router.get('/:id', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: { _id : req.params.id },
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Create a new post
router.post('/', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: req.body,
        event: 'create',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

// Alter a post
router.put('/:id', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: {_id : req.params.id, content: req.body},
        event: 'modify',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Delete a post
router.delete('/:id', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: {_id : req.params.id},
        event: 'delete',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})


// Subscribe to a post
router.post('/:id', (req, res, next) => {
    req.eventHandler.publish('posts_ch', {
        body: {_id : req.params.id},
        event: 'subscribe',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

export default router;