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
exports.testFunc = exports.updateProfile = exports.updatePassword = exports.socialLogin = exports.logout = exports.auth = exports.activateUser = exports.login = exports.users = exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const cloudinary_1 = __importDefault(require("cloudinary"));
const jsonwebtoken_1 = require("jsonwebtoken");
const __1 = require("..");
const userSchema_1 = require("../../schemas/userSchema");
const db_1 = require("../../utils/db");
const mail_1 = require("../../utils/mail");
const response_1 = require("../../utils/response");
const token_1 = require("../../utils/token");
const user_1 = require("../../utils/user");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await db.user.deleteMany({})
        const { data, error } = userSchema_1.registerSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { name, email } = data;
        yield (0, user_1.checkUserExistence)(email);
        const { activationToken, activationCode } = yield (0, token_1.createRegisterMailToken)(data);
        yield (0, mail_1.sendMail)({ name, activationCode }, email, "Sending Email using Node.js", "activation-mail.ejs");
        const newUser = yield (0, user_1.createUser)(data);
        (0, response_1.successReturn)(res, "POST", { success: true, message: `please check your email : ${email}`, activationToken, newUser });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.register = register;
const users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield __1.redis.get('users');
    if (!users) {
        return (0, response_1.successReturn)(res, "GET", JSON.parse(users));
    }
    users = yield db_1.db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isVerified: true,
            role: true
        }
    });
    yield __1.redis.set('users', JSON.stringify(users));
    (0, response_1.successReturn)(res, "GET", users);
});
exports.users = users;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = userSchema_1.loginSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { email, password } = data;
        let user = yield (0, user_1.getUserByEmail)(email);
        if (!user.password)
            throw new Error('password not provided');
        const isCorrectPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isCorrectPassword)
            throw new Error('Invalid password');
        if (!user.isVerified) {
            const { activationCode, activationToken } = yield (0, token_1.createRegisterMailToken)({ name: user.name, email, password });
            yield (0, mail_1.sendMail)({ name: user.name, activationCode }, user.email, 'Sending Email using Node.js', "activation-mail.ejs");
            return (0, response_1.successReturn)(res, "POST", { event: "mail", message: `please check your email : ${email}`, activationToken });
        }
        const token = yield (0, token_1.createToken)(user);
        res.cookie('token', token, { sameSite: 'lax', httpOnly: true, expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) });
        (0, response_1.successReturn)(res, "POST", { success: true, user, message: "user logged successfully." });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.login = login;
const activateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = userSchema_1.activateUserSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { activate_code, activate_token } = data;
        if (!process.env.REGISTER_MAIL_TOKEN_SECRET) {
            throw new Error('token secret is required!');
        }
        yield (0, jsonwebtoken_1.verify)(activate_token, process.env.REGISTER_MAIL_TOKEN_SECRET, (err, verifyJwt) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw new Error(err.message);
            const { user, activationCode } = verifyJwt;
            if (activationCode !== activate_code)
                throw new Error('wrong activation code');
            const updateUser = yield db_1.db.user.update({
                where: { email: user.email },
                data: {
                    isVerified: true,
                    updatedAt: new Date()
                }
            });
            const token = yield (0, token_1.createToken)(updateUser);
            res.cookie('token', token, { sameSite: 'lax', httpOnly: true, expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) });
            (0, response_1.successReturn)(res, "POST", { token, user: updateUser });
        }));
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.activateUser = activateUser;
const auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.loggedUser)
            throw new Error('unAuthorized');
        // const user = await getUserById(req.loggedUser?.id)
        const user = yield db_1.db.user.findFirstOrThrow({
            where: { id: req.loggedUser.id },
            include: {
                purchasedCourses: {
                    include: {
                        course: {
                            include: {
                                reviews: true, courseSections: {
                                    include: { courseVideos: true }
                                }, user: true
                            }
                        }
                    }
                }
            }
        });
        (0, response_1.successReturn)(res, "GET", user);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.auth = auth;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', "");
        (0, response_1.successReturn)(res, "GET", { success: true, message: "logout success!" });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.logout = logout;
const socialLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = userSchema_1.registerSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { name, email, avatar } = data;
        const findCredentials = yield db_1.db.user.findFirst({ where: { email, provider: "CREDENTIALS" } });
        if (findCredentials)
            throw new Error('another user has already authenticated.');
        let user = yield db_1.db.user.findFirst({
            where: { email, provider: 'SOCIAL' }, include: { courses: true }
        });
        if (user) {
            return (0, response_1.successReturn)(res, "POST", user);
        }
        user = yield db_1.db.user.create({
            data: {
                email,
                name,
                avatar,
                provider: 'SOCIAL'
            },
            include: { courses: true }
        });
        const token = yield (0, token_1.createToken)(user);
        res.cookie('token', token, { sameSite: 'lax', httpOnly: true, expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) });
        (0, response_1.successReturn)(res, "POST", user);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.socialLogin = socialLogin;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error, data } = userSchema_1.updatePasswordSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        if (!req.loggedUser)
            throw new Error("unauthorized 1");
        const user = yield (0, user_1.getUserById)((_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id);
        if (!user.password)
            throw new Error("unauthorized! 2");
        const { oldPassword, newPassword } = data;
        const isCorrectPassword = (0, bcryptjs_1.compareSync)(oldPassword, user.password);
        if (!isCorrectPassword)
            throw new Error("please enter an correct password!");
        yield db_1.db.user.update({
            where: { id: user.id },
            data: { password: (0, bcryptjs_1.hashSync)(newPassword, 10) }
        });
        (0, response_1.successReturn)(res, "UPDATE", { message: 'password updated successfully' });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.updatePassword = updatePassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { avatar, name } = req.body;
        if (!avatar)
            throw new Error("avatar is required!");
        if (!req.loggedUser)
            throw new Error("avatar is required!");
        const user = yield (0, user_1.getUserById)((_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id);
        // todo : add it
        // if (email !== user.email) {
        //     const { activationCode, activationToken } = await createRegisterMailToken({ name: user.name, email })
        //     await sendMail({ name: user.name, activationCode }, user.email, 'Sending Email using Node.js', "activation-mail.ejs")
        //     return successReturn(res, "UPDATE", { event: "mail", message: `please check your email : ${email}`, activationToken })
        // }
        if ((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.public_id) {
            yield cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
        }
        if (!String(avatar).includes('res.cloudinary.com')) {
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: 'avatars',
                width: 150
            });
            const updateUser = yield db_1.db.user.update({
                where: { id: user.id },
                data: { name, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url } }
            });
            return (0, response_1.successReturn)(res, "UPDATE", { message: 'update avatar successfully', user: updateUser });
        }
        const updateUser = yield db_1.db.user.update({
            where: { id: user.id },
            data: { name }
        });
        (0, response_1.successReturn)(res, "UPDATE", { message: 'update avatar successfully', user: updateUser });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.updateProfile = updateProfile;
// just testing purpose
const testFunc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.testFunc = testFunc;
