import express from 'express';
import usersController from './controllers/usersController';
import authController from './controllers/authController';
import postsController from './controllers/postsController';
import commentsController from './controllers/commentsController';
import error, { HTTPError } from '../errors';
import EventHandler, {injector} from '../events/eventHandler';
import multer from 'multer';

const router = express.Router();

const eventHandler = new EventHandler(process.env.REDIS_SERVER ?? 'redis://localhost:6379/', 'server');

const upload = multer().array('media');

router.use('*', (req, res, next) => {
    upload(req, res, err => {
		if(err) return next(err);
		return next();
	});
})
router.use(injector(eventHandler));
router.use('/users', usersController);
router.use('/posts', postsController);
router.use('/auth', authController);
router.use('/comments', commentsController);

router.use(error);

router.all('*', (req, res, next) => {
	return res.status(404).send({error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable"})
});

export default router;