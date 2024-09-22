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
exports.testFunc = exports.courseByPurchaseUser = exports.allCourses = exports.deleteManyCourse = exports.deleteSingleCourse = exports.singleCourse = exports.editCourse = exports.createCourse = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const __1 = require("..");
const courseSchema_1 = require("../../schemas/courseSchema");
const course_1 = require("../../utils/course");
const db_1 = require("../../utils/db");
const response_1 = require("../../utils/response");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
dotenv_1.default.config();
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { data, error } = courseSchema_1.courseSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        if (!req.loggedUser)
            throw new Error(' unauthorized access!');
        const course = yield db_1.db.course.create({
            data: Object.assign(Object.assign({}, data), { userId: (_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id, courseSections: {
                    create: data.courseSections.map((section) => ({
                        title: section.title,
                        courseVideos: {
                            create: section.courseVideos.map((video) => ({
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            })),
                        },
                    })),
                } }),
            include: {
                courseSections: {
                    include: {
                        courseVideos: true,
                    },
                },
            },
        });
        (0, response_1.successReturn)(res, "POST", course);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.createCourse = createCourse;
const editCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = courseSchema_1.courseSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const id = req.params.id;
        const { name, thumbnail, description, level, tags, price, expectationPrice, benefits, prerequisites } = data;
        if (!req.loggedUser || !id)
            throw new Error(' unauthorized access!');
        yield (0, course_1.getCourseById)(id);
        data.courseSections.map((section) => __awaiter(void 0, void 0, void 0, function* () {
            if (section.id) {
                yield db_1.db.courseVideoSection.update({
                    where: { id: section.id },
                    data: {
                        title: section.title,
                    }
                });
                section.courseVideos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
                    if (video.id) {
                        yield db_1.db.courseVideo.update({
                            where: { id: video.id },
                            data: {
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            }
                        });
                    }
                    else {
                        yield db_1.db.courseVideo.create({
                            data: {
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                                courseVideoSectionId: section.id
                            }
                        });
                    }
                }));
            }
            if (!section.id) {
                yield db_1.db.courseVideoSection.create({
                    data: {
                        title: section.title,
                        courseId: id,
                        courseVideos: {
                            create: section.courseVideos.map((video) => ({
                                title: video.title,
                                videoUrl: video.videoUrl,
                                description: video.description,
                                videoLength: video.videoLength,
                                videoPlayer: video.videoPlayer,
                                suggestion: video.suggestion,
                            })),
                        }
                    }
                });
            }
        }));
        const updateCourse = yield db_1.db.course.update({
            where: { id }, // Course id from the request
            data: {
                name,
                thumbnail,
                description,
                level,
                tags,
                price,
                expectationPrice,
                benefits,
                prerequisites
            }
        });
        (0, response_1.successReturn)(res, "UPDATE", updateCourse);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.editCourse = editCourse;
const singleCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectValue = (0, course_1.selectData)();
        const courseId = req.params.id;
        const findRedisCourse = yield __1.redis.get(courseId);
        if (!courseId)
            throw new Error('course id not provided!');
        if (findRedisCourse) {
            console.log('redis course');
            return (0, response_1.successReturn)(res, "GET", JSON.parse(findRedisCourse));
        }
        const course = yield db_1.db.course.findFirstOrThrow({
            where: { id: courseId },
            select: Object.assign({}, selectValue),
        });
        if (!course) {
            throw new Error("Course not found!");
        }
        // todo : extend this for ratings. -> source - prisma with ts project. 2 
        yield __1.redis.setex(String(courseId), 60 * 60, JSON.stringify(course)); // for 1 hours
        (0, response_1.successReturn)(res, "GET", course);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.singleCourse = singleCourse;
const deleteSingleCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.db.course.delete({ where: { id } });
        (0, response_1.successReturn)(res, "DELETE", { delete: true });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteSingleCourse = deleteSingleCourse;
const deleteManyCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteCourseIdAry = req.body;
        yield db_1.db.course.deleteMany({ where: { id: { in: deleteCourseIdAry } } });
        (0, response_1.successReturn)(res, "DELETE", { delete: true });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteManyCourse = deleteManyCourse;
const allCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // todo: get courses only form redis. when add, update , delete do with redis in this fetch.
        const search = req.query.search; // Get 'name' from query parameters
        const x = search.toLowerCase();
        const findRedisAllCourses = yield __1.redis.get('courses');
        if (findRedisAllCourses) {
            console.log('redis courses');
            const filteredCourse = JSON.parse(findRedisAllCourses).filter(c => c.name.toLowerCase().includes(x));
            return (0, response_1.successReturn)(res, "GET", filteredCourse);
        }
        const selectValue = (0, course_1.selectData)();
        const courses = yield db_1.db.course.findMany({
            select: Object.assign({}, selectValue)
        });
        if (!courses) {
            throw new Error("Course not found!");
        }
        yield __1.redis.setex('courses', 60, JSON.stringify(courses));
        (0, response_1.successReturn)(res, "GET", courses);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.allCourses = allCourses;
// ✅ get course content - only for purchase user.
const courseByPurchaseUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        if (!req.loggedUser || !courseId)
            throw new Error('unauthenticated');
        const { purchasedCourses } = yield db_1.db.user.findFirstOrThrow({
            where: { id: req.loggedUser.id },
            select: {
                id: true,
                role: true,
                purchasedCourses: {
                    select: {
                        id: true,
                        course: {
                            select: {
                                id: true,
                                courseSections: {
                                    select: {
                                        courseVideos: true
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });
        const isCoursePurchased = purchasedCourses.find(course => course.id === courseId);
        if (!(isCoursePurchased === null || isCoursePurchased === void 0 ? void 0 : isCoursePurchased.course))
            throw new Error('you have not access at this course!');
        (0, response_1.successReturn)(res, "GET", isCoursePurchased.course.courseSections);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.courseByPurchaseUser = courseByPurchaseUser;
// just testing purpose
const testFunc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.testFunc = testFunc;
