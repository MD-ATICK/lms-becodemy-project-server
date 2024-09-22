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
exports.newPayment = exports.sendStripePublishableKey = exports.createOrder = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const orderSchema_1 = require("../../schemas/orderSchema");
const course_1 = require("../../utils/course");
const db_1 = require("../../utils/db");
const mail_1 = require("../../utils/mail");
const response_1 = require("../../utils/response");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
dotenv_1.default.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error, data } = orderSchema_1.orderSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { courseId, payment_info } = data;
        const userId = (_a = req.loggedUser) === null || _a === void 0 ? void 0 : _a.id;
        if (payment_info === null || payment_info === void 0 ? void 0 : payment_info.id) {
            const paymentIntent = yield stripe.paymentIntents.retrieve(payment_info.id);
            if (paymentIntent.status !== 'succeeded') {
                throw new Error('payment retrieve failed');
            }
        }
        if (!req.loggedUser)
            throw new Error('unauthorized');
        const user = yield db_1.db.user.findFirstOrThrow({ where: { id: userId }, include: { purchasedCourses: true } });
        const existenceCheck = user.purchasedCourses.find(course => course.courseId === courseId);
        if (existenceCheck)
            throw new Error('you already purchase this course!');
        const course = yield (0, course_1.getCourseById)(courseId);
        const order = yield db_1.db.order.create({
            data: {
                courseId,
                userId,
                paymentInfo: payment_info
            },
            include: {
                user: true,
                course: true
            }
        });
        try {
            yield (0, mail_1.sendMail)(order, user.email, "your order has been placed!", "order-placed.ejs");
        }
        catch (error) {
            throw new Error('failed to send mail!');
        }
        const notification = yield db_1.db.notification.create({
            data: {
                userId: user.id,
                title: "New Order Placed.",
                message: `You have a new order of ${course.name}`
            }
        });
        (0, response_1.successReturn)(res, "POST", { order, notification });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.createOrder = createOrder;
const sendStripePublishableKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey)
            throw new Error('no publishable key!');
        (0, response_1.successReturn)(res, "GET", { publishableKey });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.sendStripePublishableKey = sendStripePublishableKey;
const newPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        if (!amount)
            throw new Error(`Invalid amount`);
        const currency = "USD";
        const company = "E_learning";
        const myPayment = yield stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                company,
            },
            automatic_payment_methods: {
                enabled: true
            }
        });
        (0, response_1.successReturn)(res, "POST", { client_secret: myPayment.client_secret });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.newPayment = newPayment;
