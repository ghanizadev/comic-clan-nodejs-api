"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (date) {
    var formated;
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'long',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };
    formated = date.toLocaleDateString('en-US', options);
    return formated;
});
