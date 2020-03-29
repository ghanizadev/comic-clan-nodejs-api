import express from 'express';
import axios from 'axios';
import { HTTPError } from '../../errors';
import FormData from 'form-data';
import logger from '../../utils/logger';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

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
    .catch(e => { 
        logger.error(e);
        throw new HTTPError('failed_to_upload', 'an unespected error was caught, please try again later.', 500)
    })
})

export default router;