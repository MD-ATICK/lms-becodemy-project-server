"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesAuth = void 0;
const response_1 = require("../utils/response");
const rolesAuth = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (req.loggedUser && !roles.includes((_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.role)) {
            return (0, response_1.errorReturn)(res, "You are not allowed to access this!");
        }
        next();
    };
};
exports.rolesAuth = rolesAuth;
