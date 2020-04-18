"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var PostSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    media: { type: [String], default: [] },
    comments: { type: [String], default: [] }
}, { timestamps: true, collection: 'posts' });
PostSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = mongoose_1.model('Post', PostSchema);
