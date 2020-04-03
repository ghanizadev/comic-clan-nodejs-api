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
var models_1 = __importDefault(require("../models"));
var error_1 = __importDefault(require("../error"));
var database = new models_1.default('mongodb://localhost:27017', 'comicclan');
var Post = database.getModel();
database.connect();
exports.default = {
    create: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            var _this = this;
            return __generator(this, function (_a) {
                user = new Post(body);
                return [2 /*return*/, user.save()
                        .then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                        var _id, _v, userId, description, comments, body, media, createdAt, updatedAt;
                        return __generator(this, function (_a) {
                            _id = doc._id, _v = doc._v, userId = doc.userId, description = doc.description, comments = doc.comments, body = doc.body, media = doc.media, createdAt = doc.createdAt, updatedAt = doc.updatedAt;
                            return [2 /*return*/, {
                                    _id: _id,
                                    userId: userId,
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
                        throw new error_1.default('failed_to_save', err.message, 400);
                    })];
            });
        });
    },
    list: function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post.find(body.query).exec()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    },
    modify: function (modifiedPost) {
        return __awaiter(this, void 0, void 0, function () {
            var queryPost, _id, _v, userId, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post.findOneAndUpdate({ _id: modifiedPost._id }, modifiedPost.content, { new: true }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost) {
                            throw new error_1.default('not_found', "post with id=" + modifiedPost._id + " does not exist or it is deleted", 404);
                        }
                        _id = queryPost._id, _v = queryPost._v, userId = queryPost.userId, comments = queryPost.comments, description = queryPost.description, body = queryPost.body, media = queryPost.media, createdAt = queryPost.createdAt, updatedAt = queryPost.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                userId: userId,
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
            var queryPost, result, _id, _v, userId, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post.findOne({ _id: modifiedPost._id }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost || !queryPost.comments)
                            return [2 /*return*/];
                        if (Array.isArray(modifiedPost.commentsId)) {
                            modifiedPost.commentsId = Array.prototype.concat(queryPost.comments, modifiedPost.commentsId);
                        }
                        else {
                            queryPost.comments.push(modifiedPost.commentsId);
                        }
                        return [4 /*yield*/, queryPost.save()];
                    case 2:
                        result = _a.sent();
                        if (!result) {
                            throw new error_1.default('not_found', "post with id=" + modifiedPost._id + " does not exist or it is deleted", 404);
                        }
                        _id = result._id, _v = result._v, userId = result.userId, comments = result.comments, description = result.description, body = result.body, media = result.media, createdAt = result.createdAt, updatedAt = result.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                userId: userId,
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
        return __awaiter(this, void 0, void 0, function () {
            var queryPost, result, _id, _v, userId, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post.findOne({ _id: modifiedPost._id }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost || !queryPost.media)
                            return [2 /*return*/];
                        if (Array.isArray(modifiedPost.photosURL)) {
                            modifiedPost.photosURL = Array.prototype.concat(queryPost.media, modifiedPost.photosURL);
                        }
                        else {
                            queryPost.media.push(modifiedPost.photosURL);
                        }
                        return [4 /*yield*/, queryPost.save()];
                    case 2:
                        result = _a.sent();
                        if (!result) {
                            throw new error_1.default('not_found', "post with id=" + modifiedPost._id + " does not exist or it is deleted", 404);
                        }
                        if (!queryPost) {
                            throw new error_1.default('not_found', "post with id=" + modifiedPost._id + " does not exist or it is deleted", 404);
                        }
                        _id = queryPost._id, _v = queryPost._v, userId = queryPost.userId, comments = queryPost.comments, description = queryPost.description, body = queryPost.body, media = queryPost.media, createdAt = queryPost.createdAt, updatedAt = queryPost.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                userId: userId,
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
            var queryPost, _id, _v, userId, comments, description, body, media, createdAt, updatedAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post.findOneAndDelete({ _id: deleteOptions._id }).exec()];
                    case 1:
                        queryPost = _a.sent();
                        if (!queryPost) {
                            throw new error_1.default('not_found', "post with id=" + deleteOptions._id + " does not exist or it is deleted", 404);
                        }
                        _id = queryPost._id, _v = queryPost._v, userId = queryPost.userId, comments = queryPost.comments, description = queryPost.description, body = queryPost.body, media = queryPost.media, createdAt = queryPost.createdAt, updatedAt = queryPost.updatedAt;
                        return [2 /*return*/, {
                                _id: _id,
                                userId: userId,
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
