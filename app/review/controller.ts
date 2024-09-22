import { Request, Response } from "express";
import { redis } from "..";
import { replyToReviewSchema, reviewSchema } from "../../schemas/reviewSchema";
import { db } from "../../utils/db";
import { errorReturn, successReturn } from "../../utils/response";
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
            include: { user: true, commentReplies: true, course: true }
        })


        // todo : send a notification to course admin.
        const redisData = await redis.get(courseId + 'review')
        if (redisData) {
            const parseRedisData = JSON.parse(redisData)
            await redis.setex(courseId + 'review', 60 * 60, JSON.stringify([newReview, ...parseRedisData]))
        }

        if (!redisData) {
            const reviews = await db.review.findMany({ where: { courseId }, include: { user: true, commentReplies: true } })
            await redis.setex(courseId + 'review', 60 * 60, JSON.stringify(reviews))
        }

        const notification = await db.notification.create({
            data: {
                userId: req.loggedUser.id,
                title: `New review form ${req.loggedUser.name}`,
                message: `You get a reviews in ${newReview.course.name} course.`
            }
        })
        successReturn(res, "POST", { newReview, notification })

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}

export const reviewList = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId
        const redisReviews = await redis.get(courseId + 'review')
        if (redisReviews) {
            console.log('redis reviews')
            return successReturn(res, "GET", JSON.parse(redisReviews))
        }

        const reviews = await db.review.findMany({ where: { courseId }, include: { user: true, commentReplies: true }, orderBy: { createdAt: "desc" } })
        await redis.setex(courseId + 'review', 60 * 60, JSON.stringify(reviews))

        successReturn(res, "GET", reviews)
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}


export const addCommentReply = async (req: Request, res: Response) => {
    try {


        const { error, data } = replyToReviewSchema.safeParse(req.body)
        if (error) return zodErrorToString(error.errors)

        const { reviewId, reply } = data


        const addReply = await db.commentReply.create({
            data: {
                commentReply: reply,
                reviewId,
                userId: req.loggedUser?.id
            }
        })

        const review = await db.review.findFirstOrThrow({ where: { id: reviewId }, include: { user: true, commentReplies: true } })

        const redisData = await redis.get(review.courseId + 'review')
        if (redisData) {
            const parseRedisData = JSON.parse(redisData)
            const storeData = parseRedisData.map((r: any) => r.id === reviewId && review)
            await redis.setex(review.courseId + 'review', 60 * 60, JSON.stringify(storeData))
        }

        if (!redisData) {
            const reviews = await db.review.findMany({ where: { courseId: review.courseId }, include: { user: true, commentReplies: true }, orderBy: { createdAt: "desc" } })
            await redis.setex(review.courseId + 'review', 60 * 60, JSON.stringify(reviews))
        }

        successReturn(res, "POST", addReply)

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}