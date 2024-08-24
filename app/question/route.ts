import express from 'express'
import { addQuestion, addQuestionAnswer } from './controller'
import { authorizeUser } from '../../middlewares/userAuth';
const router = express.Router()

router.post('/add', authorizeUser, addQuestion)
router.post('/answer-question', authorizeUser, addQuestionAnswer)

export default router;