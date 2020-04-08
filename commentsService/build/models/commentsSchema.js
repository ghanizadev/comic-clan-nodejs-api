"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var UserSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    body: { type: String, required: true },
    media: { type: [String], default: [] },
}, { timestamps: true, collection: 'posts' });
exports.default = mongoose_1.default.model('Post', UserSchema);
