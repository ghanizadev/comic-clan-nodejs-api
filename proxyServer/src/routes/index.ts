import express from 'express';
import usersController from '../controllers/usersController';
import postsController from '../controllers/postsController';
import commentsController from '../controllers/commentsController';
import middlewares from '../middlewares';
import EventHandler from '../events';
import multer from 'multer';

const router = express.Router();
const upload = multer().array('media');

router.use('*', (req, res, next) => {
    upload(req, res, err => {
		if(err) return next(err);
		return next();
	});
})

router.use('/users', usersController);
router.use('/posts', postsController);
router.use('/comments', commentsController);

router.use(middlewares.errorHandler);

router.all('*', (req, res, next) => {
	return res.status(404).send({error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable"})
});

export default router;