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
exports.last12MonthsData = last12MonthsData;
exports.last30DaysData = last30DaysData;
exports.last24hoursData = last24hoursData;
function last12MonthsData(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastYearData = [];
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1); // First day of the month
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i - 1), 0); // Last day of the month
            const monthYear = startDate.toLocaleDateString('default', { month: 'short' });
            const count = yield model.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            });
            lastYearData.push({ month: monthYear, count });
        }
        return lastYearData;
    });
}
function last30DaysData(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const last30DaysData = [];
        const currentDate = new Date();
        for (let i = 30; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i); // First day of the month
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (i - 1)); // Last day of the month
            const dayName = startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            const count = yield model.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            });
            last30DaysData.push({ day: dayName, count });
        }
        return last30DaysData;
    });
}
function last24hoursData(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const last24HoursData = [];
        const currentDate = new Date();
        for (let i = 24; i >= 0; i--) {
            const startHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() - i, 1); // First day of the month
            const endHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() - (i - 1)); // Last day of the month
            const formatDate = (date) => date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const periodLabel = `${formatTime(endHour)}`;
            const count = yield model.count({
                where: {
                    createdAt: {
                        gte: startHour,
                        lt: endHour
                    }
                }
            });
            last24HoursData.push({ hour: periodLabel, count });
        }
        return last24HoursData;
    });
}
