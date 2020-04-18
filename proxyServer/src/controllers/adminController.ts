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

// Get all users
router.post('/', async (req, res, next) => {
    if(!req.body.username || !req.body.password)
        return res.redirect('/');

    const {username, password} = req.body;

    if(username === 'admin' && password === 'admin')
        return res.redirect('/dashboard?token=xxxxxxxxxx');
    else
        return res.redirect('/');
})

router.post('/certificates', upload, async (req, res, next) => {
    res.send();
})

export default router;

