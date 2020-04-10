"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sendEmail_1 = __importDefault(require("../services/sendEmail"));
var formatDate_1 = __importDefault(require("../utils/formatDate"));
var emailSender = new sendEmail_1.default();
exports.default = {
    welcome: function (email, name, link, dashboard) {
        emailSender.sendWelcomeAlert(email, {
            name: name,
            link: link,
            dashboard: dashboard
        });
    },
    reset: function (email, name, link) {
        emailSender.sendResetAlert(email, {
            name: name,
            link: link,
        });
    },
    newMessage: function (email, name, postLink, from, message, postDate, profileLink) {
        emailSender.sendMessageAlert(email, {
            name: name,
            postLink: postLink,
            from: from,
            message: message,
            postDate: formatDate_1.default(postDate),
            profileLink: profileLink,
        });
    }
};
