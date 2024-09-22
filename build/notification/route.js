"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/listNotifications', userAuth_1.authorizeUser, controller_1.listNotifications);
router.put('/updateStatus/:id', userAuth_1.authorizeUser, controller_1.updateStatusAndGetListNotifications);
exports.default = router;
