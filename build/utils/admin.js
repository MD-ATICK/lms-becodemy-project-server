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
exports.deleteCourseById = exports.deleteUserById = exports.updateUserRole = exports.getAllCourses = exports.getAllOrders = exports.getAllAdmins = exports.getAllUsers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("../app");
const course_1 = require("./course");
const db_1 = require("./db");
const user_1 = require("./user");
dotenv_1.default.config();
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.user.findMany({
            where: {
                role: 'USER'
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return users;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllUsers = getAllUsers;
const getAllAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.user.findMany({
            where: {
                role: "ADMIN"
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return users;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllAdmins = getAllAdmins;
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield db_1.db.order.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return orders;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllOrders = getAllOrders;
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield db_1.db.course.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return courses;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllCourses = getAllCourses;
const updateUserRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield db_1.db.user.update({ where: { id: userId }, data: { role } });
        return courses;
    }
    catch (error) {
        throw error;
    }
});
exports.updateUserRole = updateUserRole;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_1.getUserById)(id);
        yield db_1.db.user.delete({ where: { id } });
        return;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteUserById = deleteUserById;
const deleteCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, course_1.getCourseById)(id);
        yield db_1.db.course.delete({ where: { id } });
        yield app_1.redis.del(id);
        const courses = yield db_1.db.course.findMany();
        yield app_1.redis.setex('allCourses', process.env.REDIS_COURSE_TIME || 0, JSON.stringify(courses));
        return;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteCourseById = deleteCourseById;
