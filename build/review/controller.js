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
exports.addCommentReply = exports.reviewList = exports.addReview = exports.getSingleReview = void 0;
const __1 = require("..");
const reviewSchema_1 = require("../../schemas/reviewSchema");
const db_1 = require("../../utils/db");
const response_1 = require("../../utils/response");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
// courseId: 66b71cbd6c363240274e966b 
// reviewId : 66b7742efc06f0c7fdf3558e
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const review = yield db_1.db.review.findFirstOrThrow({ where: { id }, include: { commentReplies: true } });
        (0, response_1.successReturn)(res, "GET", review);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getSingleReview = getSingleReview;
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = reviewSchema_1.reviewSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { courseId, comment, rating } = data;
        if (!req.loggedUser || !courseId)
            throw new Error('unauthenticated');
        const loggedUser = yield db_1.db.user.findFirstOrThrow({ where: { id: req.loggedUser.id }, include: { purchasedCourses: true } });
        const isCoursePurchased = loggedUser.purchasedCourses.find(course => course.id === courseId);
        if (isCoursePurchased)
            throw new Error('you have not access to review this course!');
        const newReview = yield db_1.db.review.create({
            data: {
                rating,
                userId: req.loggedUser.id,
                comment,
                courseId
            },
            include: { user: true, commentReplies: true, course: true }
        });
        // todo : send a notification to course admin.
        const redisData = yield __1.redis.get(courseId + 'review');
        if (redisData) {
            const parseRedisData = JSON.parse(redisData);
            yield __1.redis.setex(courseId + 'review', 60 * 60, JSON.stringify([newReview, ...parseRedisData]));
        }
        if (!redisData) {
            const reviews = yield db_1.db.review.findMany({ where: { courseId }, include: { user: true, commentReplies: true } });
            yield __1.redis.setex(courseId + 'review', 60 * 60, JSON.stringify(reviews));
        }
        const notification = yield db_1.db.notification.create({
            data: {
                userId: req.loggedUser.id,
                title: `New review form ${req.loggedUser.name}`,
                message: `You get a reviews in ${newReview.course.name} course.`
            }
        });
        (0, response_1.successReturn)(res, "POST", { newReview, notification });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addReview = addReview;
const reviewList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const redisReviews = yield __1.redis.get(courseId + 'review');
        if (redisReviews) {
            console.log('redis reviews');
            return (0, response_1.successReturn)(res, "GET", JSON.parse(redisReviews));
        }
        const reviews = yield db_1.db.review.findMany({ where: { courseId }, include: { user: true, commentReplies: true }, orderBy: { createdAt: "desc" } });
        yield __1.redis.setex(courseId + 'review', 60 * 60, JSON.stringify(reviews));
        (0, response_1.successReturn)(res, "GET", reviews);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.reviewList = reviewList;
const addCommentReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error, data } = reviewSchema_1.replyToReviewSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { reviewId, reply } = data;
        const addReply = yield db_1.db.commentReply.create({
            data: {
                commentReply: reply,
                reviewId,
                userId: (_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id
            }
        });
        const review = yield db_1.db.review.findFirstOrThrow({ where: { id: reviewId }, include: { user: true, commentReplies: true } });
        const redisData = yield __1.redis.get(review.courseId + 'review');
        if (redisData) {
            const parseRedisData = JSON.parse(redisData);
            const storeData = parseRedisData.map((r) => r.id === reviewId && review);
            yield __1.redis.setex(review.courseId + 'review', 60 * 60, JSON.stringify(storeData));
        }
        if (!redisData) {
            const reviews = yield db_1.db.review.findMany({ where: { courseId: review.courseId }, include: { user: true, commentReplies: true }, orderBy: { createdAt: "desc" } });
            yield __1.redis.setex(review.courseId + 'review', 60 * 60, JSON.stringify(reviews));
        }
        (0, response_1.successReturn)(res, "POST", addReply);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addCommentReply = addCommentReply;
