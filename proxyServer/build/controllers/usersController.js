"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var errors_1 = __importDefault(require("../errors"));
var events_1 = __importDefault(require("../events"));
var authHandler_1 = __importDefault(require("../middlewares/authHandler"));
var router = express.Router();
var eventHandler = events_1.default.getInstance();
// Get all users
router.get('/', authHandler_1.default(["post"]), function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: {},
        event: 'list',
    })
        .then(function (reply) {
        var response = [];
        reply.payload.forEach(function (item) {
            var _id = item._id, name = item.name, email = item.email, scopes = item.scopes, createdAt = item.createdAt, updatedAt = item.updatedAt;
            response.push({
                _id: _id,
                name: name,
                email: email,
                scopes: scopes,
                createdAt: createdAt,
                updatedAt: updatedAt
            });
        });
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Get by ID
router.get('/:email', authHandler_1.default(["profile"]), function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: { email: req.params.email },
        event: 'list',
    })
        .then(function (reply) {
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, scopes = _a.scopes, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            scopes: scopes,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Post a new user
router.post('/', function (req, res, next) {
    var _a;
    delete req.body.scopes;
    if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || !req.headers.authorization.startsWith("Basic "))
        throw new errors_1.default('invalid_request', 'Missing "Authorization" header', 400);
    if (!req.body.email || req.body.email === '')
        throw new errors_1.default('invalid_request', 'Missing "email" field', 400);
    if (!req.body.name || req.body.name === '')
        throw new errors_1.default('invalid_request', 'Missing "name" field', 400);
    if (!req.body.password || req.body.password === '')
        throw new errors_1.default('invalid_request', 'Missing "password" field', 400);
    eventHandler.publish('auth_ch', {
        body: {
            credentials: req.headers.authorization
        },
        event: 'checkcredentials'
    }).then(function () {
        eventHandler.publish('users_ch', {
            body: req.body,
            event: 'create',
        })
            .then(function (reply) {
            var scopes = ['feed', 'post', 'comments', 'profile'];
            var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, password = _a.password, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
            var response = {
                _id: _id,
                name: name,
                email: email,
                scopes: scopes,
                createdAt: createdAt,
                updatedAt: updatedAt
            };
            eventHandler.publish('auth_ch', {
                body: {
                    email: email,
                    password: password,
                    credentials: req.headers.authorization
                },
                event: 'newuser',
            });
            res.status(reply.status).send(response);
        })
            .catch(function (e) {
            eventHandler.publish('auth_ch', {
                body: {
                    email: req.body.email || '',
                },
                event: 'removeuser'
            });
            next(e);
        });
    })
        .catch(next);
});
// Alter a user
router.put('/:email', authHandler_1.default(["profile"]), function (req, res, next) {
    delete req.body.scopes;
    eventHandler.publish('users_ch', {
        body: { email: req.params.email, content: req.body },
        event: 'modify',
    })
        .then(function (reply) {
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, scopes = _a.scopes, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            scopes: scopes,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Delete a user
router.delete('/', authHandler_1.default(["profile"]), function (req, res, next) {
    if (req.headers["content-type"] !== 'application/x-www-form-urlencoded')
        throw new errors_1.default('invalid_request', 'Requests to delete user must be X-WWW-FORM-URLENCODED', 400);
    if (!req.body.password)
        throw new errors_1.default('invalid_request', 'Missing "password" field', 400);
    eventHandler.publish('users_ch', {
        body: { email: req.user.email, password: req.body.password },
        event: 'delete',
    })
        .then(function (reply) {
        eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
            },
            event: 'removeuser'
        });
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, scopes = _a.scopes, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            scopes: scopes,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
exports.default = router;
