"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoles_1 = require("../../middlewares/authRoles");
const userAuth_1 = require("../../middlewares/userAuth");
const analyticsController_1 = require("./analyticsController");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/users', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.listUsers);
router.get('/admins', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.listAdmins);
router.get('/courses', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.listCourses);
router.get('/orders', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.listOrders);
router.delete('/deleteUser/:id', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.deleteUser);
router.delete('/deleteCourse/:id', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), controller_1.deleteCourse);
router.post('/vdoCipherUpload', controller_1.vdoCipherUploadVideo);
router.post('/make-admin', controller_1.makeAdmins);
router.post('/remove-admin', controller_1.removeAdmins);
// course analytics data
router.get('/last12MonthsDataOfCourse', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast12MonthsDataOfCourse);
router.get('/last30DaysDataOfCourse', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast30DaysDataOfCourse);
router.get('/last24HoursDataOfCourse', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast24HoursDataOfCourse);
// user analytics data
router.get('/last12MonthsDataOfUser', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast12MonthsDataOfUser);
router.get('/last30DaysDataOfUser', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast30DaysDataOfUser);
router.get('/last24HoursDataOfUser', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast24HoursDataOfUser);
// order analytics data
router.get('/last12MonthsDataOfOrder', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast12MonthsDataOfOrder);
router.get('/last30DaysDataOfOrder', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast30DaysDataOfOrder);
router.get('/last24HoursDataOfOrder', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN"), analyticsController_1.getLast24HoursDataOfOrder);
exports.default = router;
