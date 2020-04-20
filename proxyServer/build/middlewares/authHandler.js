"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = __importDefault(require("../errors"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var events_1 = require("../events");
var accessKeyPub = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'public-access.pem'));
exports.default = (function (scopes) {
    return function (req, res, next) {
        var _a;
        try {
            if (!((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer "))) {
                throw new errors_1.default('invalid_request', 'Missing Authentication header. A token of type "Bearer" must be provided', 400);
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload_1 = jsonwebtoken_1.default.verify(token, accessKeyPub, { algorithms: ['RS256', 'RS512'] });
            events_1.eventHandler.publish('users_ch', { event: 'single', body: { query: { email: payload_1.username } } })
                .then(function (user) {
                if (!user)
                    throw new errors_1.default('unauthorized_client', 'User was not found or it was deleted', 403);
                if (user.payload.scopes.filter(function (s) { return scopes.includes(s); }).length !== scopes.length)
                    throw new errors_1.default('unauthorized_client', "User must have " + scopes.toString() + " scopes in order to access this endpoint", 403);
                req.user = payload_1[0];
                next();
            })
                .catch(next);
        }
        catch (e) {
            if (['invalid token', 'invalid signature', 'jwt malformed'].includes(e.message)) {
                next({ error: 'invalid_request', error_description: 'The provided token is invalid or it is in an unsuported format', status: 401 });
            }
            else if (e.message === 'jwt expired') {
                next({ error: 'invalid_request', error_description: 'The provided token is expired, please require a new one', status: 401 });
            }
            next(e);
        }
    };
});
