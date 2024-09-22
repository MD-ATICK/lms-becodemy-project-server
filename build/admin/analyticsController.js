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
exports.getLast24HoursDataOfOrder = exports.getLast30DaysDataOfOrder = exports.getLast12MonthsDataOfOrder = exports.getLast24HoursDataOfUser = exports.getLast30DaysDataOfUser = exports.getLast12MonthsDataOfUser = exports.getLast24HoursDataOfCourse = exports.getLast30DaysDataOfCourse = exports.getLast12MonthsDataOfCourse = void 0;
const __1 = require("..");
const analytics_1 = require("../../utils/analytics");
const db_1 = require("../../utils/db");
const response_1 = require("../../utils/response");
// course analytics ------------
const getLast12MonthsDataOfCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TwelveMonthsCourseData = yield __1.redis.get('12MonthsCourseData');
        if (TwelveMonthsCourseData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(TwelveMonthsCourseData));
        }
        const data = yield (0, analytics_1.last12MonthsData)(db_1.db.course);
        yield __1.redis.setex('12MonthsCourseData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast12MonthsDataOfCourse = getLast12MonthsDataOfCourse;
const getLast30DaysDataOfCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last30DaysRedisData = yield __1.redis.get('last30DaysCourseData');
        if (last30DaysRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last30DaysRedisData));
        }
        const data = yield (0, analytics_1.last30DaysData)(db_1.db.course);
        yield __1.redis.setex('last30DaysCourseData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast30DaysDataOfCourse = getLast30DaysDataOfCourse;
const getLast24HoursDataOfCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last24hoursRedisData = yield __1.redis.get('last24hoursCourseData');
        if (last24hoursRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last24hoursRedisData));
        }
        const data = yield (0, analytics_1.last24hoursData)(db_1.db.course);
        yield __1.redis.setex('last24hoursCourseData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast24HoursDataOfCourse = getLast24HoursDataOfCourse;
// User analytics ------------
const getLast12MonthsDataOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last12MonthsUserRedisData = yield __1.redis.get('last12MonthsUserData');
        if (last12MonthsUserRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last12MonthsUserRedisData));
        }
        const data = yield (0, analytics_1.last12MonthsData)(db_1.db.user);
        yield __1.redis.setex('last12MonthsUserData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast12MonthsDataOfUser = getLast12MonthsDataOfUser;
const getLast30DaysDataOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last30DaysRedisUserData = yield __1.redis.get('last30DaysUserData');
        if (last30DaysRedisUserData) {
            console.log('redis user data');
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last30DaysRedisUserData));
        }
        const data = yield (0, analytics_1.last30DaysData)(db_1.db.user);
        yield __1.redis.setex('last30DaysUserData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast30DaysDataOfUser = getLast30DaysDataOfUser;
const getLast24HoursDataOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last24hoursUserRedisData = yield __1.redis.get('last24hoursUserData');
        if (last24hoursUserRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last24hoursUserRedisData));
        }
        const data = yield (0, analytics_1.last24hoursData)(db_1.db.user);
        yield __1.redis.setex('last24hoursUserData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast24HoursDataOfUser = getLast24HoursDataOfUser;
// Order analytics ------------
const getLast12MonthsDataOfOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last12MonthsOrderRedisData = yield __1.redis.get('last12MonthsOrderData');
        if (last12MonthsOrderRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last12MonthsOrderRedisData));
        }
        const data = yield (0, analytics_1.last12MonthsData)(db_1.db.order);
        yield __1.redis.setex('last12MonthsOrderData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast12MonthsDataOfOrder = getLast12MonthsDataOfOrder;
const getLast30DaysDataOfOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last30DaysOrderRedisData = yield __1.redis.get('last30DaysOrderData');
        if (last30DaysOrderRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last30DaysOrderRedisData));
        }
        const data = yield (0, analytics_1.last30DaysData)(db_1.db.order);
        yield __1.redis.setex('last30DaysOrderData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast30DaysDataOfOrder = getLast30DaysDataOfOrder;
const getLast24HoursDataOfOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const last24hoursOrderRedisData = yield __1.redis.get('last24hoursOrderData');
        if (last24hoursOrderRedisData) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(last24hoursOrderRedisData));
        }
        const data = yield (0, analytics_1.last24hoursData)(db_1.db.order);
        yield __1.redis.setex('last24hoursOrderData', 60, JSON.stringify(data));
        (0, response_1.successReturn)(res, "GET", data);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getLast24HoursDataOfOrder = getLast24HoursDataOfOrder;
