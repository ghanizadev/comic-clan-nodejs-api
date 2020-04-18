import express from 'express';
import HTTPError from '../errors';
import polish from '../utils/polish'
import Eventhandler from '../events';

const router = express.Router();
const eventHandler = Eventhandler.getInstance();

// Get all posts
router.get('/', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {pagination: req.query},
        event: 'list',
    })
    .then(async posts => {
        res.send(posts.payload);
    })
    .catch(next);
})

// Get post by ID
router.get('/:id', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: { query: { _id : req.params.id }},
        event: 'single',
    })
    .then(reply => {
        res.status(reply.status).send(reply.payload);
    })
    .catch(next)
})

// Create a new post
router.post('/', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: req.body,
        user: req.user,
        event: 'create',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

// Alter a post
router.put('/:id', (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {_id : req.params.id, content: req.body, user: req.user},
        event: 'modify',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Comment to a post
router.post('/:postId/comment', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {query: {_id: req.params.postId}},
        event: 'list',
    })
    .then(async ({payload}) => {

        if(Array.isArray(payload) && payload.length === 0)
            throw new HTTPError('invalid_request', 'Post was not found or it was deleted', 404)

        const comment = await eventHandler.publish('comments_ch', {
            body: {
                body: req.body.body,
                media: req.body.media,
                rel: req.params.postId,
                userId: req.user._id
            },
            event: 'create',
        })

        await eventHandler.publish('posts_ch', {
            body: {id: req.params.postId, commentId: comment.payload._id},
            event: 'addcomment',
        })
        .then(reply => {
            res.status(reply.status).send(polish(comment.payload));
        })
        .catch(next);
    })
    .catch(next);
})

// Delete a post
router.delete('/:id', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {id : req.params.id, user: req.user},
        event: 'delete',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})


// Subscribe to a post
router.post('/:id/subscribe', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {_id : req.params.id},
        event: 'subscribe',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

export default router;