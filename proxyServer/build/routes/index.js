"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usersController_1 = __importDefault(require("../controllers/usersController"));
var postsController_1 = __importDefault(require("../controllers/postsController"));
var commentsController_1 = __importDefault(require("../controllers/commentsController"));
var adminController_1 = __importDefault(require("../controllers/adminController"));
var authHandler_1 = __importDefault(require("../middlewares/authHandler"));
var router = express_1.default.Router();
router.use('/users', usersController_1.default);
router.use('/posts', authHandler_1.default(['posts']), postsController_1.default);
router.use('/comments', authHandler_1.default(['comments']), commentsController_1.default);
router.use('/admin', authHandler_1.default(['administrator']), adminController_1.default);
// router.use(errorHandler);
router.all('*', function (req, res, next) {
    return res.status(404).send({ error: 'not_found', error_description: "This endpoint was deleted, moved or it is currently unavailable" });
});
exports.default = router;
