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
exports.addQuestionAnswer = exports.addQuestion = exports.singleVideoQuestions = void 0;
const __1 = require("..");
const db_1 = require("../../utils/db");
const mail_1 = require("../../utils/mail");
const questions_1 = require("../../utils/questions");
const response_1 = require("../../utils/response");
const time = 60 * 60;
const singleVideoQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseVideoId } = req.params;
        const redisData = yield __1.redis.get(courseVideoId);
        if (redisData) {
            console.log('redis question');
            return (0, response_1.successReturn)(res, "GET", JSON.parse(redisData));
        }
        const questions = yield (0, questions_1.getQuestionsByCourseVideoID)(courseVideoId);
        yield __1.redis.setex(courseVideoId, time, JSON.stringify(questions));
        (0, response_1.successReturn)(res, "GET", questions);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.singleVideoQuestions = singleVideoQuestions;
// course video id : 66b375445c65b63886655e09
const addQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { question, courseVideoId } = req.body;
        if (!req.loggedUser)
            throw new Error('please login!');
        if (!question || !courseVideoId)
            throw new Error('question , courseVideoId is required');
        const userId = (_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id;
        const newQuestion = yield db_1.db.question.create({
            data: {
                question,
                courseVideoId,
                userId
            },
            include: {
                questionAnswers: true
            }
        });
        const courseVideo = yield db_1.db.courseVideo.findFirstOrThrow({ where: { id: courseVideoId } });
        const questions = yield (0, questions_1.getQuestionsByCourseVideoID)(courseVideoId);
        yield __1.redis.setex(courseVideoId, time, JSON.stringify(questions));
        const notification = yield db_1.db.notification.create({
            data: {
                userId: req.loggedUser.id,
                title: "New Question.",
                message: `You have a new question of ${courseVideo.title} video.`
            }
        });
        (0, response_1.successReturn)(res, "POST", { newQuestion, notification });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addQuestion = addQuestion;
// question : 66b70de0fa4b363af47fd176
const addQuestionAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { questionId, answer } = req.body;
        const userId = (_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!req.loggedUser)
            throw new Error('please login!');
        if (!answer || !questionId)
            throw new Error('answer , questionId is required');
        const question = yield db_1.db.question.findFirstOrThrow({ where: { id: questionId }, include: { user: true, courseVideo: true } });
        if (!((_b = question.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error('please login!');
        const qusAnswer = yield db_1.db.questionAnswer.create({
            data: {
                answer,
                userId,
                questionId
            }
        });
        const courseVideo = yield db_1.db.courseVideo.findFirstOrThrow({ where: { id: (_c = question.courseVideo) === null || _c === void 0 ? void 0 : _c.id } });
        const questions = yield (0, questions_1.getQuestionsByCourseVideoID)(courseVideo.id);
        yield __1.redis.setex(courseVideo.id, time, JSON.stringify(questions));
        if (userId === question.user.id) {
            yield db_1.db.notification.create({
                data: {
                    userId: req.loggedUser.id,
                    title: "New Question.",
                    message: `You have a new question of ${courseVideo.title} video.`
                }
            });
            return (0, response_1.successReturn)(res, "POST", qusAnswer);
        }
        try {
            yield (0, mail_1.sendMail)({ name: question.user.name, title: (_d = question.courseVideo) === null || _d === void 0 ? void 0 : _d.title }, question.user.email, "a user reply your question.", "question-reply.ejs");
        }
        catch (error) {
            throw error;
        }
        (0, response_1.successReturn)(res, "POST", qusAnswer);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addQuestionAnswer = addQuestionAnswer;
