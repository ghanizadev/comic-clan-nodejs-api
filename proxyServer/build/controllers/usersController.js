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
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var errors_1 = require("../errors");
var events_1 = __importDefault(require("../events"));
var router = express.Router();
var eventHandler = events_1.default.getInstance();
// Get all users
router.get('/', function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: {},
        event: 'list',
    })
        .then(function (reply) {
        var response = [];
        reply.payload.forEach(function (item) {
            var _id = item._id, name = item.name, email = item.email, createdAt = item.createdAt, updatedAt = item.updatedAt;
            response.push({
                _id: _id,
                name: name,
                email: email,
                createdAt: createdAt,
                updatedAt: updatedAt
            });
        });
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Get by ID
router.get('/:email', function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: { email: req.params.email },
        event: 'list',
    })
        .then(function (reply) {
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, password = _a.password, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Post a new user
router.post('/', function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: req.body,
        event: 'create',
    })
        .then(function (reply) {
        eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
                password: reply.payload.password,
            },
            event: 'newuser'
        });
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, password = _a.password, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Post a new media for an user
router.post('/:userId/images', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var form;
    return __generator(this, function (_a) {
        form = new form_data_1.default();
        if (Array.isArray(req.files)) {
            ;
            req.files.forEach(function (file) {
                form.append('media', file.buffer, { filename: file.originalname, contentType: file.mimetype });
            });
        }
        axios_1.default.post(process.env.UPLOAD_HOST || '', form, { headers: form.getHeaders(), validateStatus: function (status) { return status < 500; } })
            .then(function (response) {
            res.status(response.status).send(response.data);
        })
            .catch(function (e) { throw new errors_1.HTTPError(e); });
        return [2 /*return*/];
    });
}); });
// Alter a user
router.put('/:email', function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: { email: req.params.email, content: req.body },
        event: 'modify',
    })
        .then(function (reply) {
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, password = _a.password, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
// Delete a user
router.delete('/:email', function (req, res, next) {
    eventHandler.publish('users_ch', {
        body: { email: req.params.email },
        event: 'delete',
    })
        .then(function (reply) {
        eventHandler.publish('auth_ch', {
            body: {
                email: reply.payload.email,
            },
            event: 'removeuser'
        });
        var _a = reply.payload, _id = _a._id, name = _a.name, email = _a.email, password = _a.password, createdAt = _a.createdAt, updatedAt = _a.updatedAt;
        var response = {
            _id: _id,
            name: name,
            email: email,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        res.status(reply.status).send(response);
    })
        .catch(next);
});
exports.default = router;
