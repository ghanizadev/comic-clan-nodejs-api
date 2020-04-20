import express from 'express';
import EventHandler from '../events';
import path from 'path';
import multer from 'multer';

const router = express.Router();
const eventHandler = EventHandler.getInstance();

const upload = multer().fields([
    {name: 'accessToken', maxCount: 1},
    {name: 'refreshToken', maxCount: 1},
    {name: 'server', maxCount: 1},
]);

router.post('/config', async (req, res, next) => {
    try{
        eventHandler.publish('configs_ch', {
            event: 'set',
            body: req.body
        })
        .then(reply => {
            return res.status(reply.status).send(reply.payload);
        })
        .catch(next);
    } catch(e){
        return next(e);
    }
})

router.get('/config', async (req, res, next) => {
    try{
        eventHandler.publish('configs_ch', {
            event: 'get',
            body: req.body
        })
        .then(reply => {
            return res.status(reply.status).send(reply.payload);
        })
        .catch(next);
    } catch(e){
        return next(e);
    }
})



router.post('/certificates', upload, async (req, res, next) => {
    res.send();
})

export default router;
