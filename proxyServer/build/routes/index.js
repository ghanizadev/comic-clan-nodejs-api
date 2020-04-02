"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usersController_1 = __importDefault(require("./controllers/usersController"));
var authController_1 = __importDefault(require("./controllers/authController"));
var postsController_1 = __importDefault(require("./controllers/postsController"));
var commentsController_1 = __importDefault(require("./controllers/commentsController"));
var errors_1 = __importDefault(require("../errors"));
var eventHandler_1 = __importStar(require("../events/eventHandler"));
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
var eventHandler = new eventHandler_1.default((_a = process.env.REDIS_SERVER) !== null && _a !== void 0 ? _a : '', 'server');
var upload = multer_1.default().array('media');
router.use('*', function (req, res, next) {
    upload(req, res, function (err) {
        if (err)
            return next(err);
        return next();
    });
});
router.use(eventHandler_1.injector(eventHandler));
router.use('/users', usersController_1.default);
router.use('/posts', postsController_1.default);
router.use('/auth', authController_1.default);
router.use('/comments', commentsController_1.default);
router.use(errors_1.default);
router.all('*', function (req, res, next) {
    return res.status(404).send({ error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable" });
});
exports.default = router;
