"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUserSchema = exports.updatePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    name: zod_1.default.string().nonempty("name is required"),
    email: zod_1.default.string().email().nonempty("email is required"),
    password: zod_1.default.optional(zod_1.default.string().min(6, { message: "password must be 6 letter." })),
    avatar: zod_1.default.optional(zod_1.default.object({ public_id: zod_1.default.string(), url: zod_1.default.string() })),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email().nonempty("email is required"),
    password: zod_1.default.string().nonempty("password is required"),
});
exports.updatePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default.string().nonempty("old password is required"),
    newPassword: zod_1.default.string().nonempty("new password is required"),
});
exports.activateUserSchema = zod_1.default.object({
    activate_token: zod_1.default.string().nonempty("token is required"),
    activate_code: zod_1.default.string().nonempty("code is required"),
});
