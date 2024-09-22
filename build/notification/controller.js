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
exports.updateStatusAndGetListNotifications = exports.listNotifications = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../../utils/db");
const response_1 = require("../../utils/response");
const listNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield db_1.db.notification.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        });
        (0, response_1.successReturn)(res, "GET", notifications);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.listNotifications = listNotifications;
const updateStatusAndGetListNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield db_1.db.notification.findFirst({ where: { id: req.params.id } });
        if (!notification)
            throw new Error('no notification found!');
        const updateNotification = yield db_1.db.notification.update({
            where: { id: req.params.id },
            data: { status: "READ" }
        });
        (0, response_1.successReturn)(res, "UPDATE", updateNotification);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.updateStatusAndGetListNotifications = updateStatusAndGetListNotifications;
node_cron_1.default.schedule("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    yield db_1.db.notification.deleteMany({
        where: { status: "READ", createdAt: { lt: thirtyDaysAgo } },
    });
}));
