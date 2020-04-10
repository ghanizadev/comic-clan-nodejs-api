import express from 'express';
import s3 from '../services/aws';
// import { MultiStream } from '../utils/streamifier';
import { HTTPError } from '../errors'
import multer from 'multer';
import middlewares from '../middlewares';
import logger from '../utils/logger';
import EventHandler from '../events';
import aws from 'aws-sdk';

const router = express.Router();
const upload = multer()

const eventHandler = EventHandler.getInstance();
eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'uploads_ch')


router.post('/', upload.single('media'), async (req, res, next) => {
    try {
        const {file} = req;

        const data = await s3.upload(file.buffer, file.originalname.split('.')[1]);
        res.send(data.Location);

    } catch(e) {
        console.error(e)
        next(e)}
})

router.patch('/:id', (req, res, next) => {

    s3.renameFile(req.params.id, `${req.body.id}_${req.params.id.substring(2)}`)
    .then(() => {
        eventHandler.publish(req.body.type + 's_ch', { body: { id: req.body.id, file: `${req.body.id}_${req.params.id.substring(2)}` }, event: 'addmedia'})
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next)
    })
    .catch(next)
})

router.use(middlewares.errorHandler);

export default router;