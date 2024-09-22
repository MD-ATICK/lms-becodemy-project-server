"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/question/:courseVideoId', userAuth_1.authorizeUser, controller_1.singleVideoQuestions);
router.post('/add-question', userAuth_1.authorizeUser, controller_1.addQuestion);
router.post('/add-answer', userAuth_1.authorizeUser, controller_1.addQuestionAnswer);
exports.default = router;
