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
exports.test = exports.createUser = exports.checkUserExistence = exports.getUserByEmail = exports.getUserById = void 0;
const bcryptjs_1 = require("bcryptjs");
const db_1 = require("./db");
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findFirst({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findFirst({ where: { email }, include: { purchasedCourses: true } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
const checkUserExistence = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findFirst({ where: { email } });
        if (user) {
            throw new Error('user already exist');
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.checkUserExistence = checkUserExistence;
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, avatar }) {
    try {
        if (!password)
            throw new Error('password!');
        const hashedPassword = (0, bcryptjs_1.hashSync)(password, 10);
        const newUser = yield db_1.db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });
        return newUser;
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
// testing purpose
const test = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        throw error;
    }
});
exports.test = test;
