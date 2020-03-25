import express from 'express';
import usersController from './controllers/usersController';
import authController from './controllers/authController';
import postsController from './controllers/postsController';
import commentsController from './controllers/commentsController';

const router = express.Router();

router.use('/users', usersController);
router.use('/posts', postsController);
router.use('/auth', authController);
router.use('/comments', commentsController);

router.all('*', (req, res, next) => {
	return res.status(404).send({error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable"})
});

export default router;