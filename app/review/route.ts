import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { addCommentReply, addReview, getSingleReview, reviewList } from './controller';
const router = express.Router()

router.get('/get-single/:id', getSingleReview)
router.get('/reviewList/:courseId', authorizeUser, reviewList)
router.post('/add-review', authorizeUser, addReview)
router.post('/add-reply', authorizeUser, addCommentReply)

export default router;