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
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var polish_1 = __importDefault(require("../../utils/polish"));
var router = express_1.default.Router();
// Get all posts
router.get('/', function (req, res, next) {
    req.eventHandler.publish('comments_ch', {
        body: {},
        event: 'list',
    })
        .then(function (posts) { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(posts.payload.map(function (post) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, req.eventHandler.publish('users_ch', {
                                        body: { query: { _id: post.userId } },
                                        event: 'list',
                                    })
                                        .then(function (_a) {
                                        var payload = _a.payload;
                                        delete payload[0].password;
                                        delete payload[0].active;
                                        post.user = payload[0];
                                        return post;
                                    })
                                        .catch(next)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }))];
                case 1:
                    results = _a.sent();
                    res.status(posts.status).send(polish_1.default(results));
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(next);
});
// Get post by ID
router.get('/:id', function (req, res, next) {
    req.eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'list',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
// Create a new post
router.post('/', function (req, res, next) {
    var form = new form_data_1.default();
    if (Array.isArray(req.files)) {
        ;
        req.files.forEach(function (file) {
            form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
        });
    }
    axios_1.default.post('http://localhost:3001/?id' + req.params.id, form, { headers: form.getHeaders(), validateStatus: function (status) { return status < 500; } })
        .then(function (response) {
        req.eventHandler.publish('posts_ch', {
            body: { query: { _id: req.body.userId } },
            event: 'list',
        })
            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req.body.media = response.data;
                        return [4 /*yield*/, req.eventHandler.publish('comments_ch', {
                                body: req.body,
                                event: 'create',
                            })];
                    case 1:
                        _a.sent();
                        req.eventHandler.publish('posts_ch', {
                            body: req.body,
                            event: 'modify',
                        })
                            .then(function (reply) {
                            res.status(reply.status).send(polish_1.default(reply));
                        })
                            .catch(next);
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(next);
    })
        .catch(next);
});
// Alter a post
router.put('/:id', function (req, res, next) {
    var form = new form_data_1.default();
    if (Array.isArray(req.files)) {
        ;
        req.files.forEach(function (file) {
            form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
        });
    }
    axios_1.default.post('http://localhost:3001/?id' + req.params.id, form, { headers: form.getHeaders(), validateStatus: function (status) { return status < 500; } })
        .then(function (response) {
        req.body.media = response.data;
        req.eventHandler.publish('comments_ch', {
            body: { _id: req.params.id, content: req.body },
            event: 'modify',
        })
            .then(function (reply) {
            res.status(reply.status).send(polish_1.default(reply));
        })
            .catch(next);
    })
        .catch(next);
});
// Delete a post
router.delete('/:id', function (req, res, next) {
    req.eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'delete',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
// Subscribe to a post
router.post('/:id', function (req, res, next) {
    req.eventHandler.publish('comments_ch', {
        body: { _id: req.params.id },
        event: 'subscribe',
    })
        .then(function (reply) {
        res.status(reply.status).send(polish_1.default(reply));
    })
        .catch(next);
});
exports.default = router;
