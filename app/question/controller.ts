import { } from '@prisma/client';
import { Request, Response } from "express";
import { db } from "../../utils/db";
import { sendMail } from "../../utils/mail";
import { errorReturn, successReturn } from "../../utils/response";


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
            }
        })

        const courseVideo = await db.courseVideo.findFirstOrThrow({ where: { id: courseVideoId } })

        await db.notification.create({
            data: {
                userId: req.loggedUser.id,
                title: "New Question.",
                message: `You have a new question of ${courseVideo.title} video.`
            }
        })


        successReturn(res, "POST", newQuestion)

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


        if (userId === question.user.id) {
            const courseVideo = await db.courseVideo.findFirstOrThrow({ where: { id: question.courseVideo?.id } })

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