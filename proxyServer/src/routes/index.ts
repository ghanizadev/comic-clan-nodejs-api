import express from 'express';
import usersController from '../controllers/usersController';
import postsController from '../controllers/postsController';
import commentsController from '../controllers/commentsController';
import adminController from '../controllers/adminController';
import errorHandler from '../middlewares/errorHandler';
import authHandler from '../middlewares/authHandler'

const router = express.Router();

router.use('/users', usersController);
router.use('/posts', authHandler(['post']), postsController);
router.use('/comments', authHandler(['comment']), commentsController);
router.use('/admin', authHandler(['administrator']), adminController);

router.all('*', (req, res, next) => {
	return res.status(404).send({error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable"})
});

export default router;