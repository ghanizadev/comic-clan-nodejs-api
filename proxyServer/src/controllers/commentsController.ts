import express from 'express';
import axios from 'axios';
import { HTTPError } from '../errors';
import FormData from 'form-data';
import logger from '../utils/logger';
import polish from '../utils/polish'

const router = express.Router();

// Get all comments
router.get('/', (req, res, next) => {
    req.eventHandler.publish('comments_ch', {
        body: {},
        event: 'list',
    })
    .then(async posts => {
        const results = await Promise.all(posts.payload.map(
            async (post: { userId: any; user: any; }) => {
                return await req.eventHandler.publish('users_ch', {
                    body: {query: {_id: post.userId}},
                    event: 'list',
                })
                .then(({ payload }) => {
                    delete payload[0].password;
                    delete payload[0].active;

                    post.user = payload[0];
                    return post;
                })
                .catch(next);
        }))
        res.status(posts.status).send(polish(results));
    })
    .catch(next);
})

// Get post by ID
router.get('/:id', (req, res, next) => {
    req.eventHandler.publish('comments_ch', {
        body: { _id : req.params.id },
        event: 'list',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next)
})

// Create a new comment
router.post('/', (req, res, next) => {
    const form = new FormData();

    req.eventHandler.publish('posts_ch', {
        body: {query: {_id: req.body.postId}},
        event: 'list',
    })
    .then(async () => {
        const comment = await req.eventHandler.publish('comments_ch', {
            body: req.body,
            event: 'create',
        })

        console.log(comment)

        req.eventHandler.publish('posts_ch', {
            body: {_id: req.body.postId, commentId: comment.payload._id},
            event: 'addcomment',
        })
        .then(reply => {
            res.status(reply.status).send(polish(comment.payload));
        })
        .catch(next);
    })
    .catch(next);

    // if(Array.isArray(req.files)){;
    //     req.files.forEach(file => {
    //         form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
    //     })
    // }else {
    //     form.append('media', req.file);
    // }
    // axios.post('http://localhost:3001/?id' + req.params.id, form, {headers: form.getHeaders(), validateStatus: (status) => status < 500 })
    // .then(response => {
        
    // })
    // .catch(next);
})

// Alter a post
router.put('/:id', (req, res, next) => {
    const form = new FormData();

    if(Array.isArray(req.files)){;
        req.files.forEach(file => {
            form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
        })
    }
    axios.post('http://localhost:3001/?id' + req.params.id, form, {headers: form.getHeaders(), validateStatus: (status) => status < 500 })
    .then(response => {
        req.body.media = response.data;
        req.eventHandler.publish('comments_ch', {
            body: {_id : req.params.id, content: req.body},
            event: 'modify',
        })
        .then(reply => {
            res.status(reply.status).send(polish(reply));
        })
        .catch(next)
    })
    .catch(next);
})

// Delete a post
router.delete('/:id', (req, res, next) => {
    req.eventHandler.publish('comments_ch', {
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
    req.eventHandler.publish('comments_ch', {
        body: {_id : req.params.id},
        event: 'subscribe',
    })
    .then(reply => {
        res.status(reply.status).send(polish(reply));
    })
    .catch(next);
})

export default router;