import express from 'express';
import { rolesAuth } from '../../middlewares/authRoles';
import { authorizeUser } from '../../middlewares/userAuth';
import { allCourses, courseByPurchaseUser, createCourse, deleteManyCourse, deleteSingleCourse, editCourse, singleCourse } from './controller';
const router = express.Router()

router.post('/create', authorizeUser, rolesAuth("ADMIN", "USER"), createCourse)
router.put('/edit/:id', authorizeUser, rolesAuth("ADMIN", "USER"), editCourse)
router.get('/single-course/:id', singleCourse)
router.get('/all-courses', allCourses)
router.delete('/delete-single-course/:id', deleteSingleCourse)
router.delete('/delete-many-courses', deleteManyCourse)

// purchase user
router.get('/purchase-user-course-content/:id', authorizeUser, courseByPurchaseUser)

export default router;