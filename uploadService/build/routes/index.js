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
var aws_1 = __importDefault(require("../services/aws"));
// import { MultiStream } from '../utils/streamifier';
var errors_1 = require("../errors");
var multer_1 = __importDefault(require("multer"));
var middlewares_1 = __importDefault(require("../middlewares"));
var events_1 = __importDefault(require("../events"));
var router = express_1.default.Router();
var upload = multer_1.default();
var s3 = new aws_1.default('comicclanapi');
var eventHandler = events_1.default.getInstance();
eventHandler.connect(process.env.REDIS_SERVER || 'redis://localhost:6379', 'uploads_ch');
router.post('/', upload.single('media'), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var file, paths, path, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                file = req.file;
                paths = [];
                return [4 /*yield*/, s3.getOrCreateBucket()];
            case 1:
                _a.sent();
                return [4 /*yield*/, s3.setBucketPublic()];
            case 2:
                _a.sent();
                return [4 /*yield*/, s3.uploadFile(file.buffer, file.originalname.split('.')[1])];
            case 3:
                path = _a.sent();
                res.status(201).send(path);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error(e_1);
                if (e_1 instanceof errors_1.HTTPError)
                    next(e_1);
                else
                    next({ error: 'failed_to_validate', error_desription: "failed to verify files in request form, be asured it is tagged \"media\" in your form's field", status: 400 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.patch('/:id', function (req, res, next) {
    console.log(req.body);
    s3.renameFile(req.params.id, req.body.id + "_" + req.params.id)
        .then(function () {
        eventHandler.publish(req.body.type + 's_ch', { body: { id: req.body.id, file: req.body.id + "_" + req.params.id }, event: 'addmedia' })
            .then(function () {
            res.sendStatus(204);
        })
            .catch(next);
    })
        .catch(next);
});
router.use(middlewares_1.default.errorHandler);
exports.default = router;
