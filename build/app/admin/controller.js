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
exports.deleteCourse = exports.deleteUser = exports.updateRole = exports.listOrders = exports.listCourses = exports.listAdmins = exports.listUsers = exports.vdoCipherUploadVideo = exports.removeAdmins = exports.makeAdmins = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const __1 = require("..");
const admin_1 = require("../../utils/admin");
const response_1 = require("../../utils/response");
dotenv_1.default.config();
const makeAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailAry = req.body;
        if (!emailAry)
            throw new Error('invalid email array!');
        yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.updateMany({
            where: {
                email: { in: emailAry }
            },
            data: {
                role: 'ADMIN'
            },
        }));
        const admins = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.findMany({ where: { role: 'ADMIN' } }));
        (0, response_1.successReturn)(res, "POST", { admins });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.makeAdmins = makeAdmins;
const removeAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailAry = req.body;
        if (!emailAry)
            throw new Error('invalid email array!');
        yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.updateMany({
            where: {
                email: { in: emailAry }
            },
            data: {
                role: 'USER'
            },
        }));
        const admins = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.findMany({ where: { role: "ADMIN" } }));
        (0, response_1.successReturn)(res, "POST", { admins });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.removeAdmins = removeAdmins;
const vdoCipherUploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.body;
        if (!videoId)
            throw new Error('Please provide a video id.');
        const { data } = yield axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, { headers: { Accept: 'application/json', "Content-Type": "application/json", Authorization: `Apisecret ${process.env.VDO_CIPHER_API_SECRET}` } });
        (0, response_1.successReturn)(res, "POST", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.vdoCipherUploadVideo = vdoCipherUploadVideo;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const cachedUsers = await redis.get('users')
        // if (cachedUsers) {
        //     return successReturn(res, "GET", JSON.parse(cachedUsers))
        // }
        const users = yield (0, admin_1.getAllUsers)();
        // await redis.setex('users', 60, JSON.stringify(users))
        (0, response_1.successReturn)(res, "GET", users);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.listUsers = listUsers;
const listAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const cachedUsers = await redis.get('admins')
        // if (cachedUsers) {
        //     return successReturn(res, "GET", JSON.parse(cachedUsers))
        // }
        const admins = yield (0, admin_1.getAllAdmins)();
        // await redis.setex('admins', 60, JSON.stringify(admins))
        (0, response_1.successReturn)(res, "GET", admins);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.listAdmins = listAdmins;
const listCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findRedisAllCourses = yield __1.redis.get('courses');
        if (findRedisAllCourses) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(findRedisAllCourses));
        }
        const courses = yield (0, admin_1.getAllCourses)();
        (0, response_1.successReturn)(res, "GET", courses);
        yield __1.redis.setex('courses', process.env.REDIS_COURSE_TIME || 15, JSON.stringify(courses));
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.listCourses = listCourses;
// export const getSingleCourse = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         if (!id) throw new Error('id required!')
//         const course = await db.course.findFirstOrThrow({
//             where: { id }, include: {
//                 courseSections: true,
//                 reviews: true,
//             }
//         })
//         successReturn(res, "GET", course)
//     } catch (error) {
//         errorReturn(res, (error as Error).message)
//     }
// }
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, admin_1.getAllOrders)();
        (0, response_1.successReturn)(res, "GET", orders);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.listOrders = listOrders;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.body;
        const updatedUser = yield (0, admin_1.updateUserRole)(userId, role);
        (0, response_1.successReturn)(res, "UPDATE", updatedUser);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.updateRole = updateRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, admin_1.deleteUserById)(req.params.id);
        (0, response_1.successReturn)(res, "DELETE", { success: true });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteUser = deleteUser;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, admin_1.deleteCourseById)(req.params.id);
        (0, response_1.successReturn)(res, "DELETE", { success: true });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteCourse = deleteCourse;
