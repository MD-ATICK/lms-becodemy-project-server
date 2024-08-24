import express from 'express'
import { addCommentReply, addReview, getSingleReview } from './controller';
import { authorizeUser } from '../../middlewares/userAuth';
const router = express.Router()

router.get('/get-single/:id', getSingleReview)
router.post('/add', authorizeUser, addReview)
router.post('/comment-reply', authorizeUser, addCommentReply)

export default router;