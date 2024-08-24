import { Request, Response } from "express";
import { errorReturn, successReturn } from "../../utils/response";
import { db } from "../../utils/db";
import { replyToReviewSchema, reviewSchema } from "../../schemas/reviewSchema";
import { zodErrorToString } from "../../utils/zodErrorToString";


// courseId: 66b71cbd6c363240274e966b 
// reviewId : 66b7742efc06f0c7fdf3558e

export const getSingleReview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const review = await db.review.findFirstOrThrow({ where: { id }, include: { commentReplies: true } })

        successReturn(res, "GET", review)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const addReview = async (req: Request, res: Response) => {
    try {

        const { error, data } = reviewSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { courseId, comment, rating } = data

        if (!req.loggedUser || !courseId) throw new Error('unauthenticated')

        const loggedUser = await db.user.findFirstOrThrow({ where: { id: req.loggedUser.id }, include: { purchasedCourses: true } })
        const isCoursePurchased = loggedUser.purchasedCourses.find(course => course.id === courseId)
        if (isCoursePurchased) throw new Error('you have not access to review this course!')

        const newReview = await db.review.create({
            data: {
                rating,
                userId: req.loggedUser.id,
                comment,
                courseId
            },
            include: { user: true }
        })


        // todo : send a notification to course admin.

        successReturn(res, "POST", newReview)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const addCommentReply = async (req: Request, res: Response) => {
    try {


        const { error, data } = replyToReviewSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { reviewId, commentReply } = data

        const addReply = await db.commentReply.create({
            data: {
                commentReply,
                reviewId,
                userId: req.loggedUser?.id
            }
        })

        successReturn(res, "POST", addReply)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}