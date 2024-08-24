
import express from 'express';
import { rolesAuth } from '../../middlewares/authRoles';
import { authorizeUser } from '../../middlewares/userAuth';
import { deleteCourse, deleteUser, getLast12MonthDataOfCourse, getLast12MonthDataOfOrder, getLast12MonthDataOfUser, listCourses, listOrders, listUsers } from './controller';
const router = express.Router()

router.get('/users', authorizeUser, rolesAuth("ADMIN"), listUsers)
router.get('/courses', authorizeUser, rolesAuth("ADMIN"), listCourses)
router.get('/orders', authorizeUser, rolesAuth("ADMIN"), listOrders)
router.delete('/deleteUser/:id', authorizeUser, rolesAuth("ADMIN"), deleteUser)
router.delete('/deleteCourse/:id', authorizeUser, rolesAuth("ADMIN"), deleteCourse)

router.get('/last12MonthDataOfUser', authorizeUser, rolesAuth("ADMIN"), getLast12MonthDataOfUser)
router.get('/last12MonthDataOfCourse', authorizeUser, rolesAuth("ADMIN"), getLast12MonthDataOfCourse)
router.get('/last12MonthDataOfOrder', authorizeUser, rolesAuth("ADMIN"), getLast12MonthDataOfOrder)

export default router;