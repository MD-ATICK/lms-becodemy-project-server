import * as z from 'zod'

export const reviewSchema = z.object({
    rating: z.number(),
    comment: z.string().nonempty('comment is required'),
    courseId: z.string().nonempty('courseId is required'),
})


export const replyToReviewSchema = z.object({
    reviewId: z.string().nonempty('courseId is required'),
    reply: z.string().nonempty('courseId is required'),
})