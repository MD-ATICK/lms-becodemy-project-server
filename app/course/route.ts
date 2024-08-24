import express from 'express';
import { rolesAuth } from '../../middlewares/authRoles';
import { authorizeUser } from '../../middlewares/userAuth';
import { allCourses, courseByPurchaseUser, createCourse, editCourse, singleCourse } from './controller';
const router = express.Router()

router.post('/create', authorizeUser, rolesAuth("ADMIN", "USER"), createCourse)
router.put('/edit/:id', authorizeUser, rolesAuth("ADMIN", "USER"), editCourse)
router.get('/single-course/:id', singleCourse)
router.get('/all-courses', allCourses)

// purchase user
router.get('/purchase-user-course-content/:id', authorizeUser, courseByPurchaseUser)

export default router;