import express from 'express';
import controller from '../controllers'
import fs from 'fs';
import path from 'path';
import errorHandler from '../middlewares/errorHandler';
import convert from 'pem-jwk';

const router = express.Router();

router.post('/token', controller.authorize);
router.post('/revoke', controller.revoke);
router.get('/signature', (req, res, next) => {
    res.set('Content-Type', 'application/jwk+json');

    const file = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public-access.pem'), 'ascii')
    const jwk = convert.pem2jwk(file);
    res.status(201).send(jwk)
});

router.use(errorHandler);


export default router;