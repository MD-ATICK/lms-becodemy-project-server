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
exports.selectData = exports.getCourseById = void 0;
const db_1 = require("./db");
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield db_1.db.course.findFirst({ where: { id } });
        if (!course) {
            throw new Error('course not found');
        }
        return course;
    }
    catch (error) {
        throw new Error("Failed to get course!");
    }
});
exports.getCourseById = getCourseById;
const selectData = () => {
    return {
        id: true,
        name: true,
        description: true,
        price: true,
        expectationPrice: true,
        thumbnail: true,
        tags: true,
        level: true,
        demoUrl: true,
        purchased: true,
        benefits: true,
        prerequisites: true,
        order: true,
        reviews: true,
        courseSections: {
            select: {
                id: true,
                title: true,
                courseVideos: {
                    select: {
                        id: true,
                        title: true,
                        links: true,
                        // questions: {
                        //     select: {
                        //         id: true,
                        //         question: true,
                        //         questionAnswers: {
                        //             select: {
                        //                 id: true,
                        //                 answer: true,
                        //                 user: true,
                        //                 createdAt: true
                        //             }
                        //         },
                        //         user: true,
                        //         createdAt: true,
                        //         updatedAt: true,
                        //     },
                        // },
                        description: true,
                        videoLength: true,
                        videoPlayer: true,
                        suggestion: true,
                        videoUrl: true,
                        createdAt: true,
                    }
                }
            }
        },
        createdAt: true,
        updatedAt: true
    };
};
exports.selectData = selectData;
