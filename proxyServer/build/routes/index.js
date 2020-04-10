"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usersController_1 = __importDefault(require("../controllers/usersController"));
var postsController_1 = __importDefault(require("../controllers/postsController"));
var commentsController_1 = __importDefault(require("../controllers/commentsController"));
var middlewares_1 = __importDefault(require("../middlewares"));
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
var upload = multer_1.default().array('media');
router.use('*', function (req, res, next) {
    upload(req, res, function (err) {
        if (err)
            return next(err);
        return next();
    });
});
router.use('/users', usersController_1.default);
router.use('/posts', postsController_1.default);
router.use('/comments', commentsController_1.default);
router.use(middlewares_1.default.errorHandler);
router.all('*', function (req, res, next) {
    return res.status(404).send({ error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable" });
});
exports.default = router;
