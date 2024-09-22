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
exports.createCourseVideo = void 0;
const response_1 = require("../../utils/response");
const courseVideoSchema_1 = require("../../schemas/courseVideoSchema");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
const db_1 = require("../../utils/db");
// courseId : 66b365c93d3d0b52f1077a31
const createCourseVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = courseVideoSchema_1.courseVideoSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const courseVideo = yield db_1.db.courseVideo.create({
            data: Object.assign({}, data)
        });
        (0, response_1.successReturn)(res, "POST", courseVideo);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.createCourseVideo = createCourseVideo;
