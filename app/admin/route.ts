
import express from 'express';
import { rolesAuth } from '../../middlewares/authRoles';
import { authorizeUser } from '../../middlewares/userAuth';
import { getLast12MonthsDataOfCourse, getLast12MonthsDataOfOrder, getLast12MonthsDataOfUser, getLast24HoursDataOfCourse, getLast24HoursDataOfOrder, getLast24HoursDataOfUser, getLast30DaysDataOfCourse, getLast30DaysDataOfOrder, getLast30DaysDataOfUser } from './analyticsController';
import { deleteCourse, deleteUser, listAdmins, listCourses, listOrders, listUsers, makeAdmins, removeAdmins, vdoCipherUploadVideo } from './controller';
const router = express.Router()

router.get('/users', authorizeUser, rolesAuth("ADMIN"), listUsers)
router.get('/admins', authorizeUser, rolesAuth("ADMIN"), listAdmins)
router.get('/courses', authorizeUser, rolesAuth("ADMIN"), listCourses)
router.get('/orders', authorizeUser, rolesAuth("ADMIN"), listOrders)
router.delete('/deleteUser/:id', authorizeUser, rolesAuth("ADMIN"), deleteUser)
router.delete('/deleteCourse/:id', authorizeUser, rolesAuth("ADMIN"), deleteCourse)

router.post('/vdoCipherUpload', vdoCipherUploadVideo)

router.post('/make-admin', makeAdmins)
router.post('/remove-admin', removeAdmins)


// course analytics data
router.get('/last12MonthsDataOfCourse', authorizeUser, rolesAuth("ADMIN"), getLast12MonthsDataOfCourse)
router.get('/last30DaysDataOfCourse', authorizeUser, rolesAuth("ADMIN"), getLast30DaysDataOfCourse)
router.get('/last24HoursDataOfCourse', authorizeUser, rolesAuth("ADMIN"), getLast24HoursDataOfCourse)


// user analytics data
router.get('/last12MonthsDataOfUser', authorizeUser, rolesAuth("ADMIN"), getLast12MonthsDataOfUser)
router.get('/last30DaysDataOfUser', authorizeUser, rolesAuth("ADMIN"), getLast30DaysDataOfUser)
router.get('/last24HoursDataOfUser', authorizeUser, rolesAuth("ADMIN"), getLast24HoursDataOfUser)


// order analytics data
router.get('/last12MonthsDataOfOrder', authorizeUser, rolesAuth("ADMIN"), getLast12MonthsDataOfOrder)
router.get('/last30DaysDataOfOrder', authorizeUser, rolesAuth("ADMIN"), getLast30DaysDataOfOrder)
router.get('/last24HoursDataOfOrder', authorizeUser, rolesAuth("ADMIN"), getLast24HoursDataOfOrder)

export default router;