"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (database) {
    return function (req, res, next) {
        try {
            if (database)
                req.database = database;
            else
                throw new Error('database is null or it is not set');
            next();
        }
        catch (e) {
            next(e);
        }
    };
});
