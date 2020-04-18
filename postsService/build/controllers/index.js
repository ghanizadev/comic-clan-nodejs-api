"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var errors_1 = __importDefault(require("../errors"));
var postsSchema_1 = __importDefault(require("../models/postsSchema"));
var events_1 = __importDefault(require("../events"));
var eventHandler = events_1.default.getInstance();
exports.default = {
    create: function (body, user) {
        return __awaiter(this, void 0, void 0, function () {
            var save, post, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        save = __assign(__assign({}, body), { userId: user._id });
                        post = new postsSchema_1.default(save);
                        return [4 /*yield*/, post.save()
                                .then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                var _id, _v, user, description, comments, body, media, createdAt, updatedAt;
                                return __generator(this, function (_a) {
                                    _id = doc._id, _v = doc._v, user = doc.user, description = doc.description, comments = doc.comments, body = doc.body, media = doc.media, createdAt = doc.createdAt, updatedAt = doc.updatedAt;
                                    return [2 /*return*/, {
                                            _id: _id,
                                            user: user,
                                            description: description,
                                            body: body,
                                            media: media,
                                            comments: comments,
                                            createdAt: createdAt,
                                            updatedAt: updatedAt,
                                            _v: _v,
                                        }];
                                });
                            }); })
                                .catch(function (err) {
                                throw new errors_1.default('failed_to_save', err.message, 400);
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    },
    list: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var posts, promises, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, postsSchema_1.default.paginate(body.query, body.pagination || {})];
                    case 1:
                        posts = _a.sent();
                        promises = [];
                        if (Array.isArray(posts.docs))
                            posts.docs.forEach(function (doc) {
                                var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var id, post;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                id = doc.userId;
                                                return [4 /*yield*/, eventHandler.publish('users_ch', {
                                                        event: 'list',
                                                        body: { query: { _id: id } }
                                                    }).then(function (res) {
                                                        var user = res.payload.shift();
                                                        delete user.password;
                                                        delete user.active;
                                                        post = doc.toObject();
                                                        delete post.userId;
                                                        post = __assign(__assign({}, post), { user: user });
                                                    })
                                                        .catch(reject)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, eventHandler.publish('comments_ch', {
                                                        event: 'list',
                                                        body: { query: { _id: { $in: post.comments } } }
                                                    }).then(function (comments) {
                                                        post.comments = comments.payload;
                                                        resolve(post);
                                                    })
                                                        .catch(reject)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                promises.push(promise);
                            });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        result = _a.sent();
                        posts.docs = result;
                        return [2 /*return*/, posts];
                }
            });
        });
    },
    single: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var post, user_1, comments_1, id, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, postsSchema_1.default.findById(body.query._id)];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            throw new errors_1.default('not_found', 'This post was not found. It might been deleted', 404);
                        id = post.userId;
                        return [4 /*yield*/, eventHandler.publish('users_ch', {
                                event: 'list',
                                body: { query: { _id: id } }
                            })
                                .then(function (res) {
                                var userFetched = res.payload.shift();
                                delete userFetched.password;
                                delete userFetched.active;
                                user_1 = userFetched;
                            })
                                .catch(function (e) {
                                throw new errors_1.default(e);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, eventHandler.publish('comments_ch', {
                                event: 'list',
                                body: { query: { _id: { $in: post.comments } } }
                            })
                                .then(function (commentsFetched) {
                                comments_1 = commentsFetched.payload;
                            })
                                .catch(function (e) {
                                throw new errors_1.default(e);
                            })];
                    case 3:
                        _a.sent();
                        result = post.toObject();
                        result === null || result === void 0 ? true : delete result.userId;
                        return [2 /*return*/, __assign(__assign({}, result), { user: user_1,
                                comments: comments_1 })];
                    case 4:
                        e_1 = _a.sent();
                        if (e_1.name === "CastError")
                            throw new errors_1.default('not_found', 'This post was not found. It might been deleted', 404);
                        throw new errors_1.default(e_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    modify: function (modifiedPost) {
        return __awaiter(this, void 0, void 0, function () {
            var queryPost, doc, _id, _v, user, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, postsSchema_1.default.findOne({ _id: modifiedPost._id }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost) {
                            throw new errors_1.default('not_found', "post with id=" + modifiedPost._id + " does not exist or it is deleted", 404);
                        }
                        if (queryPost.userId !== modifiedPost.user.id) {
                            throw new errors_1.default('invalid_request', "user is not permited to modify or delete this request", 403);
                        }
                        queryPost.set(modifiedPost.content);
                        return [4 /*yield*/, queryPost.save()];
                    case 2:
                        doc = _a.sent();
                        _id = doc._id, _v = doc._v, user = doc.user, comments = doc.comments, description = doc.description, body = doc.body, media = doc.media, createdAt = doc.createdAt, updatedAt = doc.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                user: user,
                                description: description,
                                body: body,
                                media: media,
                                comments: comments,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                _v: _v,
                            }];
                }
            });
        });
    },
    addComment: function (modifiedPost) {
        return __awaiter(this, void 0, void 0, function () {
            var queryPost, result, _id, _v, user, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, postsSchema_1.default.findOne({ _id: modifiedPost.id }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost)
                            throw new errors_1.default('invalid_request', 'It is not possible to reply a reply', 400);
                        queryPost.comments.push(modifiedPost.commentId);
                        return [4 /*yield*/, queryPost.save()];
                    case 2:
                        result = _a.sent();
                        if (!result) {
                            throw new errors_1.default('not_found', "Post does not exist or it is deleted", 404);
                        }
                        _id = result._id, _v = result._v, user = result.user, comments = result.comments, description = result.description, body = result.body, media = result.media, createdAt = result.createdAt, updatedAt = result.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                user: user,
                                description: description,
                                body: body,
                                media: media,
                                comments: comments,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                _v: _v,
                            }];
                }
            });
        });
    },
    addMedia: function (modifiedPost) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var queryPost, result, _id, _v, user, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, postsSchema_1.default.findOne({ _id: modifiedPost.id }).exec()];
                    case 1:
                        queryPost = _b.sent();
                        if (!queryPost) {
                            throw new errors_1.default('not_found', "post with id=" + modifiedPost.id + " does not exist or it is deleted", 404);
                        }
                        (_a = queryPost.media) === null || _a === void 0 ? void 0 : _a.push(modifiedPost.file);
                        return [4 /*yield*/, queryPost.save()];
                    case 2:
                        result = _b.sent();
                        if (!result) {
                            throw new errors_1.default('not_found', "post with id=" + modifiedPost.id + " does not exist or it is deleted", 404);
                        }
                        _id = queryPost._id, _v = queryPost._v, user = queryPost.user, comments = queryPost.comments, description = queryPost.description, body = queryPost.body, media = queryPost.media, createdAt = queryPost.createdAt, updatedAt = queryPost.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                user: user,
                                description: description,
                                body: body,
                                media: media,
                                comments: comments,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                _v: _v,
                            }];
                }
            });
        });
    },
    delete: function (deleteOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var find, _id, _v, user, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, postsSchema_1.default.findById(deleteOptions.id).exec()];
                    case 1:
                        find = _a.sent();
                        if (!find) {
                            throw new errors_1.default('not_found', "post with id=" + deleteOptions.id + " does not exist or it is deleted", 404);
                        }
                        if (find.userId !== deleteOptions.user.id) {
                            throw new errors_1.default('invalid_request', "user is not permited to modify or delete this request", 403);
                        }
                        return [4 /*yield*/, postsSchema_1.default.findByIdAndDelete(deleteOptions.id).exec()];
                    case 2:
                        _a.sent();
                        _id = find._id, _v = find._v, user = find.user, comments = find.comments, description = find.description, body = find.body, media = find.media, createdAt = find.createdAt, updatedAt = find.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                user: user,
                                description: description,
                                body: body,
                                media: media,
                                comments: comments,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                _v: _v,
                            }];
                }
            });
        });
    }
};
