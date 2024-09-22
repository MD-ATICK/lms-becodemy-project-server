"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/create', userAuth_1.authorizeUser, controller_1.createOrder);
router.get('/payment/stripe_publishable_key', controller_1.sendStripePublishableKey);
router.post('/payment', userAuth_1.authorizeUser, controller_1.newPayment);
exports.default = router;
