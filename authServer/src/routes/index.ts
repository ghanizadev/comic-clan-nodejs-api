import express from 'express';
import controller from '../controllers'
import fs from 'fs';
import path from 'path';
import errorHandler from '../middlewares/errorHandler';

const router = express.Router();

router.post('/token', controller.authorize);
router.post('/revoke', controller.revoke);
router.get('/token_key', (req, res, next) => {
    const file = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'access_token_pub.crt')).toString();
    res.status(201).send(file)
});

router.use(errorHandler);


export default router;