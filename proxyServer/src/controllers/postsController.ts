import express from 'express';
import axios from 'axios';
import HTTPError from '../errors';
import FormData from 'form-data';
import logger from '../utils/logger';
import polish from '../utils/polish'
import Eventhandler from '../events';

const router = express.Router();
const eventHandler = Eventhandler.getInstance();

// Get all posts
router.get('/', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: {},
        event: 'list',
    })
    .then(async posts => {

        const results = await Promise.all(

            posts.payload.map(async(post: { userId: string; user: any; comments : any[]; }) => {

                await eventHandler.publish('users_ch', {
                    body: {query: {_id: post.userId}},
                    event: 'list',
                })
                .then(({ payload }) => {
                    if(payload.length === 0) return;

                    post.user = polish(payload.shift());
                })
                .catch(next);

                await eventHandler.publish('comments_ch', {
                    body: {query: {_id: {$in : post.comments } }},
                    event: 'list',
                })
                .then(async ({ payload }) => {
                    post.comments = [];

                    if(payload.length === 0) {
                        return;
                    }

                    await Promise.all(
                        payload.map(async (comment: { userId: string; user : any, comments: any[]}) => {

                            return await eventHandler.publish('users_ch', {
                                body: {query: {_id: comment.userId}},
                                event: 'list',
                            })
                            .then(async ({ payload }) => {

                                if(payload.length === 0) return;
                                comment.user = polish(payload.shift());
                                delete comment.userId;

                                await Promise.all(comment.comments.map(async sub => {
                                    return await eventHandler.publish('comments_ch', {
                                        body: {query: {_id: sub}},
                                        event: 'list',
                                    })
                                    .then(async (subcomment) => {
                                        comment.comments = [];
                                        if(subcomment.payload.length === 0){
                                            return;
                                        };

                                        return await eventHandler.publish('users_ch', {
                                            body: {query: {_id: subcomment.payload[0].userId}},
                                            event: 'list',
                                        })
                                        .then((user) => {
                                            if(user.payload.length === 0) return;

                                            subcomment.payload[0].user = polish(user.payload.shift());
                                            comment.comments.push(subcomment.payload[0])
                                        })
                                        .catch(next)
                                    })
                                    .catch(next)
                                }))

                                post.comments.push(comment);
                            })
                            .catch(next);
                        })
                    )
                })
                .catch(next);

                return post;
            })
        );

        const r : any[] = []

        results.forEach(e => {
            if(e) r.push(polish(e));
        });

        res.status(posts.status).send(r);
    })
    .catch(next);
})

// Get post by ID
router.get('/:id', async (req, res, next) => {
    eventHandler.publish('posts_ch', {
        body: { _id : req.params.id },
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
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
router.post('/:postId', async (req, res, next) => {
    console.log(req.user)

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