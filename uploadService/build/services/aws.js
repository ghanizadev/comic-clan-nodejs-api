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
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var crypto_1 = __importDefault(require("crypto"));
var logger_1 = __importDefault(require("../utils/logger"));
var errors_1 = require("../errors");
var AwsS3 = /** @class */ (function () {
    function AwsS3(bucketName) {
        this.AWS_S3_KEY = process.env.AWS_S3_KEY;
        this.AWS_S3_SECRET = process.env.AWS_S3_SECRET;
        this.isPublic = false;
        this.BUCKET_NAME = bucketName;
        this.S3 = new aws_sdk_1.default.S3({
            accessKeyId: this.AWS_S3_KEY,
            secretAccessKey: this.AWS_S3_SECRET,
            region: 'us-east-1'
        });
    }
    AwsS3.prototype.getOrCreateBucket = function (bucketName) {
        return __awaiter(this, void 0, void 0, function () {
            var data, bucketParams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketName && (this.BUCKET_NAME = bucketName);
                        return [4 /*yield*/, this.S3.listBuckets().promise()];
                    case 1:
                        data = _a.sent();
                        if (!!data.Buckets) return [3 /*break*/, 2];
                        logger_1.default.warn("Failed to fetch AWS");
                        return [3 /*break*/, 4];
                    case 2:
                        if (!!data.Buckets.find(function (bucket) { return bucket.Name === _this.BUCKET_NAME; })) return [3 /*break*/, 4];
                        bucketParams = {
                            Bucket: this.BUCKET_NAME,
                            ACL: 'public-read'
                        };
                        return [4 /*yield*/, this.S3.createBucket(bucketParams).promise()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AwsS3.prototype.uploadFile = function (file, ext, id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.S3.upload({
                            Body: file,
                            Key: id ? id + "_" + crypto_1.default.randomBytes(8).toString('HEX') + "." + ext : crypto_1.default.randomBytes(8).toString('HEX') + "." + ext,
                            Bucket: this.BUCKET_NAME
                        }).promise()];
                    case 1:
                        data = _a.sent();
                        console.log(data.Location);
                        return [2 /*return*/, data.Location];
                }
            });
        });
    };
    AwsS3.prototype.deleteFile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            Key: id,
                            Bucket: this.BUCKET_NAME
                        };
                        return [4 /*yield*/, this.S3.deleteObject(params).promise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.DeleteMarker || false];
                }
            });
        });
    };
    AwsS3.prototype.renameFile = function (initial, final) {
        return __awaiter(this, void 0, void 0, function () {
            var params, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        params = {
                            Key: final,
                            Bucket: this.BUCKET_NAME,
                            CopySource: this.BUCKET_NAME + "/" + initial
                        };
                        return [4 /*yield*/, this.S3.copyObject(params).promise()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.S3.deleteObject(params).promise()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.default.error(e_1.message);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AwsS3.prototype.setBucketPublic = function (bucketName) {
        return __awaiter(this, void 0, void 0, function () {
            var policy, policyParams, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        policy = {
                            "Version": "2012-10-17",
                            "Statement": [
                                {
                                    "Sid": "PublicRead",
                                    "Effect": "Allow",
                                    "Principal": "*",
                                    "Action": ["s3:GetObject"],
                                    "Resource": ["arn:aws:s3:::" + (bucketName !== null && bucketName !== void 0 ? bucketName : this.BUCKET_NAME) + "/*"]
                                }
                            ]
                        };
                        policyParams = {
                            Policy: JSON.stringify(policy),
                            Bucket: bucketName !== null && bucketName !== void 0 ? bucketName : this.BUCKET_NAME
                        };
                        return [4 /*yield*/, this.S3.putBucketPolicy(policyParams).promise()];
                    case 1:
                        _a.sent();
                        this.isPublic = true;
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.isPublic = false;
                        throw new errors_1.HTTPError('aws_error', "failed to make \"" + this.BUCKET_NAME + "\" bucket public.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AwsS3.prototype.allowBucketAddress = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var check, statement, policyParams, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        check = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,3}\d{1,3})?\b/g.test(ip);
                        if (!check) {
                            throw new Error("invalid IP: " + ip + ".");
                        }
                        if (this.isPublic) {
                            throw new errors_1.HTTPError('aws_error', "current AWS S3 Bucket \"" + this.BUCKET_NAME + "\" \n                is public already. If you want to set permission to a single ip \n                address only, please remove \"PublicRead\" policy in console panel.");
                        }
                        statement = {
                            "Version": "2012-10-17",
                            "Id": "Allow" + ip,
                            "Statement": [{
                                    "Sid": "AllowSingleIp",
                                    "Effect": "Allow",
                                    "Principal": "*",
                                    "Action": "s3:*",
                                    "Resource": [
                                        "arn:aws:s3:::" + this.BUCKET_NAME,
                                        "arn:aws:s3:::" + this.BUCKET_NAME + "/*",
                                    ],
                                    "Condition": {
                                        "IpAddress": {
                                            "aws:SourceIp": [
                                                ip,
                                            ]
                                        }
                                    }
                                }]
                        };
                        policyParams = {
                            Policy: JSON.stringify(statement),
                            Bucket: this.BUCKET_NAME
                        };
                        return [4 /*yield*/, this.S3.putBucketPolicy(policyParams).promise()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw new errors_1.HTTPError('aws_error', "failed to permit \"" + ip + "\" to \"" + this.BUCKET_NAME + "\" bucket access policies.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AwsS3;
}());
exports.default = AwsS3;
