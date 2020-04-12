import express from 'express';
import axios from 'axios';
import HTTPError from '../errors';
import FormData from 'form-data';
import logger from '../utils/logger';
import polish from '../utils/polish'
import EventHandler from '../events';

const router = express.Router();
const eventHandler = EventHandler.getInstance();

// Get all comments
router.get('/', (req, res, next) => {
    eventHandler.publish('comments_ch', {
        body: {},
        event: 'list',
    })
    .then(async comments => {
        const results = await Promise.all(

            comments.payload.map( async (comment: { userId: any; user: any; }) => {

            await eventHandler.publish('users_ch', {
                body: {query: {_id: comment.userId}},
                event: 'list',
            })
            .then(({ payload }) => {
                if(payload.length === 0) return;

                comment.user = polish(payload[0]);
            })
            .catch(next);

            return comment;
        }));

        const r : any[] = [];

        results.forEach(e => {
            if(e) r.push(e);
        });

        res.status(comments.status).send(r);
    })
    .catch(next);
})

// Get post by ID
router.get('/:id', (req, res, next) => {
    eventHandler.publish('comments_ch', {
        body: { _id : req.params.id },
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Comment to a comment
router.post('/:commentId', (req, res, next) => {

    eventHandler.publish('comments_ch', {
        body: {query: {_id: req.params.commentId}},
        event: 'list',
    })
    .then(async ({payload}) => {
        if(Array.isArray(payload) && payload.length === 0)
            throw new HTTPError('invalid_request', 'Comment was not found or it was deleted', 404)

        const comment = await eventHandler.publish('comments_ch', {
            body: {
                body: req.body.body,
                media: req.body.media,
                rel: req.params.commentId,
                userId: req.user._id,
                acceptComments: false
            },
            event: 'create',
        })

        await eventHandler.publish('comments_ch', {
            body: { id: req.params.commentId, commentId: comment.payload._id },
            event: 'addcomment',
        })
        .then(reply => {
            res.status(reply.status).send(polish(comment.payload));
        })
        .catch(next);
    })
    .catch(next);
})

// Alter a post
router.put('/:id', (req, res, next) => {
    eventHandler.publish('comments_ch', {
        body: {_id : req.params.id, content: req.body},
        event: 'modify',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
        .catch(next)
})

// Delete a comment
router.delete('/:id', (req, res, next) => {
    eventHandler.publish('comments_ch', {
        body: {_id : req.params.id},
        event: 'delete',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Subscribe to a comment
router.post('/:id', (req, res, next) => {
    eventHandler.publish('comments_ch', {
        body: {_id : req.params.id},
        event: 'subscribe',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

export default router;