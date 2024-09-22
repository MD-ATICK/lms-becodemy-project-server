"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/get-single/:id', controller_1.getSingleReview);
router.get('/reviewList/:courseId', userAuth_1.authorizeUser, controller_1.reviewList);
router.post('/add-review', userAuth_1.authorizeUser, controller_1.addReview);
router.post('/add-reply', userAuth_1.authorizeUser, controller_1.addCommentReply);
exports.default = router;
