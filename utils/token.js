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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCookieToken = exports.createToken = exports.createRegisterMailToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1.default.config();
const createRegisterMailToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (!process.env.REGISTER_MAIL_TOKEN_SECRET) {
        throw new Error('token secret is required!');
    }
    const activationToken = yield (0, jsonwebtoken_1.sign)({ user, activationCode }, process.env.REGISTER_MAIL_TOKEN_SECRET, { expiresIn: "15m" });
    return { activationToken, activationCode };
});
exports.createRegisterMailToken = createRegisterMailToken;
const createToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.TOKEN_SECRET) {
        throw new Error('token secret is required!');
    }
    const token = yield (0, jsonwebtoken_1.sign)(user, process.env.TOKEN_SECRET, { expiresIn: "7d" });
    return token;
});
exports.createToken = createToken;
const checkCookieToken = (req) => {
    const token = req.cookies.token;
    if (!token) {
        throw new Error('unauthorized access for token!');
    }
    return token;
};
exports.checkCookieToken = checkCookieToken;
