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
var events_1 = __importDefault(require("../events"));
var database_1 = __importDefault(require("../database"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var errors_1 = require("../errors");
var eventHandler = new events_1.default(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth_ch');
eventHandler.listen();
var db = database_1.default.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth');
//TODO: Deixar legivel
eventHandler.on('newuser', function (message) {
    db.hset(message.body.email, 'password', message.body.password);
});
eventHandler.on('removeuser', function (message) {
    db.del(message.body.email);
});
var issueNewToken = function (username, password, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (res, rej) {
                    db.hget(username, 'password', function (error, value) {
                        if (error)
                            rej(error);
                        if (!value)
                            rej('not_found');
                        res(value);
                    });
                })
                    .then(function (value) { return __awaiter(void 0, void 0, void 0, function () {
                    var hash, accessKey, refreshKey, access_token, refresh_token;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bcrypt_1.default.hash(password, process.env.PASSWORD_SALT || 8)];
                            case 1:
                                hash = _a.sent();
                                if (hash === value) {
                                    accessKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
                                    refreshKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();
                                    access_token = jsonwebtoken_1.default.sign({ username: username }, accessKey, { algorithm: 'RS256', expiresIn: '1h', });
                                    refresh_token = jsonwebtoken_1.default.sign({ username: username }, refreshKey, { algorithm: 'RS256' });
                                    db.hset(username, 'refreshToken', refresh_token);
                                    return [2 /*return*/, {
                                            token_type: 'bearer',
                                            access_token: access_token,
                                            expires_in: 60 * 60,
                                            refresh_token: refresh_token,
                                            scope: 'feed;profile;post;comment'
                                        }];
                                }
                                else {
                                    throw new errors_1.HTTPError('unauthorized_client', 'user does not exists, it had been deleted or username and password does not match', 401);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }).catch(next)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var issueFromRefreshToken = function (token, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accessKey, refreshKey, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
                refreshKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();
                return [4 /*yield*/, new Promise(function (res, rej) {
                        payload = jsonwebtoken_1.default.verify(token, refreshKey, { algorithms: ['RS256'] });
                        console.log(payload);
                        db.hget(payload.username || '', 'refreshToken', function (error, value) {
                            if (error)
                                rej(error);
                            if (!value)
                                rej('not_found');
                            res(value);
                        });
                    })
                        .then(function (value) {
                        if (value === token) {
                            var username = payload.username;
                            var access_token = jsonwebtoken_1.default.sign({ username: username }, accessKey, { algorithm: 'RS256', expiresIn: '1h', });
                            var refresh_token = jsonwebtoken_1.default.sign({ username: username }, refreshKey, { algorithm: 'RS256' });
                            db.hset(username || '', 'refreshToken', refresh_token);
                            return {
                                token_type: 'bearer',
                                access_token: access_token,
                                expires_in: 60 * 60,
                                refresh_token: refresh_token,
                                scope: 'feed;profile;post;comment'
                            };
                        }
                        else {
                            throw new errors_1.HTTPError('unauthorized_client', 'username and password does not match', 401);
                        }
                    }).catch(next)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.default = {
    authorize: function (req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var auth, _g, clientId_1, clientSecret_1, token, token, e_1;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 9, , 10]);
                        if (((_a = req.headers) === null || _a === void 0 ? void 0 : _a["content-type"]) !== 'application/x-www-form-urlencoded') {
                            throw new errors_1.HTTPError('invalid_request', 'request is malformed, it must be application/x-www-form-urlencoded', 400);
                        }
                        if (!!((_c = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization) === null || _c === void 0 ? void 0 : _c.startsWith('Basic'))) return [3 /*break*/, 1];
                        throw new errors_1.HTTPError('invalid_client', 'a client id and a client secret must be provided');
                    case 1:
                        auth = req.headers.authorization.split(' ')[1];
                        auth = Buffer.from(auth, 'base64').toString();
                        _g = auth.split(':'), clientId_1 = _g[0], clientSecret_1 = _g[1];
                        return [4 /*yield*/, new Promise(function (res, rej) {
                                db.hget('clients', clientId_1, function (error, value) {
                                    if (error)
                                        rej(error);
                                    if (!value)
                                        rej('not_found');
                                    res(value);
                                });
                            })
                                .then(function (value) {
                                if (value !== clientSecret_1)
                                    throw new errors_1.HTTPError('invalid_client', 'client id and client secret does not match', 401);
                            })];
                    case 2:
                        _h.sent();
                        _h.label = 3;
                    case 3:
                        if (!(((_d = req.body) === null || _d === void 0 ? void 0 : _d.grant_type) === 'refresh_token')) return [3 /*break*/, 5];
                        return [4 /*yield*/, issueFromRefreshToken(req.body.refresh_token, next)];
                    case 4:
                        token = _h.sent();
                        res.status(201).send(token);
                        return [3 /*break*/, 8];
                    case 5:
                        if (!(((_e = req.body) === null || _e === void 0 ? void 0 : _e.grant_type) === 'password')) return [3 /*break*/, 7];
                        return [4 /*yield*/, issueNewToken(req.body.username, req.body.password, next)];
                    case 6:
                        token = _h.sent();
                        res.status(201).send(token);
                        return [3 /*break*/, 8];
                    case 7:
                        if (['authorization_code', 'device_code', 'client_credentials'].includes((_f = req.body) === null || _f === void 0 ? void 0 : _f.grant_type)) {
                            throw new errors_1.HTTPError('unsupported_grant_type', 'supproted grant types are: password; refresh_token');
                        }
                        else {
                            throw new errors_1.HTTPError('invalid_grant_type', 'please, provide a valid grant type');
                        }
                        _h.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_1 = _h.sent();
                        next(e_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    refresh: function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (((_a = req.headers) === null || _a === void 0 ? void 0 : _a["content-type"]) !== 'application/x-www-form-urlencoded') {
                            throw new errors_1.HTTPError('invalid_request', 'request is malformed, it must be application/x-www-form-urlencoded');
                        }
                        return [4 /*yield*/, new Promise(function (res, rej) {
                                db.hget(req.body.username, 'password', function (error, value) {
                                    if (error)
                                        rej(error);
                                    if (!value)
                                        rej('not_found');
                                    res(value);
                                });
                            })
                                .then(function (value) { return __awaiter(_this, void 0, void 0, function () {
                                var hash, accessKey, refreshKey, access_token, refresh_token;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, bcrypt_1.default.hash(req.body.password, process.env.PASSWORD_SALT || 8)];
                                        case 1:
                                            hash = _a.sent();
                                            if (hash === value) {
                                                accessKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
                                                refreshKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();
                                                access_token = jsonwebtoken_1.default.sign({ username: req.body.username }, accessKey, { algorithm: 'RS256', expiresIn: '1h', });
                                                refresh_token = jsonwebtoken_1.default.sign({ username: req.body.username }, refreshKey, { algorithm: 'RS256' });
                                                db.hset(req.body.username, 'refreshToken', refresh_token);
                                                res.status(201).send({
                                                    token_type: 'bearer',
                                                    access_token: access_token,
                                                    expires_in: 60 * 60,
                                                    refresh_token: refresh_token,
                                                    scope: 'feed;profile;post;comment'
                                                });
                                            }
                                            else {
                                                res.status(401).send();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).catch(console.error)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _b.sent();
                        next(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    revoke: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db.hset(req.body.username, 'refreshToken', '', function (error, value) {
                        if (error)
                            return res.status(500).send(error);
                        if (!value)
                            return res.status(404).send('not_found');
                        return res.sendStatus(204);
                    })];
            });
        });
    },
};
