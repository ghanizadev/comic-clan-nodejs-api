import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({status: 200, message: 'Welcome to users!'})
})

export default router;