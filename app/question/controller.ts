import { } from '@prisma/client';
import { Request, Response } from "express";
import { redis } from '..';
import { db } from "../../utils/db";
import { sendMail } from "../../utils/mail";
import { getQuestionsByCourseVideoID } from '../../utils/questions';
import { errorReturn, successReturn } from "../../utils/response";



const time = 60 * 60

export const singleVideoQuestions = async (req: Request, res: Response) => {
    try {

        const { courseVideoId } = req.params
        const redisData = await redis.get(courseVideoId)
        if (redisData) {
            console.log('redis question')
            return successReturn(res, "GET", JSON.parse(redisData))
        }

        const questions = await getQuestionsByCourseVideoID(courseVideoId)

        await redis.setex(courseVideoId, time, JSON.stringify(questions))

        successReturn(res, "GET", questions)

    } catch (error) {
        errorReturn(res, (error as Error).message)

    }
}

// course video id : 66b375445c65b63886655e09
export const addQuestion = async (req: Request, res: Response) => {
    try {

        const { question, courseVideoId } = req.body;
        if (!req.loggedUser) throw new Error('please login!')

        if (!question || !courseVideoId) throw new Error('question , courseVideoId is required')
        const userId = req.loggedUser?.id

        const newQuestion = await db.question.create({
            data: {
                question,
                courseVideoId,
                userId
            },
            include: {
                questionAnswers: true
            }
        })
        const courseVideo = await db.courseVideo.findFirstOrThrow({ where: { id: courseVideoId } })

        const questions = await getQuestionsByCourseVideoID(courseVideoId)
        await redis.setex(courseVideoId, time, JSON.stringify(questions))

        const notification = await db.notification.create({
            data: {
                userId: req.loggedUser.id,
                title: "New Question.",
                message: `You have a new question of ${courseVideo.title} video.`
            }
        })


        successReturn(res, "POST", { newQuestion, notification })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


// question : 66b70de0fa4b363af47fd176
export const addQuestionAnswer = async (req: Request, res: Response) => {
    try {

        const { questionId, answer } = req.body
        const userId = req.loggedUser?.id

        if (!req.loggedUser) throw new Error('please login!')

        if (!answer || !questionId) throw new Error('answer , questionId is required')

        const question = await db.question.findFirstOrThrow({ where: { id: questionId }, include: { user: true, courseVideo: true } })
        if (!question.user?.id) throw new Error('please login!')

        const qusAnswer = await db.questionAnswer.create({
            data: {
                answer,
                userId,
                questionId
            }
        })

        const courseVideo = await db.courseVideo.findFirstOrThrow({ where: { id: question.courseVideo?.id } })

        const questions = await getQuestionsByCourseVideoID(courseVideo.id)
        await redis.setex(courseVideo.id, time, JSON.stringify(questions))

        if (userId === question.user.id) {


            await db.notification.create({
                data: {
                    userId: req.loggedUser.id,
                    title: "New Question.",
                    message: `You have a new question of ${courseVideo.title} video.`
                }
            })

            return successReturn(res, "POST", qusAnswer)
        }

        try {
            await sendMail({ name: question.user.name, title: question.courseVideo?.title }, question.user.email, "a user reply your question.", "question-reply.ejs")
        } catch (error) {
            throw error;
        }

        successReturn(res, "POST", qusAnswer)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}