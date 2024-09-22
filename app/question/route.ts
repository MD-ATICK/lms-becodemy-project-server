import express from 'express';
import { authorizeUser } from '../../middlewares/userAuth';
import { addQuestion, addQuestionAnswer, singleVideoQuestions } from './controller';
const router = express.Router()

router.get('/question/:courseVideoId', authorizeUser, singleVideoQuestions)
router.post('/add-question', authorizeUser, addQuestion)
router.post('/add-answer', authorizeUser, addQuestionAnswer)

export default router;