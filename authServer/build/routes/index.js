"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var controllers_1 = __importDefault(require("../controllers"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var router = express_1.default.Router();
router.post('/token', controllers_1.default.authorize);
router.post('/revoke', controllers_1.default.revoke);
router.get('/token_key', function (req, res, next) {
    var file = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '..', 'keys', 'access_token_pub.crt')).toString();
    res.status(201).send(file);
});
exports.default = router;
