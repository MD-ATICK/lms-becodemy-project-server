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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const response_1 = require("../utils/response");
const token_1 = require("../utils/token");
const authorizeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, token_1.checkCookieToken)(req);
        if (!process.env.TOKEN_SECRET) {
            throw new Error('please login before logout!');
        }
        yield (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_SECRET, (err, verifyJwt) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error(err.message);
            }
            const user = verifyJwt;
            if (!user) {
                throw new Error('Invalid token!');
            }
            req.loggedUser = user;
            next();
        }));
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.authorizeUser = authorizeUser;
