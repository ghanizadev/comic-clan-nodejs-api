"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var errors_1 = __importDefault(require("../errors"));
var polish_1 = __importDefault(require("../utils/polish"));
var events_1 = __importDefault(require("../events"));
var router = express_1.default.Router();
var eventHandler = events_1.default.getInstance();
// Get all comments
router.get('/', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: {},
        event: 'list',
    })
        .then(function (comments) { return __awaiter(void 0, void 0, void 0, function () {
        var results, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(comments.payload.map(function (comment) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, eventHandler.publish('users_ch', {
                                        body: { query: { _id: comment.userId } },
                                        event: 'list',
                                    })
                                        .then(function (_a) {
                                        var payload = _a.payload;
                                        if (payload.length === 0)
                                            return;
                                        comment.user = polish_1.default(payload[0]);
                                    })
                                        .catch(next)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, comment];
                            }
                        });
                    }); }))];
                case 1:
                    results = _a.sent();
                    r = [];
                    results.forEach(function (e) {
                        if (e)
                            r.push(e);
                    });
                    res.status(comments.status).send(r);
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(next);
});
// Get post by ID
router.get('/:id', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'list',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
// Comment to a comment
router.post('/:commentId', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: { query: { _id: req.params.commentId } },
        event: 'list',
    })
        .then(function (_a) {
        var payload = _a.payload;
        return __awaiter(void 0, void 0, void 0, function () {
            var comment;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (Array.isArray(payload) && payload.length === 0)
                            throw new errors_1.default('invalid_request', 'Comment was not found or it was deleted', 404);
                        return [4 /*yield*/, eventHandler.publish('comments_ch', {
                                body: {
                                    body: req.body.body,
                                    media: req.body.media,
                                    rel: req.params.commentId,
                                    userId: req.user._id,
                                    acceptComments: false
                                },
                                event: 'create',
                            })];
                    case 1:
                        comment = _b.sent();
                        return [4 /*yield*/, eventHandler.publish('comments_ch', {
                                body: { id: req.params.commentId, commentId: comment.payload._id },
                                event: 'addcomment',
                            })
                                .then(function (reply) {
                                res.status(reply.status).send(polish_1.default(comment.payload));
                            })
                                .catch(next)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    })
        .catch(next);
});
// Alter a post
router.put('/:id', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: { _id: req.params.id, content: req.body },
        event: 'modify',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
// Delete a comment
router.delete('/:id', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'delete',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
// Subscribe to a comment
router.post('/:id', function (req, res, next) {
    eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'subscribe',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
exports.default = router;
