"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoles_1 = require("../../middlewares/authRoles");
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/create', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN", "USER"), controller_1.createCourse);
router.put('/edit/:id', userAuth_1.authorizeUser, (0, authRoles_1.rolesAuth)("ADMIN", "USER"), controller_1.editCourse);
router.get('/single-course/:id', controller_1.singleCourse);
router.get('/all-courses', controller_1.allCourses);
router.delete('/delete-single-course/:id', controller_1.deleteSingleCourse);
router.delete('/delete-many-courses', controller_1.deleteManyCourse);
// purchase user
router.get('/purchase-user-course-content/:id', userAuth_1.authorizeUser, controller_1.courseByPurchaseUser);
exports.default = router;
